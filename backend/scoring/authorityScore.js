/**
 * Website Authority Sub-Score Calculator
 * 
 * Evaluates business search-discoverability indicators.
 * Heuristically awards points for:
 * 1. Has Website (base crawl target) = +30 points
 * 2. Domain Authority index (DA 0-100) = weighted at 40% (DA * 0.40)
 * 3. Contains category keywords in markup = +20 points
 * 4. SSL Security active (HTTPS) = +10 points
 */

const normalize = require('./normalizeScore');

/**
 * Calculates the website authority sub-score.
 * @param {Object} authorityData - Domain signals
 * @param {boolean} authorityData.hasWebsite - True if brand website exists
 * @param {number} authorityData.domainAuthority - Domain authority ranking (0 - 100)
 * @param {boolean} authorityData.hasKeywords - True if category keywords exist in SEO markup
 * @param {boolean} authorityData.sslEnabled - True if SSL (HTTPS) active
 * @returns {number} Normalized score (0 - 100)
 */
const calculateAuthorityScore = (authorityData) => {
  if (!authorityData) {
    return 0;
  }

  const {
    hasWebsite = false,
    domainAuthority = 0,
    hasKeywords = false,
    sslEnabled = false
  } = authorityData;

  let rawScore = 0;

  // Heuristic additions
  if (hasWebsite) {
    rawScore += 30; // +30 base points
    rawScore += domainAuthority * 0.40; // max +40 points
    if (hasKeywords) rawScore += 20; // +20 points
    if (sslEnabled) rawScore += 10; // +10 points
  }

  return normalize(rawScore);
};

module.exports = calculateAuthorityScore;
