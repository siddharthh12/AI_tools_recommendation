const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/healthController');

// Health Check Route
router.get('/health', getHealth);

// In Phase 2: Add additional routes for business scans, rankings, and analysis
// Example Placeholder Scanner Route
router.post('/scan', (req, res, next) => {
  try {
    const { businessName, industry, competitors } = req.body;

    if (!businessName) {
      return res.status(400).json({
        success: false,
        message: "Business name is required to perform a scan."
      });
    }

    // Process mock visibility calculation (Phase 1 placeholder)
    // Simulate scoring calculations
    const cleanCompetitors = competitors ? competitors.split(',').map(c => c.trim()) : [];
    
    // Generates static, reproducible mock data based on input lengths to look authentic
    const hash = (businessName.length + (industry ? industry.length : 0)) % 10;
    const baseScore = 65 + hash * 3; // score between 65 and 95
    
    const results = {
      businessName,
      industry: industry || "General",
      overallScore: baseScore,
      breakdown: {
        chatgpt: Math.round(baseScore * 0.95),
        claude: Math.round(baseScore * 1.02),
        gemini: Math.round(baseScore * 0.88),
        perplexity: Math.round(baseScore * 0.98)
      },
      competitors: cleanCompetitors.map((comp, idx) => ({
        name: comp,
        score: Math.min(100, Math.round(baseScore - (idx + 1) * 4 + (hash % 3)))
      })),
      recommendations: [
        `Optimize schema markup on your homepage for '${industry || 'your industry'}' standard terms to boost discovery in Claude crawler queries.`,
        `Author comprehensive, data-rich case studies highlighting how '${businessName}' solves problems to improve ranking in Gemini semantic search results.`,
        `Build back-links from high-authority brand catalogs to help ChatGPT's search indexes associate you with your primary competitors.`
      ]
    };

    res.status(200).json({
      success: true,
      message: "AI Discoverability analysis complete",
      data: results
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
