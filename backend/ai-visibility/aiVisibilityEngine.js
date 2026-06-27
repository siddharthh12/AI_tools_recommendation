/**
 * AI Visibility Engine Orchestrator
 * 
 * Conducts discoverability audits across Perplexity AI for a target business
 * and its local competitors:
 * 1. Resolves real competitors (from request, profiles database, or mock fallbacks).
 * 2. Deduplicates spelling variations and alias names between target brand and competitors.
 * 3. Generates category-aware and location-aware search prompts.
 * 4. Crawls Perplexity AI using Playwright (reusing browser session).
 * 5. Deteriminstically extracts responses, sources, and detects business mentions.
 * 6. Calculates visibility scores (mentions, position, percentage).
 * 7. Stores results in the database and returns final metrics with individual query data.
 */

const { generateQueries } = require('./queryGenerator');
const { runMultiPlatformAudit } = require('./multiPlatformEngine');
const { getAllEnrichedProfiles } = require('../services/competitorProfileService');
const { generateMockCompetitors } = require('../services/mockCompetitorData');

/**
 * Normalizes a brand name for grouping duplicate records.
 */
function normalizeBrandName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/['’`,.\-/\\&]/g, '') // remove punctuation
    .replace(/\b(veg|vegetarian|kitchen|restaurant|cafe|café|gym|fitness|center|studio|club|ltd|inc|co|the|and|bar|banquets)\b/g, '') // remove noise words
    .replace(/\s+/g, '') // remove spaces
    .trim();
}

/**
 * Checks if two brand names refer to the same physical entity.
 */
function isDuplicateBrand(name1, name2) {
  const norm1 = normalizeBrandName(name1);
  const norm2 = normalizeBrandName(name2);
  
  if (!norm1 || !norm2) return false;
  if (norm1 === norm2) return true;
  
  const stripS = (s) => s.endsWith('s') ? s.slice(0, -1) : s;
  if (stripS(norm1) === stripS(norm2)) return true;
  
  if (norm1.length > 3 && norm2.length > 3) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  }
  
  return false;
}

/**
 * Orchestrates the full AI Visibility Analysis pipeline.
 * @param {Object} params - Input parameters
 * @param {string} params.brand - User's business name
 * @param {string} params.category - Business vertical
 * @param {string} params.location - Business city/location
 * @param {Array<string>} [params.competitors] - Optional list of competitor names
 * @param {Function} [logCallback] - Live activity logging callback
 * @returns {Promise<Object>} Final visibility data package
 */
async function runAiVisibilityEngine({ brand, category, location, competitors = [] }, logCallback = console.log) {
  const sessionLogs = [];
  const localLogger = (message, type = 'info') => {
    const logItem = {
      timestamp: new Date().toISOString(),
      component: 'AiVisibilityEngine',
      type,
      message
    };
    sessionLogs.push(logItem);
    logCallback(message, type);
  };

  localLogger(`[Engine]: Initiating visibility audit for Brand: "${brand}", Category: "${category}", Location: "${location}"`);

  try {
    // 1. Resolve competitors
    let competitorNames = [];
    if (competitors && competitors.length > 0) {
      competitorNames = competitors.map(c => typeof c === 'object' ? c.name : c);
      localLogger(`[Engine]: Using ${competitorNames.length} competitors supplied directly.`);
    } else {
      localLogger('[Engine]: Querying competitor profiles database...');
      const profiles = await getAllEnrichedProfiles();
      
      // Filter profiles matching category (case-insensitive)
      const matchingProfiles = profiles.filter(p => {
        const pCat = (p.category || '').toLowerCase();
        const inputCat = category.toLowerCase();
        return pCat.includes(inputCat) && p.name.toLowerCase() !== brand.toLowerCase();
      });

      if (matchingProfiles.length > 0) {
        competitorNames = [...new Set(matchingProfiles.map(p => p.name))];
        localLogger(`[Engine]: Discovered ${competitorNames.length} matching competitors from enriched profiles.`);
      } else {
        localLogger('[Engine]: No matching profiles found in database. Generating local fallback competitors...');
        const mockComps = generateMockCompetitors(category, location, brand);
        competitorNames = mockComps.map(c => c.name);
        localLogger(`[Engine]: Generated ${competitorNames.length} mock fallback competitors.`);
      }
    }

    // Deduplicate competitors against target brand and other competitors
    const uniqueCompetitors = [];
    const aliasesMap = {
      [brand]: [brand]
    };

    competitorNames.forEach(compName => {
      const cleanCompName = compName.trim();
      if (!cleanCompName) return;

      if (isDuplicateBrand(cleanCompName, brand)) {
        localLogger(`[Engine]: Grouping duplicate competitor "${cleanCompName}" as target brand variation.`);
        aliasesMap[brand].push(cleanCompName);
      } else {
        const existingDup = uniqueCompetitors.find(c => isDuplicateBrand(c, cleanCompName));
        if (existingDup) {
          localLogger(`[Engine]: Grouping duplicate competitor "${cleanCompName}" under representative competitor "${existingDup}".`);
          if (!aliasesMap[existingDup]) {
            aliasesMap[existingDup] = [existingDup];
          }
          aliasesMap[existingDup].push(cleanCompName);
        } else {
          uniqueCompetitors.push(cleanCompName);
          aliasesMap[cleanCompName] = [cleanCompName];
        }
      }
    });

    // Compile complete list of unique businesses to track
    const allBusinesses = [brand, ...uniqueCompetitors];
    localLogger(`[Engine]: Complete tracking list: ${JSON.stringify(allBusinesses)}`);
    localLogger(`[Engine]: Resolved aliases configuration: ${JSON.stringify(aliasesMap)}`);

    // 2. Generate Search Queries
    const queries = generateQueries(category, location);
    localLogger(`[Engine]: Generated ${queries.length} check queries: ${JSON.stringify(queries)}`);

    // 3. Delegate execution to multi-platform engine
    const auditResult = await runMultiPlatformAudit({
      brand,
      category,
      location,
      uniqueCompetitors,
      allBusinesses,
      aliasesMap,
      queries
    }, (msg, type) => {
      // Stream logs back to parent process / controller
      logCallback(msg, type);
      
      // Keep local session logs updated
      sessionLogs.push({
        timestamp: new Date().toISOString(),
        component: 'AiVisibilityEngine',
        type,
        message: msg
      });
    });

    if (auditResult.success) {
      localLogger('[Engine]: AI visibility audit process complete.');
      return {
        ...auditResult,
        debug: {
          logs: sessionLogs
        }
      };
    } else {
      throw new Error(auditResult.message || 'Multi-platform AI audit execution failed.');
    }

  } catch (err) {
    localLogger(`[Engine Critical Error]: Orchestration pipeline crashed: ${err.message}`, 'error');
    
    return {
      success: false,
      message: err.message,
      queries: [],
      visibility: [],
      queriesData: [],
      debug: {
        logs: sessionLogs
      }
    };
  }
}

module.exports = {
  runAiVisibilityEngine,
  isDuplicateBrand
};
