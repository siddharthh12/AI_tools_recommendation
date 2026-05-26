/**
 * Overall AI Visibility Score Calculator
 * 
 * Orchestrates visibility indexing:
 * 1. Computes frequency, position, reviews, and domain sub-scores.
 * 2. Applies weighted heuristics:
 *    - Mention Frequency   : 40% (0.40)
 *    - Ranking Position    : 30% (0.30)
 *    - Review Signals      : 15% (0.15)
 *    - Website Authority   : 15% (0.15)
 * 3. Compiles final score (0 - 100) and returns a complete breakdown.
 */

const calculateFrequencyScore = require('./frequencyScore');
const calculateRankingScore = require('./rankingScore');
const calculateReviewScore = require('./reviewScore');
const calculateAuthorityScore = require('./authorityScore');
const normalize = require('./normalizeScore');

// SCORING WEIGHTS CONSTANTS
const WEIGHTS = {
  FREQUENCY: 0.40,
  RANKING: 0.30,
  REVIEWS: 0.15,
  AUTHORITY: 0.15
};

/**
 * Orchestrates overall visibility score calculations.
 * @param {Object} params - Analytics coordinates
 * @param {number} params.mentions - Total citations count
 * @param {number} params.totalQueries - Total search queries executed
 * @param {number} params.averagePosition - Average rank spot
 * @param {Object} params.reviewData - Customer review counts/ratings
 * @param {Object} params.authorityData - Website authority parameters
 * @returns {Object} Scorecard: { score: 78, breakdown: { frequency: 85, ranking: 72, reviews: 80, authority: 65 } }
 */
const calculateOverallScore = (params) => {
  const {
    mentions = 0,
    totalQueries = 3,
    averagePosition = 0,
    reviewData = null,
    authorityData = null
  } = params;

  // 1. Compute modular sub-scores
  const frequencyScore = calculateFrequencyScore(mentions, totalQueries);
  const rankingScore = calculateRankingScore(averagePosition, mentions);
  const reviewScore = calculateReviewScore(reviewData);
  const authorityScore = calculateAuthorityScore(authorityData);

  // 2. Compile weighted sum
  const blendedScore = 
    (frequencyScore * WEIGHTS.FREQUENCY) +
    (rankingScore * WEIGHTS.RANKING) +
    (reviewScore * WEIGHTS.REVIEWS) +
    (authorityScore * WEIGHTS.AUTHORITY);

  const finalScore = normalize(blendedScore);

  return {
    score: finalScore,
    breakdown: {
      frequency: frequencyScore,
      ranking: rankingScore,
      reviews: reviewScore,
      authority: authorityScore
    }
  };
};

module.exports = {
  calculateOverallScore,
  WEIGHTS
};
