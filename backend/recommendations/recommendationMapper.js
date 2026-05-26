/**
 * Recommendation Mapper Module
 * 
 * Maps raw weakness metrics and severity variables into structured, high-fidelity
 * business recommendation objects containing categories, prioritizations, actions,
 * and user-friendly insights.
 */

const recommendationRules = require('./recommendationRules');
const { getPriority } = require('./recommendationPriority');
const { getActions } = require('./actionGenerator');
const { formatInsight } = require('./insightFormatter');

/**
 * Maps raw weaknesses list to structured recommendations.
 * @param {Array<Object>} weaknesses - Detected weaknesses list
 * @returns {Array<Object>} Structured recommendations list
 */
const mapToRecommendations = (weaknesses) => {
  if (!weaknesses || !Array.isArray(weaknesses)) {
    return [];
  }

  return weaknesses.map((weakness) => {
    const { type, severity, value } = weakness;
    const rule = recommendationRules[type] || {
      category: 'General',
      problem: 'Discoverability Gap',
      recommendation: 'Optimize brand footprint',
      impact: 'Improving discoverability variables scales citation rates.'
    };

    return {
      category: rule.category,
      problem: rule.problem,
      recommendation: rule.recommendation,
      priority: getPriority(severity),
      impact: rule.impact,
      insight: formatInsight(type, value),
      actions: getActions(type)
    };
  });
};

module.exports = {
  mapToRecommendations
};
