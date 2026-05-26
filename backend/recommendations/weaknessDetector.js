/**
 * Weakness Detector Module
 * 
 * Evaluates business discoverability stats against defined heuristic thresholds
 * to flag specific areas of weakness and assign a severity grade (HIGH or MEDIUM).
 */

// THRESHOLDS CONSTANTS
const THRESHOLDS = {
  MENTIONS: { CRITICAL: 1, MODERATE: 2 },
  POSITION: { CRITICAL: 3.5, MODERATE: 2.0 },
  REVIEWS_COUNT: { CRITICAL: 300, MODERATE: 900 },
  RATING: { CRITICAL: 4.2, MODERATE: 4.5 },
  FAQ_COUNT: { CRITICAL: 1, MODERATE: 6 },
  AUTHORITY: { CRITICAL: 40, MODERATE: 50 },
  REDDIT_MENTIONS: { CRITICAL: 5, MODERATE: 15 }
};

/**
 * Sweeps brand metrics to identify search weakness categories.
 * @param {Object} stats - Target brand metrics
 * @returns {Array<Object>} List of weaknesses: [{ type: "LOW_REVIEWS", severity: "HIGH", value: 240 }]
 */
const detectWeaknesses = (stats) => {
  if (!stats) return [];

  const weaknesses = [];

  // 1. Sweep AI Mentions count
  const mentions = stats.mentions || 0;
  if (mentions < THRESHOLDS.MENTIONS.CRITICAL) {
    weaknesses.push({ type: 'LOW_MENTIONS', severity: 'HIGH', value: mentions });
  } else if (mentions < THRESHOLDS.MENTIONS.MODERATE) {
    weaknesses.push({ type: 'LOW_MENTIONS', severity: 'MEDIUM', value: mentions });
  }

  // 2. Sweep AI Ranking Position (lower average position is better)
  const avgPos = stats.averagePosition || 0;
  if (avgPos > THRESHOLDS.POSITION.CRITICAL) {
    weaknesses.push({ type: 'POOR_RANKING', severity: 'HIGH', value: avgPos });
  } else if (avgPos > THRESHOLDS.POSITION.MODERATE) {
    weaknesses.push({ type: 'POOR_RANKING', severity: 'MEDIUM', value: avgPos });
  }

  // 3. Sweep Google review ratings
  const rating = stats.reviewData?.rating || 0;
  if (rating > 0) {
    if (rating < THRESHOLDS.RATING.CRITICAL) {
      weaknesses.push({ type: 'LOW_RATING', severity: 'HIGH', value: rating });
    } else if (rating < THRESHOLDS.RATING.MODERATE) {
      weaknesses.push({ type: 'LOW_RATING', severity: 'MEDIUM', value: rating });
    }
  }

  // 4. Sweep Google reviews count
  const revCount = stats.reviewData?.reviewCount || 0;
  if (revCount < THRESHOLDS.REVIEWS_COUNT.CRITICAL) {
    weaknesses.push({ type: 'FEW_REVIEWS', severity: 'HIGH', value: revCount });
  } else if (revCount < THRESHOLDS.REVIEWS_COUNT.MODERATE) {
    weaknesses.push({ type: 'FEW_REVIEWS', severity: 'MEDIUM', value: revCount });
  }

  // 5. Sweep FAQ content structures
  const faqCount = stats.faqData?.faqCount || 0;
  const usesSchema = stats.faqData?.usesSchema || false;
  if (faqCount < THRESHOLDS.FAQ_COUNT.CRITICAL) {
    weaknesses.push({ type: 'MISSING_FAQ', severity: 'HIGH', value: faqCount });
  } else if (!usesSchema || faqCount < THRESHOLDS.FAQ_COUNT.MODERATE) {
    weaknesses.push({ type: 'MISSING_FAQ', severity: 'MEDIUM', value: faqCount });
  }

  // 6. Sweep Domain backlink authority DA
  const da = stats.authorityData?.domainAuthority || 0;
  if (da < THRESHOLDS.AUTHORITY.CRITICAL) {
    weaknesses.push({ type: 'WEAK_AUTHORITY', severity: 'HIGH', value: da });
  } else if (da < THRESHOLDS.AUTHORITY.MODERATE) {
    weaknesses.push({ type: 'WEAK_AUTHORITY', severity: 'MEDIUM', value: da });
  }

  // 7. Sweep Reddit forum discussion citations
  const reddit = stats.redditData?.mentions || 0;
  if (reddit < THRESHOLDS.REDDIT_MENTIONS.CRITICAL) {
    weaknesses.push({ type: 'WEAK_COMMUNITY_SIGNALS', severity: 'HIGH', value: reddit });
  } else if (reddit < THRESHOLDS.REDDIT_MENTIONS.MODERATE) {
    weaknesses.push({ type: 'WEAK_COMMUNITY_SIGNALS', severity: 'MEDIUM', value: reddit });
  }

  return weaknesses;
};

module.exports = {
  detectWeaknesses,
  THRESHOLDS
};
