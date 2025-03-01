const { db, storage } = require('../config/firebase');
const { validationResult } = require('express-validator');
const { upload, uploadToS3 } = require('../utils/fileUpload');

/**
 * @desc    Get all videos (paginated)
 * @route   GET /api/videos
 * @access  Public
 */
exports.getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, subject } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    let videosQuery = db.collection('videos')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc');
    
    // Filter by subject if provided
    if (subject) {
      videosQuery = videosQuery.where('subject', '==', subject);
    }
    
    // Get total count (for pagination)
    const totalSnapshot = await videosQuery.get();
    const totalVideos = totalSnapshot.size;
    
    // Apply pagination
    const lastDoc = await getLastDocForPagination(videosQuery, pageNumber, limitNumber);
    
    let videosSnapshot;
    if (pageNumber === 1) {
      videosSnapshot = await videosQuery.limit(limitNumber).get();
    } else if (lastDoc) {
      videosSnapshot = await videosQuery.startAfter(lastDoc).limit(limitNumber).get();
    } else {
      // If we can't get the last doc, return empty results
      return res.json({
        success: true,
        count: 0,
        totalPages: Math.ceil(totalVideos / limitNumber),
        currentPage: pageNumber,
        videos: []
      });
    }
    
    // Get videos with user data
    const videos = [];
    for (const doc of videosSnapshot.docs) {
      const videoData = doc.data();
      
      // Get user data
      const userDoc = await db.collection('users').doc(videoData.user).get();
      const userData = userDoc.exists ? userDoc.data() : null;
      
      videos.push({
        id: doc.id,
        ...videoData,
        user: userData ? {
          id: videoData.user,
          username: userData.username,
          profilePic: userData.profilePic
        } : null
      });
    }
    
    res.json({
      success: true,
      count: videos.length,
      totalPages: Math.ceil(totalVideos / limitNumber),
      currentPage: pageNumber,
      videos
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching videos'
    });
  }
};

/**
 * @desc    Get video by ID
 * @route   GET /api/videos/:id
 * @access  Public
 */
exports.getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;
    
    // Get video document
    const videoDoc = await db.collection('videos').doc(videoId).get();
    
    if (!videoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const videoData = videoDoc.data();
    
    // Get user data
    const userDoc = await db.collection('users').doc(videoData.user).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    
    // Get flashcards for this video
    const flashcardsSnapshot = await db.collection('flashcards')
      .where('video', '==', videoId)
      .get();
    
    const flashcards = flashcardsSnapshot.empty ? null : flashcardsSnapshot.docs[0].data();
    
    // Increment view count
    await db.collection('videos').doc(videoId).update({
      views: videoData.views + 1
    });
    
    res.json({
      success: true,
      video: {
        id: videoId,
        ...videoData,
        views: videoData.views + 1, // Return updated view count
        user: userData ? {
          id: videoData.user,
          username: userData.username,
          profilePic: userData.profilePic
        } : null,
        flashcards: flashcards ? flashcards.questions : []
      }
    });
  } catch (error) {
    console.error('Get video by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching video'
    });
  }
};

/**
 * @desc    Create a new video
 * @route   POST /api/videos
 * @access  Private
 */
exports.createVideo = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description, subject, topic, duration, tags } = req.body;
    
    // Upload video to S3
    const videoUrl = await uploadToS3(req.files.video[0], 'videos');
    
    // Upload thumbnail to S3 if provided
    let thumbnailUrl = '/thumbnails/default.jpg';
    if (req.files.thumbnail) {
      thumbnailUrl = await uploadToS3(req.files.thumbnail[0], 'thumbnails');
    }
    
    // Create video document
    const videoData = {
      title,
      description,
      url: videoUrl,
      thumbnailUrl,
      user: req.user.id,
      subject,
      topic,
      duration,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublished: true,
      createdAt: new Date()
    };
    
    const videoRef = await db.collection('videos').add(videoData);
    
    res.status(201).json({
      success: true,
      video: {
        id: videoRef.id,
        ...videoData
      }
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating video'
    });
  }
};

/**
 * @desc    Update video
 * @route   PUT /api/videos/:id
 * @access  Private
 */
