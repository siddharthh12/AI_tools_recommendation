/**
 * Recommendation Mongoose Model
 * 
 * Stores the compiled, AI-generated custom optimization roadmap, 
 * competitor comparisons, and expected impact metrics.
 */

const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
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
  scanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisibilityHistory',
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  overallHealth: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
    required: true
  },
  recommendations: [
    {
      title: { type: String, required: true },
      category: { type: String, required: true },
      problem: { type: String, required: true },
      reason: { type: String, required: true },
      recommendation: { type: String, required: true },
      priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
      expectedImpact: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
      estimatedDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
      estimatedTime: { type: String, required: true },
      status: { type: String, enum: ['Completed', 'Pending', 'New'], default: 'New' }
    }
  ],
  roadmap: [
    {
      week: { type: String, required: true },
      task: { type: String, required: true }
    }
  ],
  quickWins: [
    {
      title: { type: String },
      recommendation: { type: String }
    }
  ],
  longTermImprovements: [
    {
      title: { type: String },
      recommendation: { type: String }
    }
  ],
  competitorComparison: [
    {
      name: { type: String, required: true },
      reviewsRating: { type: String, default: '★★★' },
      websiteQuality: { type: String, default: '★★★' },
      aiVisibility: { type: String, default: '★★★' }
    }
  ],
  expectedImprovements: {
    chatgpt: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 }
    },
    gemini: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 }
    },
    perplexity: {
      current: { type: Number, default: 0 },
      target: { type: Number, default: 0 }
    }
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  groqResponse: {
    type: mongoose.Schema.Types.Mixed
  }
});

// Fast indexing for lookups of current and past recommendations
RecommendationSchema.index({ userId: 1, businessName: 1, generatedDate: -1 });

module.exports = mongoose.model('Recommendation', RecommendationSchema);
