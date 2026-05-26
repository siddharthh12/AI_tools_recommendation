/**
 * Competitor Analyzer Module
 * 
 * Extracts competitive business profiles mentioned alongside the target brand
 * in AI query responses. Removes duplicates, filters out the target business,
 * and ranks competitors by citation frequency.
 */

/**
 * Identifies and ranks competitor brands from search aggregates.
 * @param {Object} frequencyData - Aggregated brand analytics from scans
 * @param {string} targetBusiness - Target brand name to exclude
 * @returns {Array<Object>} Sorted list of unique competitor names and counts
 */
const extractCompetitors = (frequencyData, targetBusiness) => {
  if (!frequencyData || typeof frequencyData !== 'object') {
    return [];
  }

  const cleanTarget = targetBusiness.toLowerCase().trim();
  const competitorsList = [];

  for (const name in frequencyData) {
    const cleanName = name.toLowerCase().trim();
    
    // Exclude target business from competitors
    if (cleanName === cleanTarget) {
      continue;
    }

    competitorsList.push({
      name: name, // Preserve presentation casing
      mentions: frequencyData[name].mentions || 0,
      averagePosition: frequencyData[name].averagePosition || 0
    });
  }

  // Rank competitors:
  // 1. Mentions count (descending order - more mentions first)
  // 2. Average position (ascending order - better ranks first)
  return competitorsList.sort((a, b) => {
    if (b.mentions !== a.mentions) {
      return b.mentions - a.mentions;
    }
    return a.averagePosition - b.averagePosition;
  });
};

module.exports = {
  extractCompetitors
};
