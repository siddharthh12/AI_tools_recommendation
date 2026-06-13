/**
 * Website Extractor
 * 
 * Resolves the official business website from Google Search results.
 * Avoids directory platforms and social media aggregators.
 */

const { isValidUrl, extractDomain } = require('./enrichmentUtils');

const IGNORED_DIRECTORIES = [
  'google.com',
  'google.co.in',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'wikipedia.org',
  'yelp.com',
  'tripadvisor.com',
  'justdial.com',
  'zomato.com',
  'swiggy.com',
  'yellowpages.com',
  'foursquare.com',
  'indiamart.com',
  'sulekha.com',
  'asklaila.com',
  'mapquest.com',
  'groupon.com',
  'magicpin.in'
];

/**
 * Checks if a domain is a known directory/aggregator site.
 * @param {string} url - The URL to inspect
 * @returns {boolean} True if directory
 */
function isDirectoryUrl(url) {
  const domain = extractDomain(url).toLowerCase();
  if (!domain) return true;
  return IGNORED_DIRECTORIES.some(dir => domain === dir || domain.endsWith('.' + dir));
}

/**
 * Resolves the official business website.
 * @param {Object} page - Playwright page context
 * @param {string|null} mapsWebsite - Website URL obtained from Google Business Listing (if any)
 * @param {string} name - Business name
 * @param {EnrichmentLogger} logger - Active logger
 * @returns {Promise<Object>} Object containing website URL and domain details
 */
async function extractWebsite(page, mapsWebsite, name, logger) {
  if (mapsWebsite && isValidUrl(mapsWebsite) && !isDirectoryUrl(mapsWebsite)) {
    logger.log('WebsiteExtractor', `Using website from Google Maps Knowledge Panel: ${mapsWebsite}`);
    return {
      website: mapsWebsite,
      domain: extractDomain(mapsWebsite),
      title: null // To be filled if we visit the homepage
    };
  }

  logger.log('WebsiteExtractor', `No valid website in Knowledge Panel. Searching organic links for "${name}"...`);

  // Scan the current search results page for organic listing blocks
  const organicLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('div.g a, div.tF23ub a'));
    return anchors
      .map(a => a.href)
      .filter(href => href && href.startsWith('http') && !href.includes('google.com'));
  });

  // Find the first organic link that is not a directory
  let resolvedUrl = null;
  for (const link of organicLinks) {
    if (!isDirectoryUrl(link)) {
      resolvedUrl = link;
      logger.log('WebsiteExtractor', `Discovered organic candidate link: ${resolvedUrl}`);
      break;
    }
  }

  if (resolvedUrl) {
    return {
      website: resolvedUrl,
      domain: extractDomain(resolvedUrl),
      title: null
    };
  }

  logger.log('WebsiteExtractor', `No official website could be resolved for "${name}"`, 'warn');
  return {
    website: null,
    domain: null,
    title: null
  };
}

module.exports = {
  extractWebsite,
  isDirectoryUrl
};
