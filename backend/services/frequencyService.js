/**
 * Mention Frequency & Analytics Service
 * 
 * Aggregates business citation counts and computes average ranking
 * positions across all executed AI search queries.
 */

/**
 * Compiles aggregated brand analytics from separate query results.
 * @param {Array<Object>} queryResults - Output records of each query run: [{ query: "", results: [{ name: "", position: 1 }] }]
 * @returns {Object} Grouped frequency stats: { "Gold's Gym": { mentions: 4, averagePosition: 2.1 } }
 */
const compileFrequencyData = (queryResults) => {
  if (!queryResults || !Array.isArray(queryResults)) {
    return {};
  }

  const aggregates = {};

  // 1. Accumulate mention frequencies and position sums
  for (const queryRun of queryResults) {
    const results = queryRun.results || [];
    
    for (const biz of results) {
      const originalName = biz.name;
      // We index keys using normalized names to avoid case differences, but retain presentation name
      const key = originalName.toLowerCase().trim();

      if (!aggregates[key]) {
        aggregates[key] = {
          name: originalName,
          mentions: 0,
          positionSum: 0
        };
      }

      aggregates[key].mentions += 1;
      aggregates[key].positionSum += biz.position;
    }
  }

  const finalFrequencyData = {};

  // 2. Compute average position values
  for (const key in aggregates) {
    const item = aggregates[key];
    const avgPosition = item.positionSum / item.mentions;

    finalFrequencyData[item.name] = {
      mentions: item.mentions,
      averagePosition: parseFloat(avgPosition.toFixed(1))
    };
  }

  return finalFrequencyData;
};

module.exports = {
  compileFrequencyData
};
