/**
 * Frequency Sub-Score Calculator
 * 
 * Maps business mention rates to the standard 0 - 100 index.
 * A brand cited in all search queries yields a full 100 score,
 * whereas fewer mentions scale down linearly.
 */

const normalize = require('./normalizeScore');

/**
 * Calculates the frequency sub-score.
 * @param {number} mentions - How many times target brand was cited
 * @param {number} totalQueries - Total queries executed in scan run
 * @returns {number} Normalized score (0 - 100)
 */
const calculateFrequencyScore = (mentions, totalQueries) => {
  if (!totalQueries || totalQueries <= 0 || !mentions || mentions <= 0) {
    return 0;
  }

  // Linear ratio score (e.g. 2 mentions out of 3 queries -> 66.7 points)
  const rawScore = (mentions / totalQueries) * 100;
  
  return normalize(rawScore);
};

module.exports = calculateFrequencyScore;
