/**
 * Website SEO Authority Calculator for Competitor Analysis
 * 
 * Re-evaluates target and competitor website authority metrics:
 * 1. Has Website (base) = +30 points
 * 2. Domain Authority (DA * 0.40) = max 40 points
 * 3. Contains category keywords in tags = +20 points
 * 4. SSL (HTTPS) active = +10 points
 */

const normalize = require('../scoring/normalizeScore');

/**
 * Calculates authority score (0 - 100).
 * @param {Object} authData - Website authority metadata
 */
const calculateAuthorityValue = (authData) => {
  if (!authData) return 0;

  const {
    hasWebsite = false,
    domainAuthority = 0,
    hasKeywords = false,
    sslEnabled = false
  } = authData;

  let rawScore = 0;

  if (hasWebsite) {
    rawScore += 30;
    rawScore += domainAuthority * 0.40;
    if (hasKeywords) rawScore += 20;
    if (sslEnabled) rawScore += 10;
  }

  return normalize(rawScore);
};

module.exports = {
  calculateAuthorityValue
};
