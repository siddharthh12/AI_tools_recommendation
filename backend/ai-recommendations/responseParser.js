/**
 * Response Parser Module
 * 
 * Cleans markdown code block boundaries and parses the resulting string to JSON.
 */

/**
 * Safely extracts and parses JSON content from raw AI response text.
 * @param {string} rawText - Raw string from LLM completion
 * @returns {Object|null} Parsed recommendations profile or null on failure
 */
const parseResponse = (rawText) => {
  if (!rawText) return null;

  let cleaned = rawText.trim();

  // Remove markdown code fence wraps if present (e.g. ```json ... ```)
  if (cleaned.startsWith('```')) {
    // Remove starting fence
    cleaned = cleaned.replace(/^```(json)?/, '');
    // Remove ending fence
    cleaned = cleaned.replace(/```$/, '');
    cleaned = cleaned.trim();
  }

  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error('[Response Parser Error]: Failed to parse cleaned LLM response as JSON:', error.message);
    console.log('[Response Parser Info]: Raw content was:', rawText);
    return null;
  }
};

module.exports = {
  parseResponse
};
