/**
 * Main Recommendation Engine Module
 * 
 * Orchestrates the complete advisory generation flow:
 * 1. Takes business discoverability statistics.
 * 2. Sweeps parameters against thresholds to detect weaknesses.
 * 3. Maps weaknesses to structured recommendation objects.
 * 4. Generates step-by-step actionable optimization checklists.
 * 5. Formats explainable business insights.
 * 6. Sorts recommendations by priority (HIGH -> MEDIUM -> LOW).
 */

const { detectWeaknesses } = require('./weaknessDetector');
const { mapToRecommendations } = require('./recommendationMapper');

/**
 * Generates prioritized discoverability recommendations.
 * @param {Object} stats - Brand discoverability metrics
 * @returns {Array<Object>} Sorted list of structured recommendations
 */
const generateRecommendations = (stats) => {
  if (!stats) return [];

  // 1. Detect raw search weaknesses
  const weaknesses = detectWeaknesses(stats);
  console.log(`[Recommendation Engine]: Detected ${weaknesses.length} discoverability gaps.`);

  // 2. Map weaknesses to structured recommendations
  const recommendations = mapToRecommendations(weaknesses);

  // 3. Sort recommendations by priority (HIGH first, then MEDIUM, then LOW)
  const priorityWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  return recommendations.sort((a, b) => {
    const weightA = priorityWeights[a.priority] || 0;
    const weightB = priorityWeights[b.priority] || 0;
    return weightB - weightA; // Descending order (HIGH first)
  });
};

module.exports = {
  generateRecommendations
};
