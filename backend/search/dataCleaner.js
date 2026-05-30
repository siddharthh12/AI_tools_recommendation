/**
 * Business Data Cleaner Module
 * 
 * Cleans, normalizes, and deduplicates scraped competitor data.
 */

const { getDomainFromUrl } = require('./searchUtils');
const logger = require('./searchLogger');

/**
 * Strips geographical suffixes and tagline clutter from business names.
 * Example: "Gold's Gym Vikhroli West - Gym in Mumbai" -> "Gold's Gym"
 * @param {string} rawName - The extracted raw business name
 * @param {string} [category] - Optional vertical category to help strip generic suffix
 * @param {string} [location] - Optional location to help strip geographic suffix
 * @returns {string} The cleaned business name
 */
const cleanBusinessName = (rawName, category = '', location = '') => {
  if (!rawName || typeof rawName !== 'string') return '';

  let name = rawName.trim();

  // 1. Split on standard delimiters
  name = name.split(' - ')[0].split(' | ')[0].split(' : ')[0].split(' – ')[0].trim();

  // 2. Remove geographical phrases (case-insensitive)
  if (location) {
    const locParts = location.split(',').map(p => p.trim().toLowerCase());
    locParts.forEach(part => {
      if (part && part.length > 2) {
        // Match word boundaries of the location part to prevent partial word cuts
        const regex = new RegExp(`\\b${part}\\b`, 'gi');
        name = name.replace(regex, '');
      }
    });
  }

  // 3. Remove common geographical direction suffixes
  const directions = ['west', 'east', 'north', 'south', 'central', 'road', 'street'];
  directions.forEach(dir => {
    const regex = new RegExp(`\\b${dir}\\b`, 'gi');
    name = name.replace(regex, '');
  });

  // 4. Strip extra formatting quotes/double spaces
  name = name.replace(/\s+/g, ' ').replace(/^["'“”`\s,.-]+|["'“”`\s,.-]+$/g, '').trim();

  // 5. Title-case recovery if empty or broken, make sure first letter is uppercase
  if (name.length === 0) {
    return rawName.trim();
  }

  return name;
};

/**
 * Normalizes, filters, and deduplicates an array of competitor objects.
 * @param {Array<Object>} competitors - Extracted competitors list
 * @param {string} category - Business vertical/category
 * @param {string} location - Geo location
 * @returns {Array<Object>} Sanitized and unique competitor listings
 */
const cleanCompetitorsData = (competitors, category, location) => {
  if (!competitors || !Array.isArray(competitors)) {
    return [];
  }

  logger.log('Cleaner', `Beginning normalization and deduplication of ${competitors.length} extracted items.`);

  const cleanList = [];
  const seenNames = new Set();
  const seenDomains = new Set();

  for (const item of competitors) {
    if (!item.name || item.name.trim().length < 2) {
      continue;
    }

    // Clean name
    const normalizedName = cleanBusinessName(item.name, category, location);
    const domain = getDomainFromUrl(item.website);
    
    const nameKey = normalizedName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domainKey = domain.toLowerCase();

    // Check duplicates by name key or domain key
    if (seenNames.has(nameKey)) {
      logger.log('Cleaner', `Skipping duplicate business by name: "${normalizedName}"`);
      continue;
    }
    if (domainKey && domainKey !== '' && seenDomains.has(domainKey)) {
      logger.log('Cleaner', `Skipping duplicate business by domain: "${domain}"`);
      continue;
    }

    seenNames.add(nameKey);
    if (domainKey) {
      seenDomains.add(domainKey);
    }

    cleanList.push({
      name: normalizedName,
      location: item.location || location,
      website: item.website || '',
      sourceQuery: item.sourceQuery || '',
      position: item.position || 1
    });
  }

  logger.log('Cleaner', `Deduplication complete. Retained ${cleanList.length} unique competitors out of ${competitors.length} entries.`);
  return cleanList;
};

module.exports = {
  cleanBusinessName,
  cleanCompetitorsData
};
