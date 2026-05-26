/**
 * AI Visibility Score Controller
 * 
 * Orchestrates the full discoverability audit and scoring cycle:
 * 1. Validates business name, category, and city.
 * 2. Compiles queries, crawls Perplexity, and extracts competitor mentions.
 * 3. Fetches mock reviews ratings and website authority parameters.
 * 4. Compiles visibility scores (overall and breakdowns).
 * 5. Appends historical trends data to prepare for timeline visual chart.
 * 6. Returns a comprehensive scorecard report to the client.
 */

const { generateQueries } = require('../services/queryGeneratorService');
const { runPerplexity } = require('../playwright/perplexityRunner');
const { extractBusinesses } = require('../services/extractBusinessService');
const { compileFrequencyData } = require('../services/frequencyService');
const { getMockAnalytics } = require('../services/mockDataService');
const { calculateOverallScore } = require('../scoring/scoreCalculator');

/**
 * Orchestrates brand visibility calculations.
 * POST /api/score/calculate
 */
const calculateVisibilityScore = async (req, res, next) => {
  try {
    const { business, category, city } = req.body;

    // 1. PARAMETERS VALIDATION
    if (!business || !category || !city) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Please supply: business, category, and city.'
      });
    }

    console.log(`[Score Controller]: Initiating overall score audit for: "${business}"`);

    // 2. QUERY GENERATION
    const queries = generateQueries(category, city);
    const queryResults = [];

    // 3. EXECUTE PLAYWRIGHT CRAWLER RUNS (SEQUENTIAL)
    for (const query of queries) {
      try {
        const rawResponseText = await runPerplexity(query, business, category, city);
        const parsedResults = extractBusinesses(rawResponseText);

        queryResults.push({
          query: query,
          results: parsedResults,
          rawResponse: rawResponseText
        });
      } catch (runErr) {
        console.error(`[Score Controller]: Query crawl failed for "${query}":`, runErr.message);
        queryResults.push({
          query: query,
          results: [],
          rawResponse: `Scrape error: ${runErr.message}`
        });
      }
    }

    // 4. COMPILE FREQUENCY DATA
    const aggregatedFrequency = compileFrequencyData(queryResults);
    
    // Normalize target brand name key to extract details
    const searchKey = Object.keys(aggregatedFrequency).find(
      (k) => k.toLowerCase() === business.toLowerCase().trim()
    );

    const brandStats = searchKey ? aggregatedFrequency[searchKey] : null;
    const mentions = brandStats ? brandStats.mentions : 0;
    const averagePosition = brandStats ? brandStats.averagePosition : 0;

    // 5. FETCH MOCK REVIEW AND DOMAIN AUTHORITY METRICS
    const mockMetrics = getMockAnalytics(business, category, city);

    // 6. RUN SCORE CALCULATOR (HEURISTIC WEIGHTS SUM)
    const overallScorecard = calculateOverallScore({
      mentions,
      totalQueries: queries.length,
      averagePosition,
      reviewData: mockMetrics.reviewData,
      authorityData: mockMetrics.authorityData
    });

    // 7. PREPARE SCORE HISTORY RECORDS (Step 10 timeline preparation)
    // Generates static consistent past scores based on business name length to simulate historical charts
    const offset = (business.length % 5) * 3; 
    const historicalTrends = [
      { date: '2026-05-23', score: Math.max(20, overallScorecard.score - 10 + offset) },
      { date: '2026-05-24', score: Math.max(20, overallScorecard.score - 5 + (offset % 2)) },
      { date: '2026-05-25', score: Math.max(20, overallScorecard.score - 2 + (offset % 3)) },
      { date: '2026-05-26', score: overallScorecard.score } // Active score
    ];

    // 8. DELIVER DETAILED AUDIT REPORT RESPONSE
    res.status(200).json({
      success: true,
      business,
      category,
      city,
      overallScore: overallScorecard.score,
      breakdown: overallScorecard.breakdown,
      reviewData: mockMetrics.reviewData,
      authorityData: mockMetrics.authorityData,
      queries: queryResults,
      frequencyData: aggregatedFrequency,
      history: historicalTrends
    });

  } catch (error) {
    console.error('[Score Controller Error]: Overall scoring calculation crashed:', error);
    next(error);
  }
};

module.exports = {
  calculateVisibilityScore
};
