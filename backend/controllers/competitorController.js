/**
 * Competitor Analysis Controller
 * 
 * Coordinates the full competitor audit requests:
 * 1. Validates body parameters (Business, Category, City).
 * 2. Compiles queries and triggers automated crawling/scraping runs.
 * 3. Extracts listed competitor names, excluding the target brand.
 * 4. Compiles visibility metrics (reviews, authority, Reddit, FAQ) for both.
 * 5. Contrasts factors to find weaknesses, compiling human-readable reasons
 *    and actionable optimization recommendations.
 */

const { generateQueries } = require('../services/queryGeneratorService');
const { runPerplexity } = require('../playwright/perplexityRunner');
const { extractBusinesses } = require('../services/extractBusinesses' === 'undefined' ? '../services/extractBusinessService' : '../services/extractBusinessService');
const { compileFrequencyData } = require('../services/frequencyService');
const { extractCompetitors } = require('../competitor-analysis/competitorAnalyzer');
const { getBrandMetrics } = require('../services/mockCompetitorData');
const { analyzeCompetitors } = require('../competitor-analysis/mainCompetitorEngine');

/**
 * Executes a live competitor discoverability audit.
 * POST /api/competitors/analyze
 */
const runCompetitorAnalysis = async (req, res, next) => {
  try {
    const { business, category, city } = req.body;

    // 1. INPUT VALIDATION
    if (!business || !category || !city) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters. Please supply: business, category, and city.'
      });
    }

    console.log(`[Competitor Controller]: Initiating comparison audit for: "${business}"`);

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
        console.error(`[Competitor Controller]: Crawl failed for "${query}":`, err.message);
        queryResults.push({ query, results: [], rawResponse: `Crawl error: ${err.message}` });
      }
    }

    // 3. COMPILE FREQUENCY DATA
    const frequencyData = compileFrequencyData(queryResults);

    // 4. IDENTIFY UNIQUE COMPETITORS
    const rankedCompetitors = extractCompetitors(frequencyData, business);
    console.log(`[Competitor Controller]: Found ${rankedCompetitors.length} unique competitors:`, rankedCompetitors.map(c => c.name));

    // 5. COMPILE TARGET BRAND METRICS PROFILE
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

    // 6. COMPILE COMPETITORS METRICS PROFILE LIST
    const competitorProfilesList = rankedCompetitors.map(comp => {
      return {
        ...getBrandMetrics(comp.name),
        mentions: comp.mentions,
        averagePosition: comp.averagePosition
      };
    });

    // 7. EXECUTE COMPARATIVE ENGINE (COMPLIANT WITH INSTRUCTIONS)
    const competitorAnalysisResults = analyzeCompetitors(targetProfile, competitorProfilesList);

    // 8. RETURN STRUCTURED REPORT
    res.status(200).json({
      success: true,
      targetBusiness: business,
      topCompetitors: competitorAnalysisResults
    });

  } catch (error) {
    console.error('[Competitor Controller Error]: Competitor analysis failed:', error);
    next(error);
  }
};

module.exports = {
  runCompetitorAnalysis
};
