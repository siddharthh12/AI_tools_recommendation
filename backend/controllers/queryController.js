/**
 * AI Query Engine Controller
 * 
 * Orchestrates the complete discoverability analysis workflow:
 * 1. Validates business input parameters (Business Name, Category, City).
 * 2. Compiles dynamic search queries using templates.
 * 3. Triggers Playwright scraper runner to query Perplexity AI.
 * 4. Parses list names and citations from text response blocks.
 * 5. Aggregates metrics (mention frequency, average rank position).
 * 6. Returns a structured JSON payload to the frontend.
 */

const { generateQueries } = require('../services/queryGeneratorService');
const { runPerplexity } = require('../playwright/perplexityRunner');
const { extractBusinesses } = require('../services/extractBusinessService');
const { compileFrequencyData } = require('../services/frequencyService');

/**
 * Executes dynamic query runs and returns aggregated analytics.
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
    const queries = generateQueries(category, city);
    console.log(`[Query Engine Controller]: Successfully generated ${queries.length} query variations:`, queries);

    const queryResults = [];

    // 3. EXECUTE PLAYWRIGHT CRAWLER RUNS (SEQUENTIAL)
    for (const query of queries) {
      try {
        // Run Playwright crawler for Perplexity search (incorporates Turnstile fallback)
        const rawResponseText = await runPerplexity(query, business, category, city);

        // 4. PARSE MENTIONS & POSITIONS FROM RAW TEXT
        const parsedResults = extractBusinesses(rawResponseText);

        queryResults.push({
          query: query,
          results: parsedResults,
          rawResponse: rawResponseText // Return raw response for dashboard visual transparency/debugging
        });
      } catch (runErr) {
        console.error(`[Query Engine Controller]: Individual query execution failed for "${query}":`, runErr.message);
        // Include empty result rather than failing the whole scanning request
        queryResults.push({
          query: query,
          results: [],
          rawResponse: `Query execution failed: ${runErr.message}`
        });
      }
    }

    // 5. AGGREGATE FREQUENCY & POSITIONS METRICS
    const aggregatedFrequency = compileFrequencyData(queryResults);

    // 6. DELIVER FINAL STRUCTURED JSON RESPONSE
    res.status(200).json({
      success: true,
      queries: queryResults,
      frequencyData: aggregatedFrequency
    });

  } catch (error) {
    console.error('[Query Engine Controller Error]: Failed to run AI Query Engine:', error);
    next(error);
  }
};

module.exports = {
  runQueryEngine
};
