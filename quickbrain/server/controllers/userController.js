const { db, auth, storage } = require('../config/firebase');
const { validationResult } = require('express-validator');
const { upload, uploadToS3 } = require('../utils/fileUpload');

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    
    // Get user's videos
    const videosSnapshot = await db.collection('videos')
      .where('user', '==', userId)
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const videos = videosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      user: {
        _id: userId,
        username: userData.username,
        profilePic: userData.profilePic,
        bio: userData.bio,
        role: userData.role,
        videos
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user profile'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id;
    const { username, bio } = req.body;
    
    // Check if username is taken (if changing username)
    if (username && username !== req.user.username) {
      const usernameSnapshot = await db.collection('users')
        .where('username', '==', username)
        .get();
      
      if (!usernameSnapshot.empty) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }
    
    // Update user document
    const updateData = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    
    await db.collection('users').doc(userId).update(updateData);
    
    // Get updated user data
    const updatedUserDoc = await db.collection('users').doc(userId).get();
    const updatedUserData = updatedUserDoc.data();
    
    res.json({
      success: true,
      user: {
        _id: userId,
        username: updatedUserData.username,
        email: updatedUserData.email,
        profilePic: updatedUserData.profilePic,
        bio: updatedUserData.bio,
        role: updatedUserData.role
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user profile'
    });
  }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/users/profile/picture
 * @access  Private
 */
exports.uploadProfilePicture = async (req, res) => {
  try {
    // Upload file to S3
    const profilePicUrl = await uploadToS3(req.file, 'profiles');
    
    // Update user document
    await db.collection('users').doc(req.user.id).update({
      profilePic: profilePicUrl
    });
    
    res.json({
      success: true,
      profilePic: profilePicUrl
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading profile picture'
    });
  }
};

/**
 * @desc    Get user stats
 * @route   GET /api/users/stats
 * @access  Private
 */
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    // Get streak document
    const streakDoc = await db.collection('streaks').doc(userId).get();
    const streakData = streakDoc.exists ? streakDoc.data() : { count: 0 };
    
    // Get video count
    const videosSnapshot = await db.collection('videos')
      .where('user', '==', userId)
      .get();
    
    // Get game scores
    const gameScores = userData.gameScores || [];
    const perfectScores = gameScores.filter(game => game.score === game.totalQuestions).length;
    
    res.json({
      success: true,
      stats: {
        streakCount: streakData.count,
        videosWatched: userData.watchedVideos ? userData.watchedVideos.length : 0,
        videosCreated: videosSnapshot.size,
        gamesPlayed: gameScores.length,
        perfectScores
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user stats'
    });
  }
}; 