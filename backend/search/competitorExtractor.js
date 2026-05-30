/**
 * Competitor Extractor Module
 * 
 * Aggregates raw Google search results, filters out directory sites, paid ads,
 * and the user's own business, yielding clean real-world competitor listings.
 */

const { getDomainFromUrl } = require('./searchUtils');
const logger = require('./searchLogger');

// Directory aggregators, social networks, and informational domains to filter out
const BLOCKED_DOMAINS = [
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
  'groupon.com',
  'sulekha.com',
  'indiahitz.com',
  'mouthshut.com'
];

/**
 * Checks if a URL domain matches a blocked directory or social network.
 * @param {string} url - Website URL
 * @returns {boolean} True if the domain is blocked
 */
const isBlockedDomain = (url) => {
  if (!url) return false;
  const domain = getDomainFromUrl(url).toLowerCase();
  return BLOCKED_DOMAINS.some(blocked => domain === blocked || domain.endsWith('.' + blocked));
};

/**
 * Checks if a listing name looks like a directory title or blog compilation instead of a physical business.
 * @param {string} name - Business name
 * @returns {boolean} True if it should be excluded
 */
const isCompilationOrBlog = (name) => {
  if (!name) return true;
  const lower = name.toLowerCase();
  
  // Exclude blog lists or informational titles
  const genericTerms = [
    'best', 'top 10', 'top 5', 'top 8', 'affordable', 'how to', 
    'near me', 'list of', 'classes', 'ranking', 'reviews of'
  ];
  
  // If the listing name contains multiple generic review blog words, exclude it
  return genericTerms.some(term => lower.startsWith(term)) || 
         (lower.includes('directory') || lower.includes('ratings') || lower.includes('map of'));
};

/**
 * Extracts and filters authentic local business competitors from scraped search listings.
 * @param {Array<Object>} rawListings - Combined raw list from all Playwright query crawls
 * @param {string} userBrand - The user's brand name to exclude
 * @param {string} category - Business vertical/category
 * @param {string} location - Geo location
 * @returns {Array<Object>} Filtered competitor list
 */
const extractCompetitors = (rawListings, userBrand, category = '', location = '') => {
  if (!rawListings || !Array.isArray(rawListings)) {
    return [];
  }

  logger.log('Extractor', `Processing ${rawListings.length} raw results for brand "${userBrand}" (Category: "${category}").`);

  const cleanUser = userBrand.toLowerCase().trim();
  const filtered = [];

  for (const item of rawListings) {
    const { name, website, mapsLink, snippet, sourceQuery, position } = item;

    if (!name || name.length < 2) {
      continue;
    }

    const cleanName = name.toLowerCase().trim();

    // 1. Exclude the user's own business
    if (cleanName === cleanUser || cleanName.includes(cleanUser) || cleanUser.includes(cleanName)) {
      logger.log('Extractor', `Excluding user's own business: "${name}"`);
      continue;
    }

    // 2. Exclude organic results that land on standard aggregator/directory domains
    if (website && isBlockedDomain(website)) {
      logger.log('Extractor', `Excluding directory/aggregator URL: "${website}"`);
      continue;
    }

    // 3. Exclude blog lists or query terms in name
    if (isCompilationOrBlog(name)) {
      logger.log('Extractor', `Excluding compilation list or generic info: "${name}"`);
      continue;
    }

    // 4. Categorical relevance double check (e.g. if searching for a gym, avoid pizza, dental, or SaaS results)
    const lowerName = name.toLowerCase();
    const lowerCategory = category.toLowerCase();
    const lowerSnippet = snippet ? snippet.toLowerCase() : '';

    // If a listing has a website but doesn't mention gym/fitness (when category is gym), do a soft-relevance check.
    // We allow local pack elements since Maps automatically handles categorical filters.
    if (lowerCategory === 'gym') {
      const isGymRelated = lowerName.includes('gym') || 
                           lowerName.includes('fit') || 
                           lowerName.includes('workout') || 
                           lowerName.includes('crossfit') || 
                           lowerName.includes('iron') || 
                           lowerName.includes('health') ||
                           lowerName.includes('athletic') ||
                           lowerName.includes('sports') ||
                           lowerName.includes('yoga') ||
                           lowerName.includes('strength') ||
                           lowerSnippet.includes('gym') ||
                           lowerSnippet.includes('fitness') ||
                           item.isLocalPack; // Maps pack is highly trusted for the category queried
      
      if (!isGymRelated) {
        logger.log('Extractor', `Excluding non-gym business: "${name}"`);
        continue;
      }
    }

    filtered.push({
      name: name,
      website: website || '',
      location: item.location || location,
      sourceQuery: sourceQuery,
      position: position,
      mapsLink: mapsLink || ''
    });
  }

  logger.log('Extractor', `Successfully extracted ${filtered.length} valid competitor businesses.`);
  return filtered;
};

module.exports = {
  extractCompetitors
};
