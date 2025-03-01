const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/fileUpload');

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', userController.getUserProfile);

// @route   PUT /api/users
// @desc    Update user profile
// @access  Private
router.put(
  '/',
  [
    protect,
    check('username', 'Username is required').optional(),
    check('bio', 'Bio cannot exceed 150 characters').optional().isLength({ max: 150 })
  ],
  userController.updateUserProfile
);

// @route   POST /api/users/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post(
  '/profile-picture',
  [
    protect,
    upload.single('profilePicture')
  ],
  userController.uploadProfilePicture
);

// @route   GET /api/users/stats
// @desc    Get user stats
// @access  Private
router.get('/stats', protect, userController.getUserStats);

module.exports = router; 