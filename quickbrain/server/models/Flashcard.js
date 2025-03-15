const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  questions: [
    {
      question: {
        type: String,
        required: [true, 'Question text is required']
      },
      options: [
        {
          type: String,
          required: [true, 'Option text is required']
        }
      ],
      correctAnswer: {
        type: Number,
        required: [true, 'Correct answer index is required']
      }
    }
  ],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flashcard', FlashcardSchema); 