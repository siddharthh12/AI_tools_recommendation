/**
 * AI Query Engine Controller
 * 
 * Orchestrates the complete discoverability analysis workflow using real search:
 * 1. Validates business input parameters (Business Name, Category, City).
 * 2. Compiles dynamic search queries using the new builder.
 * 3. Triggers Google Playwright Scraper to execute live crawls.
 * 4. Parses physical business listings and filters out directories.
 * 5. Assess conversational AI mention indexes across brands.
 * 6. Returns a structured JSON payload to the frontend.
 */

const { buildQueries } = require('../search/searchQueryBuilder');
const { runGoogleSearch } = require('../search/googleSearchRunner');
const { parseSearchResults } = require('../search/searchParser');
const { extractCompetitors } = require('../search/competitorExtractor');
const { checkAiVisibility } = require('../services/aiVisibilityService');

/**
 * Executes live query runs and returns aggregated analytics.
 * POST /api/query/run
 */
const runQueryEngine = async (req, res, next) => {
  try {
    const { business, category, city } = req.body;

    // 1. INPUT PARAMETERS VALIDATION
    if (!business || !category || !city) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Please supply: business, category, and city.'
      });
    }

    console.log(`[Query Engine Controller]: Initiating brand audit session for: "${business}"`);
    
    // 2. QUERY GENERATION
    const queries = buildQueries({ business, category, city });
    const allSearchRawResults = [];
    const queryResultsLog = [];

    // 3. EXECUTE PLAYWRIGHT CRAWLER RUNS (IN PARALLEL)
    await Promise.all(
      queries.map(async (query) => {
        try {
          const rawItems = await runGoogleSearch(query, category, city);
          allSearchRawResults.push(...rawItems);
          
          queryResultsLog.push({
            query: query,
            results: rawItems.map(item => ({ name: item.title, position: item.rank })),
            rawResponse: `Live Google Search Scrape complete. Discovered ${rawItems.length} active physical listings.`
          });
        } catch (runErr) {
          console.error(`[Query Engine Controller]: Individual query execution failed for "${query}":`, runErr.message);
          queryResultsLog.push({
            query: query,
            results: [],
            rawResponse: `Google scrape failed: ${runErr.message}`
          });
        }
      })
    );

    // 4. PARSE RESULTS
    const cleanDiscoveredListings = parseSearchResults(allSearchRawResults);

    // 5. EXTRACT COMPETITORS FOR AI VISIBILITY AUDIT
    const topCompetitors = extractCompetitors(cleanDiscoveredListings, business);

    // 6. RUN AI VISIBILITY ASSESSMENT
    const aiVisibilityBreakdown = await checkAiVisibility(business, category, city, topCompetitors, cleanDiscoveredListings);

    // 7. DELIVER FINAL STRUCTURED JSON RESPONSE
    res.status(200).json({
      success: true,
      queries: queryResultsLog,
      frequencyData: aiVisibilityBreakdown,
      sourcedFromGoogle: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Query Engine Controller Error]: Failed to run AI Query Engine:', error);
    next(error);
  }
};

module.exports = {
  runQueryEngine
};
