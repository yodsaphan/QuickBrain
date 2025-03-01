const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/fileUpload');

// @route   GET /api/videos
// @desc    Get all videos (paginated)
// @access  Public
router.get('/', videoController.getVideos);

// @route   GET /api/videos/:id
// @desc    Get video by ID
// @access  Public
router.get('/:id', videoController.getVideoById);

// @route   POST /api/videos
// @desc    Create a new video
// @access  Private
router.post(
  '/',
  [
    protect,
    upload.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('topic', 'Topic is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric()
  ],
  videoController.createVideo
);

// @route   PUT /api/videos/:id
// @desc    Update video
// @access  Private
router.put(
  '/:id',
  [
    protect,
    check('title', 'Title is required').optional(),
    check('description', 'Description is required').optional(),
    check('subject', 'Subject is required').optional(),
    check('topic', 'Topic is required').optional(),
    check('duration', 'Duration is required').optional().isNumeric(),
    check('isPublished', 'isPublished must be a boolean').optional().isBoolean()
  ],
  videoController.updateVideo
);

// @route   DELETE /api/videos/:id
// @desc    Delete video
// @access  Private
router.delete('/:id', protect, videoController.deleteVideo);

// @route   POST /api/videos/:id/watch
// @desc    Mark video as watched
// @access  Private
router.post('/:id/watch', protect, videoController.markVideoWatched);

module.exports = router; 