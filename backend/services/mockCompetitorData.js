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

/**
 * Generates a list of realistic local competitors for a given category and city.
 * @param {string} category - Business vertical (e.g. Gym, Cafe)
 * @param {string} city - City location (e.g. Vikhroli, Mumbai)
 * @param {string} [excludeBrand] - Brand name to exclude
 * @returns {Array<Object>} List of realistic mock competitors
 */
const generateMockCompetitors = (category, city, excludeBrand = '') => {
  const cleanCat = category.trim().toLowerCase();
  const cleanCity = city.trim();
  const cleanExclude = excludeBrand.trim().toLowerCase();

  // Primary location part (e.g., "Vikhroli, Mumbai" -> "Vikhroli")
  const primaryLoc = cleanCity.split(',')[0].trim();

  let names = [];
  if (cleanCat === 'gym' || cleanCat === 'fitness') {
    names = [
      `Cult Fit ${primaryLoc}`,
      `Gold's Gym ${primaryLoc}`,
      `The Gym Town ${primaryLoc}`,
      `My Fitness Club ${primaryLoc}`,
      `Powerhouse Gym ${primaryLoc}`
    ];
  } else if (cleanCat === 'cafe' || cleanCat === 'café' || cleanCat === 'coffee') {
    names = [
      `Blue Tokai Coffee ${primaryLoc}`,
      `Third Wave Coffee ${primaryLoc}`,
      `Starbucks ${primaryLoc}`,
      `The Coffee Bean & Tea Leaf ${primaryLoc}`,
      `Café Coffee Day ${primaryLoc}`
    ];
  } else {
    // Generic fallback titles using category name
    const singularCat = cleanCat.endsWith('s') ? cleanCat.slice(0, -1) : cleanCat;
    const capitalizedCat = singularCat.charAt(0).toUpperCase() + singularCat.slice(1);
    names = [
      `Elite ${capitalizedCat} ${primaryLoc}`,
      `The Local ${capitalizedCat} ${primaryLoc}`,
      `Premium ${capitalizedCat} Hub`,
      `Urban ${capitalizedCat} Club`,
      `Metro ${capitalizedCat} Center`
    ];
  }

  // Filter out the excludeBrand (target business)
  const filteredNames = names.filter(name => {
    const cleanName = name.toLowerCase().trim();
    return cleanName !== cleanExclude && !cleanName.includes(cleanExclude) && !cleanExclude.includes(cleanName);
  });

  // Take top 4 physical competitors
  return filteredNames.slice(0, 4).map((name, index) => {
    // Generate realistic domains
    const domainName = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    return {
      name: name,
      website: `https://www.${domainName}`,
      location: cleanCity,
      sourceQuery: `Google Search: best ${cleanCat} in ${primaryLoc}`,
      position: index + 1,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + cleanCity)}`,
      isLocalPack: true
    };
  });
};

module.exports = {
  getBrandMetrics,
  generateMockCompetitors
};

