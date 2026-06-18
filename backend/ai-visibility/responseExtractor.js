/**
 * Response Extractor
 * Extracts and packages clean prose texts, citation links, and metadata from the raw crawler results.
 */

/**
 * Extracts details from the scraper result.
 * @param {Object} rawResult - Scraper output payload
 * @returns {Object} Structured data package
 */
function extractResponse(rawResult) {
  if (!rawResult) {
    throw new Error('Raw result is required to extract response.');
  }

  return {
    query: rawResult.query,
    response: rawResult.responseText || '',
    sources: rawResult.sources || [],
    extractedAt: new Date().toISOString()
  };
}

module.exports = {
  extractResponse
};