exports.updateVideo = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const videoId = req.params.id;
    
    // Get video document
    const videoDoc = await db.collection('videos').doc(videoId).get();
    
    if (!videoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const videoData = videoDoc.data();
    
    // Check if user owns the video
    if (videoData.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this video'
      });
    }
    
    const { title, description, subject, topic, duration, tags, isPublished } = req.body;
    
    // Update video document
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (subject) updateData.subject = subject;
    if (topic) updateData.topic = topic;
    if (duration) updateData.duration = duration;
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    
    await db.collection('videos').doc(videoId).update(updateData);
    
    res.json({
      success: true,
      message: 'Video updated successfully'
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating video'
    });
  }
};

/**
 * @desc    Delete video
 * @route   DELETE /api/videos/:id
 * @access  Private
 */
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    
    // Get video document
    const videoDoc = await db.collection('videos').doc(videoId).get();
    
    if (!videoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const videoData = videoDoc.data();
    
    // Check if user owns the video
    if (videoData.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this video'
      });
    }
    
    // Delete flashcards associated with this video
    const flashcardsSnapshot = await db.collection('flashcards')
      .where('video', '==', videoId)
      .get();
    
    const batch = db.batch();
    
    flashcardsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete comments associated with this video
    const commentsSnapshot = await db.collection('comments')
      .where('video', '==', videoId)
      .get();
    
    commentsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the video document
    batch.delete(db.collection('videos').doc(videoId));
    
    // Commit the batch
    await batch.commit();
    
    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting video'
    });
  }
};

/**
 * @desc    Mark video as watched
 * @route   POST /api/videos/:id/watch
 * @access  Private
 */
exports.markVideoWatched = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id;
    
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    
    // Check if video is already in watchedVideos
    const watchedVideos = userData.watchedVideos || [];
    
    if (!watchedVideos.includes(videoId)) {
      // Add video to watchedVideos
      watchedVideos.push(videoId);
      
      // Update user document
      await db.collection('users').doc(userId).update({
        watchedVideos
      });
      
      // Update streak
      await updateStreak(userId, 1, 'video', videoId);
    }
    
    res.json({
      success: true,
      message: 'Video marked as watched'
    });
  } catch (error) {
    console.error('Mark video watched error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking video as watched'
    });
  }
};

/**
 * Helper function to get the last document for pagination
 */
async function getLastDocForPagination(query, page, limit) {
  if (page === 1) return null;
  
  const snapshot = await query.limit((page - 1) * limit).get();
  
  if (snapshot.empty) return null;
  
  return snapshot.docs[snapshot.docs.length - 1];
}

/**
 * Helper function to update user streak
 */
async function updateStreak(userId, points, source, sourceId) {
  // Get streak document
  const streakDoc = await db.collection('streaks').doc(userId).get();
  
  if (!streakDoc.exists) {
    // Create streak document if it doesn't exist
    await db.collection('streaks').doc(userId).set({
      user: userId,
      count: points,
      lastUpdated: new Date(),
      history: [
        {
          date: new Date(),
          points,
          source,
          sourceId
        }
      ],
      milestones: [5, 10, 20, 30, 50].map(level => ({
        level,
        achieved: level <= points
      }))
    });
    
    // Update user's streak count
    await db.collection('users').doc(userId).update({
      streakCount: points
    });
    
    return;
  }
  
  const streakData = streakDoc.data();
  
  // Update streak count
  const newCount = streakData.count + points;
  
  // Update milestones
  const updatedMilestones = streakData.milestones.map(milestone => {
    if (!milestone.achieved && newCount >= milestone.level) {
      return {
        ...milestone,
        achieved: true,
        achievedAt: new Date()
      };
    }
    return milestone;
  });
  
  // Add to history
  const history = streakData.history || [];
  history.push({
    date: new Date(),
    points,
    source,
    sourceId
  });
  
  // Update streak document
  await db.collection('streaks').doc(userId).update({
    count: newCount,
    lastUpdated: new Date(),
    history,
    milestones: updatedMilestones
  });
  
  // Update user's streak count
  await db.collection('users').doc(userId).update({
    streakCount: newCount
  });
} 