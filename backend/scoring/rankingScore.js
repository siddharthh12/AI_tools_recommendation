/**
 * Ranking Position Sub-Score Calculator
 * 
 * Scores the geographical proximity of brand recommendations.
 * Citations positioned earlier (e.g., Rank #1) yield higher scores,
 * whereas positions deeper in list structures decay the score.
 */

const normalize = require('./normalizeScore');

/**
 * Calculates the ranking position sub-score.
 * @param {number} averagePosition - Average ranking position across mentions (1.0 to 5.0+)
 * @param {number} mentions - Total mentions count
 * @returns {number} Normalized score (0 - 100)
 */
const calculateRankingScore = (averagePosition, mentions) => {
  if (!mentions || mentions <= 0 || !averagePosition || averagePosition <= 0) {
    return 0;
  }

  // Linear position decay formula:
  // Rank #1.0 -> 100 points
  // Rank #2.0 -> 80 points
  // Rank #3.0 -> 60 points
  // Rank #4.0 -> 40 points
  // Rank #5.0 -> 20 points
  // Any rank worse than #5 decays slower (max(0, 20 - (averagePosition - 5) * 5))
  let rawScore = 0;
  
  if (averagePosition <= 5) {
    rawScore = 100 - (averagePosition - 1) * 20;
  } else {
    rawScore = Math.max(0, 20 - (averagePosition - 5) * 5);
  }

  return normalize(rawScore);
};

module.exports = calculateRankingScore;
