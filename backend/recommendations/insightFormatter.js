/**
 * Insight Formatter Module
 * 
 * Translates technical audit findings and raw threshold statistics into clear,
 * human-readable business sentences that explain exactly why a metric matters
 * and its impact on AI discoverability.
 */

const formatters = {
  LOW_MENTIONS: (value) => 
    `AI platforms are rarely citing your brand (only ${value} citation). Expanding your local business registry footprint is critical to be discoverable in LLM search responses.`,
  
  POOR_RANKING: (value) => 
    `Your competitors rank higher in recommendation lists. Optimizing page keywords raise your semantic discovery average position (currently #${value}).`,
  
  FEW_REVIEWS: (value) => 
    `Competitors have denser customer reviews. Volume establishes trust; scaling your review citations (currently at ${value}) boosts discoverability algorithms.`,
  
  LOW_RATING: (value) => 
    `Sub-optimal ratings penalize search visibility. Elevating your star rating (currently at ${value} ★) is critical to bypass LLM recommendation filters.`,
  
  MISSING_FAQ: (value) => 
    `Your website lacks conversational content. Injecting Q&A blocks allows semantic crawlers to quickly parse and recommend precise details about your brand.`,
  
  WEAK_AUTHORITY: (value) => 
    `Competitors have stronger website authority (your DA is ${value}). Acquiring high-authority backlinks scales domain crawl trusts and discoverability scores.`,
  
  WEAK_COMMUNITY_SIGNALS: (value) => 
    `Competitors have denser community footprints on Reddit (you have only ${value} forum mentions). Community discussion is a powerful signal of organic trust.`
};

/**
 * Generates user-friendly explainer text.
 * @param {string} type - Weakness key
 * @param {number} value - Measured stat value
 * @returns {string} Formatted explainer insight sentence
 */
const formatInsight = (type, value) => {
  const formatter = formatters[type];
  return formatter 
    ? formatter(value) 
    : 'Your brand discoverability metrics indicate areas of sub-optimal visibility. Optimizing local search signals raises citation rates.';
};

module.exports = {
  formatInsight,
  formatters
};
