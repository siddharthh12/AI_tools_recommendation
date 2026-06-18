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
