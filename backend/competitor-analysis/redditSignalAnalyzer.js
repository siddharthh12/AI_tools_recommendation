/**
 * Reddit Signal Analyzer Module
 * 
 * Heuristically compiles community mention frequencies and positive discussion
 * indicators across Reddit threads to score brand community trust (0 - 100).
 * 
 * MVP Strategy:
 * Uses heuristic weights and prepares the pipeline for actual Reddit Crawler
 * API integrations in Phase 5.
 */

const normalize = require('../scoring/normalizeScore');

/**
 * Heuristically scores Reddit community trust metrics.
 * @param {Object} redditData - Sourced mentions and sentiment logs
 * @param {number} redditData.mentions - Total thread mention count (0 - 50)
 * @param {number} redditData.sentiment - Positive thread sentiment ratio (0.0 - 1.0)
 * @returns {Object} Scorecard: { score: 72, mentions: 15, sentiment: 0.85 }
 */
const analyzeRedditSignals = (redditData) => {
  if (!redditData) {
    return { score: 0, mentions: 0, sentiment: 0 };
  }

  const { mentions = 0, sentiment = 0.0 } = redditData;

  // 1. Mentions Score: Having 25+ thread mentions yields a full 100 points
  const mentionsScore = Math.min(100, (mentions / 25) * 100);

  // 2. Sentiment Score: Star ratio (0.0 to 1.0) mapped directly to 0-100
  const sentimentScore = sentiment * 100;

  // 3. Blended metric: Mentions volume (40% weight) + Sentiment quality (60% weight)
  const rawScore = (mentionsScore * 0.40) + (sentimentScore * 0.60);

  return {
    score: normalize(rawScore),
    mentions,
    sentiment
  };
};

module.exports = {
  analyzeRedditSignals
};
