/**
 * Recommendation Engine Controller
 * 
 * Orchestrates the full discoverability audit and advisory generation cycle:
 * 1. Validates body parameters (Business, Category, City).
 * 2. Compiles queries and triggers automated crawling/scraping runs.
 * 3. Extracts brand mentions and citation frequencies/positions.
 * 4. Scribes website SEO, reviews, and community indicators.
 * 5. Runs recommendationEngine to detect gaps and compile prioritised actions.
 * 6. Returns a structured JSON advisory scorecard to the client.
 */

const { generateQueries } = require('../services/queryGeneratorService');
const { runPerplexity } = require('../playwright/perplexityRunner');
const { extractBusinesses } = require('../services/extractBusinessService');
const { compileFrequencyData } = require('../services/frequencyService');
const { getBrandMetrics } = require('../services/mockCompetitorData');
const { generateRecommendations } = require('../recommendations/recommendationEngine');

/**
 * Generates prioritized discoverability recommendations.
 * POST /api/recommendations/generate
 */
const runRecommendationGenerator = async (req, res, next) => {
  try {
    const { business, category, city } = req.body;

    // 1. INPUT VALIDATION
    if (!business || !category || !city) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Please supply: business, category, and city.'
      });
    }

    console.log(`[Recommendations Controller]: Initiating discoverability advisory for: "${business}"`);

    // 2. QUERY GENERATION & CRAWLS
    const queries = generateQueries(category, city);
    const queryResults = [];

    // Loop queries sequentially (Playwright anti-bot fallback enabled)
    for (const query of queries) {
      try {
        const rawResponse = await runPerplexity(query, business, category, city);
        const parsed = extractBusinesses(rawResponse);
        queryResults.push({ query, results: parsed, rawResponse });
      } catch (err) {
        console.error(`[Recommendations Controller]: Crawl failed for "${query}":`, err.message);
        queryResults.push({ query, results: [], rawResponse: `Crawl error: ${err.message}` });
      }
    }

    // 3. COMPILE FREQUENCY DATA
    const frequencyData = compileFrequencyData(queryResults);

    // 4. EXTRACT TARGET BRAND METRICS PROFILE
    const targetKey = Object.keys(frequencyData).find(
      k => k.toLowerCase() === business.toLowerCase().trim()
    );
    const targetMentions = targetKey ? frequencyData[targetKey].mentions : 0;
    const targetAvgPos = targetKey ? frequencyData[targetKey].averagePosition : 0;

    const targetProfile = {
      ...getBrandMetrics(business),
      mentions: targetMentions,
      averagePosition: targetAvgPos
    };

    // 5. RUN RECOMMENDATION ENGINE (WEAKNESS DETECT & MAP CHECKS)
    const prioritizedRecommendations = generateRecommendations(targetProfile);

    // 6. DELIVER FINAL STRUCTURED RESPONSE
    res.status(200).json({
      success: true,
      business,
      recommendations: prioritizedRecommendations
    });

  } catch (error) {
    console.error('[Recommendations Controller Error]: Recommendation generation failed:', error);
    next(error);
  }
};

module.exports = {
  runRecommendationGenerator
};
