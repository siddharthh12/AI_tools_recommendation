/**
 * Suggestions Controller
 * 
 * Exposes endpoints for loading user custom suggestions, checklists, and comparisons.
 */

const { getOrCreateSuggestions } = require('../ai-recommendations/recommendationService');
const Recommendation = require('../models/Recommendation');

/**
 * Returns compiled visibility suggestions for user's latest scanned business.
 * GET /api/suggestions
 */
const getSuggestions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const playbook = await getOrCreateSuggestions(userId);

    return res.status(200).json({
      success: true,
      playbook
    });
  } catch (error) {
    console.error('[Suggestions Controller getSuggestions Error]:', error.message);
    
    // Check if error is because of missing scans
    if (error.message.includes('No scan history found')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    next(error);
  }
};

/**
 * Returns history comparison of all old generated recommendations.
 * GET /api/suggestions/history
 */
const getSuggestionsHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Retrieve historical recommendations sorted descending
    const history = await Recommendation.find({ userId })
      .select('generatedDate businessName overallHealth summary recommendations')
      .sort({ generatedDate: -1 });

    return res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    console.error('[Suggestions Controller getSuggestionsHistory Error]:', error.message);
    next(error);
  }
};

module.exports = {
  getSuggestions,
  getSuggestionsHistory
};
