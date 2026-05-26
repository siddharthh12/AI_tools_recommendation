/**
 * Review Signals Sub-Score Calculator
 * 
 * Computes business visibility scores based on customer reviews.
 * Combines review rating (weighted 70% for quality) and review count
 * (weighted 30% for trust volume).
 * 
 * MVP Strategy:
 * Maps review parameters to 0-100 scale, preparing architecture
 * for future Google Reviews API integrations.
 */

const normalize = require('./normalizeScore');

/**
 * Calculates the review signal sub-score.
 * @param {Object} reviewData - Mock or live review coordinates
 * @param {number} reviewData.rating - Star reviews rating (0.0 - 5.0)
 * @param {number} reviewData.reviewCount - Total count of reviews
 * @returns {number} Normalized score (0 - 100)
 */
const calculateReviewScore = (reviewData) => {
  if (!reviewData) {
    return 0;
  }

  const { rating = 0, reviewCount = 0 } = reviewData;

  // 1. Rating Score: Convert 0-5.0 scale to 0-100 (e.g. 4.5 * 20 = 90 points)
  const ratingScore = rating * 20;

  // 2. Count Score: Normalize count. Having 1000+ reviews counts as 100 points
  const countScore = Math.min(100, (reviewCount / 1000) * 100);

  // 3. Blended weighted score: Rating quality (70%) + Volume trust (30%)
  const rawScore = (ratingScore * 0.70) + (countScore * 0.30);

  return normalize(rawScore);
};

module.exports = calculateReviewScore;
