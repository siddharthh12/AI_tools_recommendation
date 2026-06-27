/**
 * Multi-Platform AI Visibility Orchestrator Engine
 * 
 * Runs search queries across Perplexity, ChatGPT, and Gemini, then processes,
 * aggregates, and saves results for each platform separately.
 */

const { runPlatformQuery, closeAllBrowserSessions } = require('./platformManager');
const { extractResponse } = require('./responseExtractor');
const { detectMentions } = require('./mentionDetector');
const { calculateVisibility } = require('./visibilityCalculator');
const { saveVisibilityResults } = require('./aiVisibilityStorage');

/**
 * Executes multi-platform queries and processes visibility analytics.
 */
async function runMultiPlatformAudit({
  brand,
  category,
  location,
  uniqueCompetitors = [],
  allBusinesses = [],
  aliasesMap = {},
  queries = []
}, logCallback = console.log) {
  
  const platforms = ['perplexity', 'chatgpt', 'gemini'];
  const sessionLogs = [];
  
  const localLogger = (message, type = 'info') => {
    const logItem = {
      timestamp: new Date().toISOString(),
      component: 'MultiPlatformEngine',
      type,
      message
    };
    sessionLogs.push(logItem);
    logCallback(message, type);
  };

  localLogger(`[Engine]: Initiating multi-platform visibility audit for ${platforms.join(', ')}`);

  // Initialize output structure
  const resultsByQuery = queries.map(q => ({
    query: q,
    platforms: {}
  }));

  // Run platforms sequentially to allow browser session reuse and conserve system RAM
  for (const platform of platforms) {
    localLogger(`[Engine]: Starting crawls on platform: "${platform}"`);
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      localLogger(`[Engine][${platform.toUpperCase()}]: Processing query ${i + 1}/${queries.length}: "${query}"`);

      try {
        const rawResult = await runPlatformQuery(
          platform,
          query,
          brand,
          category,
          location,
          uniqueCompetitors,
          (msg, type) => {
            const logItem = {
              timestamp: new Date().toISOString(),
              component: `${platform.charAt(0).toUpperCase() + platform.slice(1)}Runner`,
              type,
              message: msg
            };
            sessionLogs.push(logItem);
            logCallback(`[${platform.toUpperCase()}]: ${msg}`, type);
          }
        );

        // Standard Response Extraction & Mention Detection
        const extracted = extractResponse(rawResult);
        const detections = detectMentions(extracted.response, allBusinesses, aliasesMap);

        resultsByQuery[i].platforms[platform] = {
          success: true,
          response: extracted.response,
          sources: extracted.sources,
          detections: detections
        };

      } catch (err) {
        localLogger(`[Engine Error][${platform.toUpperCase()}]: Query "${query}" failed: ${err.message}`, 'error');
        
        // Gracefully handle failure for this query/platform and continue
        resultsByQuery[i].platforms[platform] = {
          success: false,
          error: err.message,
          response: `Error: Crawl execution failed for this platform. Details: ${err.message}`,
          sources: [],
          detections: allBusinesses.map(name => ({ name, mentioned: false, position: null }))
        };
      }
    }
  }

  // Gracefully close all Playwright sessions after finishing all audits
  try {
    await closeAllBrowserSessions();
  } catch (closeErr) {
    localLogger(`[Engine Warning]: Error closing browser sessions: ${closeErr.message}`, 'warn');
  }

  // 1. Calculate Per-Platform Visibility Stats
  localLogger('[Engine]: Aggregating per-platform statistics...');
  const platformStats = {};

  platforms.forEach(platform => {
    const allDetections = [];
    let queryCount = 0;

    resultsByQuery.forEach(item => {
      const platData = item.platforms[platform];
      if (platData) {
        allDetections.push(platData.detections);
        queryCount++;
      }
    });

    if (queryCount > 0) {
      platformStats[platform] = calculateVisibility(allDetections, queryCount);
    } else {
      // Setup empty stats fallback if failed
      platformStats[platform] = allBusinesses.map(name => ({
        name,
        mentioned: false,
        mentions: 0,
        visibility: 0,
        averagePosition: 0
      }));
    }
  });

  // 2. Calculate Aggregated Overall Visibility Stats (Average of individual platform visibilities)
  localLogger('[Engine]: Computing overall aggregated visibility metrics...');
  const overallVisibility = allBusinesses.map(name => {
    let visibilitySum = 0;
    let positionSum = 0;
    let positionCount = 0;
    let totalMentions = 0;
    let platformCountWithStats = 0;

    platforms.forEach(platform => {
      const stats = platformStats[platform];
      if (stats) {
        const busStat = stats.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (busStat) {
          visibilitySum += busStat.visibility;
          totalMentions += busStat.mentions;
          if (busStat.averagePosition > 0) {
            positionSum += busStat.averagePosition;
            positionCount++;
          }
          platformCountWithStats++;
        }
      }
    });

    const averageVisibility = platformCountWithStats > 0 ? Math.round(visibilitySum / platformCountWithStats) : 0;
    const averagePosition = positionCount > 0 ? parseFloat((positionSum / positionCount).toFixed(1)) : 0;

    return {
      name,
      mentioned: totalMentions > 0,
      mentions: totalMentions,
      visibility: averageVisibility,
      averagePosition
    };
  });

  // Sort overall visibility descending by score
  overallVisibility.sort((a, b) => {
    if (b.visibility !== a.visibility) {
      return b.visibility - a.visibility;
    }
    return a.averagePosition - b.averagePosition;
  });

  // 3. Format and Persist results to Database/JSON separately for each platform
  localLogger('[Engine]: Persisting multi-platform results to storage...');
  const dbRecords = [];

  resultsByQuery.forEach(r => {
    platforms.forEach(plat => {
      const platData = r.platforms[plat];
      if (!platData) return;

      const targetDetection = platData.detections.find(d => d.name.toLowerCase() === brand.toLowerCase()) || { mentioned: false, position: null };
      const platformBrandStats = platformStats[plat] ? platformStats[plat].find(s => s.name.toLowerCase() === brand.toLowerCase()) : null;
      const platformScore = platformBrandStats ? platformBrandStats.visibility : 0;

      dbRecords.push({
        business_name: brand,
        query: r.query,
        platform: plat,
        mentioned: targetDetection.mentioned,
        position: targetDetection.position,
        response_text: platData.response,
        source_links: platData.sources,
        detections: platData.detections,
        visibility_score: platformScore
      });
    });
  });

  try {
    await saveVisibilityResults(dbRecords);
    localLogger('[Engine]: Multi-platform database storage save completed.');
  } catch (saveErr) {
    localLogger(`[Engine Warning]: Database persistence failed: ${saveErr.message}`, 'warn');
  }

  localLogger('[Engine]: Multi-platform engine processing complete.');

  return {
    success: true,
    queries,
    platforms: resultsByQuery, // Query-by-Query platform data
    platformStats, // Per-platform aggregated statistics
    visibility: overallVisibility, // Overall aggregated visibility score (for backwards compatibility with frontend Context hooks)
    debug: {
      logs: sessionLogs
    }
  };
}

module.exports = {
  runMultiPlatformAudit
};
