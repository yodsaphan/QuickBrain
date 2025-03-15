const mongoose = require('mongoose');

const StreakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  history: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      points: {
        type: Number,
        required: true
      },
      source: {
        type: String,
        enum: ['video', 'game', 'other'],
        required: true
      },
      sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'source'
      }
    }
  ],
  milestones: [
    {
      level: {
        type: Number,
        required: true
      },
      achieved: {
        type: Boolean,
        default: false
      },
      achievedAt: {
        type: Date
      }
    }
  ]
});

// Define milestone levels
StreakSchema.statics.MILESTONE_LEVELS = [5, 10, 20, 30, 50];

// Initialize milestones
StreakSchema.pre('save', function(next) {
  if (this.isNew) {
    this.milestones = StreakSchema.statics.MILESTONE_LEVELS.map(level => ({
      level,
      achieved: false
    }));
  }
  next();
});

// Update milestones when streak count changes
StreakSchema.pre('save', function(next) {
  if (this.isModified('count')) {
    this.milestones.forEach(milestone => {
      if (!milestone.achieved && this.count >= milestone.level) {
        milestone.achieved = true;
        milestone.achievedAt = Date.now();
      }
    });
  }
  next();
});

module.exports = mongoose.model('Streak', StreakSchema); 