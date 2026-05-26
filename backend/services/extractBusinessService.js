/**
 * Business Name Extraction Service
 * 
 * Takes raw text outputs from AI platforms (like Perplexity) and parses
 * listed business names, tracking their mention positions.
 * 
 * MVP Strategy:
 * Uses regex pattern-matching to identify list patterns (e.g. "1. **Cult Fit**")
 * and extracts the clean title by stripping descriptions and markdown styles.
 */

/**
 * Extracts a list of mentioned businesses with their ranking positions from text.
 * @param {string} text - Raw text response from Perplexity AI
 * @returns {Array<Object>} Extracted businesses: [{ name: "Cult Fit", position: 1 }]
 */
const extractBusinesses = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const lines = text.split('\n');
  const results = [];
  const seenNames = new Set();
  let sequentialPosition = 1;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Regex 1: Match standard numbered list items like "1. **Brand Name**" or "1) Brand Name"
    const numberedMatch = trimmedLine.match(/^\s*(\d+)[.)\s-]+\s*(.+)/);
    
    if (numberedMatch) {
      const position = parseInt(numberedMatch[1], 10);
      let rawName = numberedMatch[2];

      const cleanName = cleanBusinessName(rawName);

      if (cleanName && !seenNames.has(cleanName.toLowerCase())) {
        results.push({
          name: cleanName,
          position: position
        });
        seenNames.add(cleanName.toLowerCase());
      }
    } else {
      // Regex 2: Match bullet points like "- **Brand Name**" or "* Brand Name"
      const bulletMatch = trimmedLine.match(/^\s*[-*+]\s+(.+)/);
      if (bulletMatch) {
        let rawName = bulletMatch[1];
        const cleanName = cleanBusinessName(rawName);

        if (cleanName && !seenNames.has(cleanName.toLowerCase())) {
          results.push({
            name: cleanName,
            position: sequentialPosition++
          });
          seenNames.add(cleanName.toLowerCase());
        }
      }
    }
  }

  return results;
};

/**
 * Helper utility to clean up extracted business strings:
 * - Strips markdown bold stars (**).
 * - Separates titles from descriptions (splits at colons or dashes).
 * - Trims whitespaces.
 */
function cleanBusinessName(rawText) {
  if (!rawText) return '';

  let name = rawText;

  // 1. Split by colon or dash to strip descriptions (e.g., "1. **Gold's Gym**: A fitness center..." -> "1. **Gold's Gym**")
  // We check for ": " or " - " specifically to avoid breaking hyphenated names
  if (name.includes(':')) {
    name = name.split(':')[0];
  } else if (name.includes(' - ')) {
    name = name.split(' - ')[0];
  }

  // 2. Remove markdown bolding tags "**" and "*"
  name = name.replace(/\*\*/g, '').replace(/\*/g, '');

  // 3. Clean up leading/trailing symbols, quotes, and whitespace
  name = name.replace(/^["'“”`\s]+|["'“”`\s]+$/g, '').trim();

  // 4. Return name only if it starts with an alphanumeric character (filters out generic sentences)
  if (name.length > 0 && /^[A-Za-z0-9]/.test(name)) {
    return name;
  }

  return '';
}

module.exports = {
  extractBusinesses,
  cleanBusinessName
};
