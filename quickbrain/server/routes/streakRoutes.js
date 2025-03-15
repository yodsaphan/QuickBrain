const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/streaks
// @desc    Get user streak
// @access  Private
router.get('/', protect, streakController.getUserStreak);

// @route   GET /api/streaks/history
// @desc    Get user streak history
// @access  Private
router.get('/history', protect, streakController.getStreakHistory);

// @route   GET /api/streaks/milestones
// @desc    Get user streak milestones
// @access  Private
router.get('/milestones', protect, streakController.getStreakMilestones);

// @route   GET /api/streaks/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', streakController.getLeaderboard);

// @route   POST /api/streaks/update
// @desc    Update streak manually (for testing)
// @access  Private (Admin only)
router.post('/update', [protect, authorize('admin')], streakController.updateStreak);

module.exports = router; 