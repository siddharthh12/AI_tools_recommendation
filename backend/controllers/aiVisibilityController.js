/**
 * AI Visibility Controller
 * 
 * Validates request parameters and triggers the AI Visibility orchestrator engine.
 */

const { runAiVisibilityEngine } = require('../ai-visibility/aiVisibilityEngine');

/**
 * Runs the AI visibility discoverability audit.
 * POST /api/ai-visibility/run
 */
async function runVisibilityAudit(req, res, next) {
  try {
    const { brand, category, location, competitors } = req.body;

    console.log('[AI Visibility Controller]: Received run request.');

    // Validate inputs
    if (!brand || !category || !location) {
      console.warn('[AI Visibility Controller]: Missing validation parameters.');
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Please supply: brand, category, and location.'
      });
    }

    // Run visibility audit
    const result = await runAiVisibilityEngine({
      brand,
      category,
      location,
      competitors
    }, (msg, type) => {
      console.log(`[AI Visibility Engine][${type}]: ${msg}`);
    });

    if (result.success) {
      // Automatically save to MongoDB history if authenticated
      if (req.user) {
        try {
          const VisibilityHistory = require('../models/VisibilityHistory');
          
          const targetOverall = result.visibility.find(v => v.name.toLowerCase() === brand.toLowerCase()) || { visibility: 0 };
          const overallScore = targetOverall.visibility;

          const getPlatformScore = (plat) => {
            const stats = result.platformStats[plat] || [];
            const brandStat = stats.find(s => s.name.toLowerCase() === brand.toLowerCase());
            return brandStat ? brandStat.visibility : 0;
          };

          const competitorsList = result.visibility
            .filter(v => v.name.toLowerCase() !== brand.toLowerCase())
            .map(c => ({
              name: c.name,
              visibility: c.visibility,
              averagePosition: c.averagePosition
            }));

          const newScanHistory = new VisibilityHistory({
            userId: req.user._id,
            businessName: brand,
            category: category,
            location: location,
            scanDate: new Date(),
            overallVisibility: overallScore,
            platforms: {
              chatgpt: getPlatformScore('chatgpt'),
              gemini: getPlatformScore('gemini'),
              perplexity: getPlatformScore('perplexity')
            },
            competitors: competitorsList
          });

          await newScanHistory.save();
          console.log(`[AI Visibility Controller]: Successfully saved visibility scan to MongoDB for user "${req.user.email}" and brand "${brand}"`);
        } catch (dbErr) {
          console.error('[AI Visibility Controller Warning]: Failed to save scan to MongoDB:', dbErr.message);
        }
      }

      return res.status(200).json(result);
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || 'AI Visibility execution failed.',
        debug: result.debug
      });
    }

  } catch (error) {
    console.error('[AI Visibility Controller Critical Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'An unexpected failure occurred during visibility audit.',
      debug: { logs: [{ timestamp: new Date().toISOString(), component: 'Controller', type: 'error', message: error.message }] }
    });
  }
}

module.exports = {
  runVisibilityAudit
};
