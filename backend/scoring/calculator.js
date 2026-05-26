/**
 * AI Discoverability Scoring Calculator
 * 
 * Provides utility methods to evaluate and score brand visibility
 * based on search frequency, citation authority, and competitors.
 */

/**
 * Calculates the overall visibility index score.
 * @param {Object} breakdown - Scores for separate AI agents (0 - 100)
 * @returns {number} Weighted index score
 */
const calculateVisibilityScore = (breakdown) => {
  const weights = {
    chatgpt: 0.35,
    claude: 0.25,
    gemini: 0.25,
    perplexity: 0.15
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const agent in weights) {
    if (breakdown[agent] !== undefined) {
      totalScore += breakdown[agent] * weights[agent];
      totalWeight += weights[agent];
    }
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
};

/**
 * Analyzes competitor ranks and compiles gap analysis metrics.
 * @param {number} brandScore - Target business discoverability score
 * @param {Array<number>} competitorScores - Array of competitor score inputs
 * @returns {Object} Gap analysis findings
 */
const evaluateCompetitorGaps = (brandScore, competitorScores) => {
  const meanCompetitorScore = competitorScores.length > 0 
    ? competitorScores.reduce((a, b) => a + b, 0) / competitorScores.length
    : 0;

  const gap = brandScore - meanCompetitorScore;

  return {
    averageCompetitorScore: Math.round(meanCompetitorScore),
    gapValue: Math.round(gap),
    status: gap > 10 ? 'leading' : gap < -10 ? 'behind' : 'par'
  };
};

module.exports = {
  calculateVisibilityScore,
  evaluateCompetitorGaps
};
