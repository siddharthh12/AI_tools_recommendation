/**
 * Business Mention Detector
 * Detects whether the user's business or competitors appear in the AI responses.
 * Assigns ranking positions based on the order of occurrence in the text.
 */

/**
 * Detects business mentions inside AI response text.
 * @param {string} responseText - Raw text answer from Perplexity
 * @param {Array<string>} businesses - List of brand/business names to check
 * @param {Object} [aliasesMap] - Optional map of business name to array of its aliases
 * @returns {Array<Object>} List of results with mention status and position
 */
function detectMentions(responseText, businesses, aliasesMap = {}) {
  if (!responseText) {
    return businesses.map(name => ({ name, mentioned: false }));
  }

  const normalizedText = responseText.toLowerCase();

  // 1. Identify which businesses are mentioned and their first occurrence index
  const occurrences = [];
  
  businesses.forEach(name => {
    const cleanName = name.trim();
    if (!cleanName) return;

    // Check variations / aliases if defined, otherwise check the name itself
    const variations = aliasesMap[cleanName] || [cleanName];
    let minIndex = Infinity;
    let isFound = false;

    variations.forEach(variation => {
      const idx = normalizedText.indexOf(variation.trim().toLowerCase());
      if (idx !== -1 && idx < minIndex) {
        minIndex = idx;
        isFound = true;
      }
    });
    
    if (isFound) {
      occurrences.push({
        name: cleanName,
        index: minIndex,
        mentioned: true
      });
    } else {
      occurrences.push({
        name: cleanName,
        index: Infinity,
        mentioned: false
      });
    }
  });

  // 2. Sort the mentioned occurrences by their position in text to assign ranks
  const mentionedOnly = occurrences.filter(o => o.mentioned);
  mentionedOnly.sort((a, b) => a.index - b.index);

  // 3. Compile output mapping ranks to positions
  return occurrences.map(item => {
    if (item.mentioned) {
      // Find its rank in the sorted list (1-indexed)
      const position = mentionedOnly.findIndex(o => o.name === item.name) + 1;
      return {
        name: item.name,
        mentioned: true,
        position
      };
    } else {
      return {
        name: item.name,
        mentioned: false
      };
    }
  });
}

module.exports = {
  detectMentions
};
