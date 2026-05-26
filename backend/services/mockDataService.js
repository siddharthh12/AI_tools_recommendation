/**
 * Mock Data Service
 * 
 * Generates local review data and website authority parameters for businesses.
 * Uses consistent hashing based on the business name to ensure that subsequent
 * crawls for the same brand yield consistent, high-fidelity metrics.
 * 
 * In Phase 4, these functions can be directly swapped with Google Reviews
 * and SEO ranking crawler APIs.
 */

/**
 * Computes a fast string hash code.
 */
const getHashCode = (str) => {
  let hash = 0;
  if (!str) return hash;
  const cleanStr = str.toLowerCase().trim();
  for (let i = 0; i < cleanStr.length; i++) {
    hash = cleanStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

/**
 * Fetches review signals and website authority metrics.
 * @param {string} businessName - The brand name of the company
 * @param {string} category - Business vertical
 * @param {string} city - Geographical city location
 * @returns {Object} Blended analytics indicators
 */
const getMockAnalytics = (businessName, category, city) => {
  const hash = getHashCode(businessName);

  // 1. Generate local reviews coordinates
  // Rating ranges between 4.0 and 5.0 stars
  const rating = parseFloat((4.0 + (hash % 11) / 10).toFixed(1));
  // Count ranges between 200 and 1960 reviews
  const reviewCount = 200 + (hash % 17) * 110;

  // 2. Generate website authority indicators
  // Domain Authority (DA) ranges between 35 and 91
  const domainAuthority = 35 + (hash % 9) * 7;
  // Keyword presence
  const hasKeywords = hash % 3 !== 0;
  // SSL state
  const sslEnabled = hash % 7 !== 0;

  return {
    reviewData: {
      rating,
      reviewCount
    },
    authorityData: {
      hasWebsite: true,
      domainAuthority,
      hasKeywords,
      sslEnabled
    }
  };
};

module.exports = {
  getMockAnalytics,
  getHashCode
};
