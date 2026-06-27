/**
 * Priority Calculator Module
 * 
 * Orders generated recommendations in descending order of priority (High -> Medium -> Low).
 */

const PRIORITY_ORDER = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

/**
 * Sorts recommendation list items dynamically.
 * @param {Array<Object>} recommendations - The validated list of recommendations
 * @returns {Array<Object>} Sorted list
 */
const sortRecommendations = (recommendations = []) => {
  return [...recommendations].sort((a, b) => {
    const valA = PRIORITY_ORDER[a.priority] || 2;
    const valB = PRIORITY_ORDER[b.priority] || 2;
    return valB - valA;
  });
};

module.exports = {
  sortRecommendations
};
