const { db } = require('../config/firebase');

/**
 * @desc    Get user streak
 * @route   GET /api/streaks
 * @access  Private
 */
exports.getUserStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get streak document
    const streakDoc = await db.collection('streaks').doc(userId).get();
    
    if (!streakDoc.exists) {
      // Create streak document if it doesn't exist
      const newStreak = {
        user: userId,
        count: 0,
        lastUpdated: new Date(),
        history: [],
        milestones: [5, 10, 20, 30, 50].map(level => ({
          level,
          achieved: false
        }))
      };
      
      await db.collection('streaks').doc(userId).set(newStreak);
      
      return res.json({
        success: true,
        streak: newStreak
      });
    }
    
    const streakData = streakDoc.data();
    
    // Check if streak needs to be reset (if more than 24 hours since last update)
    const lastUpdated = streakData.lastUpdated.toDate();
    const now = new Date();
    const diffHours = Math.abs(now - lastUpdated) / 36e5; // Convert to hours
    
    if (diffHours > 24) {
      // Reset streak
      const resetStreak = {
        ...streakData,
        count: 0,
        lastUpdated: now
      };
      
      await db.collection('streaks').doc(userId).update({
        count: 0,
        lastUpdated: now
      });
      
      // Update user's streak count
      await db.collection('users').doc(userId).update({
        streakCount: 0
      });
      
      return res.json({
        success: true,
        streak: resetStreak,
        message: 'Streak reset due to inactivity'
      });
    }
    
    res.json({
      success: true,
      streak: streakData
    });
  } catch (error) {
    console.error('Get user streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching streak'
    });
  }
};

/**
 * @desc    Get user streak history
 * @route   GET /api/streaks/history
 * @access  Private
 */
exports.getStreakHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get streak document
    const streakDoc = await db.collection('streaks').doc(userId).get();
    
    if (!streakDoc.exists) {
      return res.json({
        success: true,
        history: []
      });
    }
    
    const streakData = streakDoc.data();
    
    // Get history with additional details
    const history = await Promise.all(streakData.history.map(async (item) => {
      let sourceDetails = null;
      
      if (item.source === 'video' && item.sourceId) {
        // Get video details
        const videoDoc = await db.collection('videos').doc(item.sourceId).get();
        if (videoDoc.exists) {
          const videoData = videoDoc.data();
          sourceDetails = {
            title: videoData.title,
            thumbnailUrl: videoData.thumbnailUrl
          };
        }
      } else if (item.source === 'game' && item.sourceId) {
        // Get game details
        const gameDoc = await db.collection('games').doc(item.sourceId).get();
        if (gameDoc.exists) {
          const gameData = gameDoc.data();
          sourceDetails = {
            title: gameData.title,
            score: gameData.score
          };
        }
      }
      
      return {
        ...item,
        sourceDetails
      };
    }));
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get streak history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching streak history'
    });
  }
};

/**
 * @desc    Get user streak milestones
 * @route   GET /api/streaks/milestones
 * @access  Private
 */
exports.getStreakMilestones = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get streak document
    const streakDoc = await db.collection('streaks').doc(userId).get();
    
    if (!streakDoc.exists) {
      return res.json({
        success: true,
        milestones: [5, 10, 20, 30, 50].map(level => ({
          level,
          achieved: false
        }))
      });
    }
    
    const streakData = streakDoc.data();
    
    res.json({
      success: true,
      milestones: streakData.milestones
    });
  } catch (error) {
    console.error('Get streak milestones error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching streak milestones'
    });
  }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/streaks/leaderboard
 * @access  Public
 */
exports.getLeaderboard = async (req, res) => {
  try {
    // Get top 10 users by streak count
    const usersSnapshot = await db.collection('users')
      .orderBy('streakCount', 'desc')
      .limit(10)
      .get();
    
    const leaderboard = usersSnapshot.docs.map(doc => {
      const userData = doc.data();
      return {
        id: doc.id,
        username: userData.username,
        profilePic: userData.profilePic,
        streakCount: userData.streakCount || 0
      };
    });
    
    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
};

/**
 * @desc    Update streak manually (for testing)
 * @route   POST /api/streaks/update
 * @access  Private (Admin only)
 */
exports.updateStreak = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }
    
    const { userId, points, source, sourceId } = req.body;
    
    if (!userId || !points) {
      return res.status(400).json({
        success: false,
        message: 'User ID and points are required'
      });
    }
    
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
            source: source || 'manual',
            sourceId: sourceId || null
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
      
      return res.json({
        success: true,
        message: 'Streak created successfully'
      });
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
      source: source || 'manual',
      sourceId: sourceId || null
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
    
    res.json({
      success: true,
      message: 'Streak updated successfully'
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating streak'
    });
  }
}; 