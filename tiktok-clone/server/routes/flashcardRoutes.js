const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const flashcardController = require('../controllers/flashcardController');
const { protect } = require('../middleware/auth');

// @route   GET /api/flashcards/video/:videoId
// @desc    Get flashcards for a video
// @access  Public
router.get('/video/:videoId', flashcardController.getFlashcardsByVideo);

// @route   POST /api/flashcards
// @desc    Create flashcards for a video
// @access  Private
router.post(
  '/',
  [
    protect,
    check('video', 'Video ID is required').not().isEmpty(),
    check('questions', 'Questions are required').isArray({ min: 1 }),
    check('questions.*.question', 'Question text is required').not().isEmpty(),
    check('questions.*.options', 'Options are required').isArray({ min: 2 }),
    check('questions.*.correctAnswer', 'Correct answer is required').not().isEmpty()
  ],
  flashcardController.createFlashcards
);

// @route   PUT /api/flashcards/:id
// @desc    Update flashcards
// @access  Private
router.put(
  '/:id',
  [
    protect,
    check('questions', 'Questions are required').isArray({ min: 1 }),
    check('questions.*.question', 'Question text is required').not().isEmpty(),
    check('questions.*.options', 'Options are required').isArray({ min: 2 }),
    check('questions.*.correctAnswer', 'Correct answer is required').not().isEmpty()
  ],
  flashcardController.updateFlashcards
);

// @route   DELETE /api/flashcards/:id
// @desc    Delete flashcards
// @access  Private
router.delete('/:id', protect, flashcardController.deleteFlashcards);

// @route   POST /api/flashcards/game
// @desc    Submit flashcard game results
// @access  Private
router.post(
  '/game',
  [
    protect,
    check('flashcardsId', 'Flashcards ID is required').not().isEmpty(),
    check('score', 'Score is required').isNumeric(),
    check('totalQuestions', 'Total questions is required').isNumeric()
  ],
  flashcardController.submitGameResults
);

// @route   GET /api/flashcards/games
// @desc    Get user game history
// @access  Private
router.get('/games', protect, flashcardController.getUserGames);

module.exports = router; 