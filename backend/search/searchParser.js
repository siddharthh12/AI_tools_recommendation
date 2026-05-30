/**
 * Google Search Parser Module
 * 
 * Cleans, parses, and normalizes search result listing arrays.
 * Bypasses online directories, social networks, and review aggregators to
 * yield clean physical business listings.
 */

const { cleanBusinessName, getDomainFromUrl } = require('./searchUtils');

// Directories, social channels, and maps portals to filter out
const BLOCKED_DIRECTORIES = [
  'yelp.com',
  'justdial.com',
  'tripadvisor.com',
  'yellowpages.com',
  'indiamart.com',
  'foursquare.com',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'google.com',
  'youtube.com',
  'twitter.com',
  'pinterest.com',
  'reddit.com',
  'wikipedia.org',
  'maps.google.com',
  'lbb.in',
  'magicpin.in',
  'zomato.com',
  'swiggy.com',
  'bookmyshow.com',
  'groupon.com'
];

/**
 * Verifies if a domain belongs to a general web directory.
 * @param {string} domain - Domain string (e.g. yelp.com)
 * @returns {boolean} True if blocked
 */
const isDirectoryOrAggregator = (domain) => {
  if (!domain) return true;
  return BLOCKED_DIRECTORIES.some(blocked => domain.toLowerCase().includes(blocked));
};

/**
 * Normalizes and processes raw search result entries.
 * @param {Array<Object>} rawResults - Raw items from googleSearchRunner
 * @returns {Array<Object>} Normalized, deduplicated physical competitor business listings
 */
const parseSearchResults = (rawResults) => {
  if (!rawResults || !Array.isArray(rawResults)) {
    return [];
  }

  const parsedList = [];
  const seenNames = new Set();
  const seenDomains = new Set();

  for (const item of rawResults) {
    const { title, url, snippet, rating, reviewCount, rank } = item;
    
    const cleanName = cleanBusinessName(title);
    const domain = getDomainFromUrl(url);

    // Skip listings without valid titles or those landing on blocked aggregators/directories
    if (!cleanName || cleanName.length < 2 || isDirectoryOrAggregator(domain)) {
      continue;
    }

    const nameKey = cleanName.toLowerCase();
    const domainKey = domain.toLowerCase();

    // Check for name or domain duplication to ensure list unique-ness
    if (seenNames.has(nameKey) || (domainKey && seenDomains.has(domainKey))) {
      continue;
    }

    parsedList.push({
      name: cleanName,
      website: url,
      domain: domain,
      snippet: snippet || 'Real physical business discovered in local citations.',
      rating: rating,
      reviewCount: reviewCount,
      rank: rank || 10
    });

    seenNames.add(nameKey);
    if (domainKey) {
      seenDomains.add(domainKey);
    }
  }

  return parsedList;
};

module.exports = {
  parseSearchResults
};
