const { db } = require('../config/firebase');
const { validationResult } = require('express-validator');

/**
 * @desc    Get flashcards for a video
 * @route   GET /api/flashcards/video/:videoId
 * @access  Public
 */
exports.getFlashcardsByVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // Get flashcards for this video
    const flashcardsSnapshot = await db.collection('flashcards')
      .where('video', '==', videoId)
      .get();
    
    if (flashcardsSnapshot.empty) {
      return res.json({
        success: true,
        flashcards: null
      });
    }
    
    const flashcardsDoc = flashcardsSnapshot.docs[0];
    const flashcardsData = flashcardsDoc.data();
    
    res.json({
      success: true,
      flashcards: {
        id: flashcardsDoc.id,
        ...flashcardsData
      }
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching flashcards'
    });
  }
};

/**
 * @desc    Create flashcards for a video
 * @route   POST /api/flashcards
 * @access  Private
 */
exports.createFlashcards = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { video, questions } = req.body;
    
    // Check if video exists
    const videoDoc = await db.collection('videos').doc(video).get();
    
    if (!videoDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const videoData = videoDoc.data();
    
    // Check if user owns the video or is an admin
    if (videoData.user !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create flashcards for this video'
      });
    }
    
    // Check if flashcards already exist for this video
    const existingFlashcardsSnapshot = await db.collection('flashcards')
      .where('video', '==', video)
      .get();
    
    if (!existingFlashcardsSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Flashcards already exist for this video'
      });
    }
    
    // Create flashcards document
    const flashcardsData = {
      video,
      questions,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const flashcardsRef = await db.collection('flashcards').add(flashcardsData);
    
    res.status(201).json({
      success: true,
      flashcards: {
        id: flashcardsRef.id,
        ...flashcardsData
      }
    });
  } catch (error) {
    console.error('Create flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating flashcards'
    });
  }
};

/**
 * @desc    Update flashcards
 * @route   PUT /api/flashcards/:id
 * @access  Private
 */
exports.updateFlashcards = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const flashcardsId = req.params.id;
    
    // Get flashcards document
    const flashcardsDoc = await db.collection('flashcards').doc(flashcardsId).get();
    
    if (!flashcardsDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Flashcards not found'
      });
    }
    
    const flashcardsData = flashcardsDoc.data();
    
    // Check if user owns the flashcards or is an admin
    if (flashcardsData.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update these flashcards'
      });
    }
    
    const { questions } = req.body;
    
    // Update flashcards document
    await db.collection('flashcards').doc(flashcardsId).update({
      questions,
      updatedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Flashcards updated successfully'
    });
  } catch (error) {
    console.error('Update flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating flashcards'
    });
  }
};

/**
 * @desc    Delete flashcards
 * @route   DELETE /api/flashcards/:id
 * @access  Private
 */
exports.deleteFlashcards = async (req, res) => {
  try {
    const flashcardsId = req.params.id;
    
    // Get flashcards document
    const flashcardsDoc = await db.collection('flashcards').doc(flashcardsId).get();
    
    if (!flashcardsDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Flashcards not found'
      });
    }
    
    const flashcardsData = flashcardsDoc.data();
    
    // Check if user owns the flashcards or is an admin
    if (flashcardsData.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete these flashcards'
      });
    }
    
    // Delete flashcards document
    await db.collection('flashcards').doc(flashcardsId).delete();
    
    res.json({
      success: true,
      message: 'Flashcards deleted successfully'
    });
  } catch (error) {
    console.error('Delete flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting flashcards'
    });
  }
};

/**
 * @desc    Submit flashcard game results
 * @route   POST /api/flashcards/game
 * @access  Private
 */
exports.submitGameResults = async (req, res) => {
  try {
    const { flashcardsId, score, totalQuestions, timeTaken } = req.body;
    
    if (!flashcardsId || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: 'Flashcards ID, score, and total questions are required'
      });
    }
    
    // Get flashcards document
    const flashcardsDoc = await db.collection('flashcards').doc(flashcardsId).get();
    
    if (!flashcardsDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Flashcards not found'
      });
    }
    
    const flashcardsData = flashcardsDoc.data();
    
    // Create game result document
    const gameData = {
      user: req.user.id,
      flashcards: flashcardsId,
      video: flashcardsData.video,
      score,
      totalQuestions,
      timeTaken: timeTaken || 0,
      percentage: Math.round((score / totalQuestions) * 100),
      createdAt: new Date()
    };
    
    const gameRef = await db.collection('games').add(gameData);
    
    // Update user's games played count
    const userDoc = await db.collection('users').doc(req.user.id).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      const gamesPlayed = userData.gamesPlayed || 0;
      const perfectScores = userData.perfectScores || 0;
      
      await db.collection('users').doc(req.user.id).update({
        gamesPlayed: gamesPlayed + 1,
        perfectScores: score === totalQuestions ? perfectScores + 1 : perfectScores
      });
    }
    
    // Update streak if score is good enough (at least 70%)
    if ((score / totalQuestions) >= 0.7) {
      await updateStreak(req.user.id, 1, 'game', gameRef.id);
    }
    
    res.status(201).json({
      success: true,
      game: {
        id: gameRef.id,
        ...gameData
      }
    });
  } catch (error) {
    console.error('Submit game results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting game results'
    });
  }
};

/**
 * @desc    Get user game history
 * @route   GET /api/flashcards/games
 * @access  Private
 */
exports.getUserGames = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's games
    const gamesSnapshot = await db.collection('games')
      .where('user', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const games = [];
    
    for (const doc of gamesSnapshot.docs) {
      const gameData = doc.data();
      
      // Get video data
      const videoDoc = await db.collection('videos').doc(gameData.video).get();
      const videoData = videoDoc.exists ? videoDoc.data() : null;
      
      games.push({
        id: doc.id,
        ...gameData,
        video: videoData ? {
          id: gameData.video,
          title: videoData.title,
          thumbnailUrl: videoData.thumbnailUrl
        } : null
      });
    }
    
    res.json({
      success: true,
      games
    });
  } catch (error) {
    console.error('Get user games error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user games'
    });
  }
};

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