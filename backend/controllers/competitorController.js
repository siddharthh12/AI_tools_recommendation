/**
 * Real Competitor Controller
 * 
 * Orchestrates the Playwright real-time competitor discovery pipeline:
 * 1. Validates input body coordinates (brand, category, location).
 * 2. Initializes the session logger.
 * 3. Generates high-fidelity localized Google search queries.
 * 4. Iteratively launches Playwright Chromium to crawl Google Search.
 * 5. Extracts competitors and eliminates paid ads or general directory sites.
 * 6. Deduplicates and sanitizes business name entries.
 * 7. Returns clean competitors, queries, and browser logs back to the frontend.
 */

const { generateQueries } = require('../search/queryGenerator');
const { runGoogleSearch, runGoogleSearches } = require('../search/googleSearchRunner');
const { extractCompetitors } = require('../search/competitorExtractor');
const { cleanCompetitorsData } = require('../search/dataCleaner');
const logger = require('../search/searchLogger');

/**
 * Handles real competitor discovery crawls.
 * POST /api/search/competitors
 */
const getCompetitors = async (req, res, next) => {
  // 1. Reset logger for a fresh session
  logger.reset();

  try {
    const { brand, category, location } = req.body;

    logger.log('Controller', 'Received new competitor discovery request.');

    // 2. Validate input parameters
    if (!brand || !category || !location) {
      logger.log('Controller', 'Validation failed: Missing brand, category, or location.', 'error');
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Please supply: brand, category, and location.'
      });
    }

    logger.log('Controller', `Scan coordinates - Brand: "${brand}", Category: "${category}", Location: "${location}"`);

    // 3. Generate Search Queries
    const queries = generateQueries({ brand, category, location });
    logger.setQueries(queries);

    const allRawListings = [];

    // 4. Execute Playwright scrapes sequentially in a single unified browser session
    try {
      const crawlResults = await runGoogleSearches(queries);
      allRawListings.push(...crawlResults);
    } catch (scrapeError) {
      logger.log('Controller', `Session crawl failed: ${scrapeError.message}`, 'error');
    }

    // 5. Extract Competitors (filters out ads, directory sites, and user's own business)
    const rawCompetitors = extractCompetitors(allRawListings, brand, category, location);

    // 6. Clean and Deduplicate data
    const cleanCompetitors = cleanCompetitorsData(rawCompetitors, category, location);

    logger.log('Controller', `Successfully processed discovery pipeline. Returning ${cleanCompetitors.length} competitors.`);

    // 7. Structure success response with expected payload and logs
    res.status(200).json({
      success: true,
      queries: queries,
      competitors: cleanCompetitors,
      debug: logger.getSessionData(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.log('Controller', `Critical pipeline failure: ${error.message}`, 'error');
    
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected failure occurred during competitor extraction.',
      debug: logger.getSessionData()
    });
  }
};

/**
 * Legacy router placeholder matching previous signature to prevent routing crashes.
 */
const runCompetitorAnalysis = async (req, res, next) => {
  // Redirect legacy calls to the clean search engine
  req.body.brand = req.body.business; // Map old 'business' param to 'brand'
  req.body.location = req.body.city;   // Map old 'city' param to 'location'
  return getCompetitors(req, res, next);
};

module.exports = {
  getCompetitors,
  runCompetitorAnalysis
};
