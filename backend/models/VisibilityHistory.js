/**
 * VisibilityHistory Mongoose Model
 * 
 * Stores historical records of AI visibility scans for user businesses.
 */

const mongoose = require('mongoose');

const VisibilityHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  scanDate: {
    type: Date,
    default: Date.now
  },
  overallVisibility: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  platforms: {
    chatgpt: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    gemini: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    perplexity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  competitors: [
    {
      name: {
        type: String,
        required: true
      },
      visibility: {
        type: Number,
        default: 0
      },
      averagePosition: {
        type: Number,
        default: 0
      }
    }
  ]
});

// Compound index for fast timeline queries per user & business
VisibilityHistorySchema.index({ userId: 1, businessName: 1, scanDate: -1 });

module.exports = mongoose.model('VisibilityHistory', VisibilityHistorySchema);
