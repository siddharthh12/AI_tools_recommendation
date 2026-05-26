/**
 * Competitor Mock Data Service
 * 
 * Generates structured reviews, authority, Reddit discussions, and FAQ page
 * metrics for any brand name. Uses reproducible hashing to ensure that scans
 * for the same competitor name return consistent data.
 */

const { getHashCode } = require('./mockDataService');

/**
 * Compiles a full visibility metrics profile for any brand.
 * @param {string} name - Brand name of target or competitor
 * @returns {Object} Complete metrics profile
 */
const getBrandMetrics = (name) => {
  const hash = getHashCode(name);

  // 1. Review signals (Rating 3.8 to 5.0, count 50 to 3500 reviews)
  const rating = parseFloat((3.8 + (hash % 13) / 10).toFixed(1));
  const reviewCount = 50 + (hash % 23) * 150;

  // 2. SEO website authority indicators (DA 30 to 86)
  const domainAuthority = 30 + (hash % 8) * 8;
  const hasKeywords = hash % 2 === 0;
  const sslEnabled = hash % 5 !== 0;

  // 3. Reddit mentions (0 to 44 mentions, sentiment 0.50 to 0.95)
  const redditMentions = hash % 15 * 3;
  const redditSentiment = parseFloat((0.50 + (hash % 10) * 0.05).toFixed(2));

  // 4. FAQ Content signals (0 to 14 questions count)
  const hasFaqPage = hash % 4 !== 0;
  const faqCount = hasFaqPage ? 4 + (hash % 11) : 0;
  const usesSchema = hasFaqPage && hash % 3 !== 0;

  return {
    name,
    reviewData: {
      rating,
      reviewCount
    },
    authorityData: {
      hasWebsite: true,
      domainAuthority,
      hasKeywords,
      sslEnabled
    },
    redditData: {
      mentions: redditMentions,
      sentiment: redditSentiment
    },
    faqData: {
      hasFaqPage,
      faqCount,
      usesSchema
    }
  };
};

module.exports = {
  getBrandMetrics
};
