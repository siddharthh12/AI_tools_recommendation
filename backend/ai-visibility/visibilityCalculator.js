/**
 * Visibility Calculator
 * Aggregates mention detection records across multiple queries to compute visibility statistics.
 */

/**
 * Calculates visibility metrics for each business.
 * @param {Array<Array<Object>>} allQueryResults - Array of query detection results
 * @param {number} totalQueries - Total count of queries run
 * @returns {Array<Object>} Aggregated metrics per business
 */
function calculateVisibility(allQueryResults, totalQueries) {
  if (!allQueryResults || allQueryResults.length === 0 || totalQueries === 0) {
    return [];
  }

  // Map to store temporary accumulators
  const statsMap = new Map();

  allQueryResults.forEach(queryResult => {
    queryResult.forEach(item => {
      const { name, mentioned, position } = item;
      
      if (!statsMap.has(name)) {
        statsMap.set(name, {
          name,
          mentions: 0,
          positionSum: 0,
          mentionQueriesCount: 0
        });
      }

      const stats = statsMap.get(name);
      if (mentioned) {
        stats.mentions += 1;
        stats.positionSum += position;
        stats.mentionQueriesCount += 1;
      }
    });
  });

  // Calculate final visibility percentages and averages
  const results = [];
  statsMap.forEach((stats, name) => {
    const mentions = stats.mentions;
    const visibility = Math.round((mentions / totalQueries) * 100);
    const averagePosition = stats.mentionQueriesCount > 0
      ? parseFloat((stats.positionSum / stats.mentionQueriesCount).toFixed(1))
      : 0;

    results.push({
      name,
      mentioned: mentions > 0,
      mentions,
      visibility,
      averagePosition
    });
  });

  // Sort descending by visibility score, then by average position (smaller is better)
  return results.sort((a, b) => {
    if (b.visibility !== a.visibility) {
      return b.visibility - a.visibility;
    }
    return a.averagePosition - b.averagePosition;
  });
}

module.exports = {
  calculateVisibility
};
