/**
 * Improvement Planner Module
 * 
 * Classifies recommendations into Quick Wins vs. Long Term (High Impact) improvements,
 * and formats the dynamic roadmap checklist.
 */

/**
 * Groups recommendations into Quick Wins and Long Term lists.
 * @param {Array<Object>} recommendations - The list of recommendations
 * @returns {Object} Classified collections: { quickWins, longTermImprovements }
 */
const planImprovements = (recommendations = []) => {
  const quickWins = [];
  const longTermImprovements = [];

  recommendations.forEach(r => {
    const isEasy = r.estimatedDifficulty === 'Easy';
    const isLowTime = r.estimatedTime.toLowerCase().includes('week') || r.estimatedTime.toLowerCase().includes('day');
    
    // Quick Wins are defined as Easy difficulty or Low time requirement
    if (isEasy || (isLowTime && r.estimatedDifficulty !== 'Hard')) {
      quickWins.push({
        title: r.title,
        recommendation: r.recommendation
      });
    } else {
      longTermImprovements.push({
        title: r.title,
        recommendation: r.recommendation
      });
    }
  });

  // Ensure we return at least one item if recommendations exist
  if (recommendations.length > 0 && quickWins.length === 0 && longTermImprovements.length > 0) {
    // Fallback: move the easiest looking longTerm item to quickWins
    const easyIndex = recommendations.findIndex(r => r.estimatedDifficulty === 'Medium');
    if (easyIndex !== -1) {
      quickWins.push({
        title: recommendations[easyIndex].title,
        recommendation: recommendations[easyIndex].recommendation
      });
    }
  }

  return {
    quickWins,
    longTermImprovements
  };
};

module.exports = {
  planImprovements
};
