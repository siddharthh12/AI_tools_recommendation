/**
 * Query Generator Module
 * 
 * Generates highly realistic and localized Google Search queries based on 
 * business vertical category and geographical location inputs.
 */

/**
 * Generates search queries dynamically.
 * @param {Object} input - Query parameters
 * @param {string} input.brand - The name of the brand (e.g., "Be Strong Gym")
 * @param {string} input.category - The category/industry (e.g., "Gym")
 * @param {string} input.location - The geographical city/neighborhood (e.g., "Vikhroli, Mumbai")
 * @returns {Array<string>} List of localized search queries
 */
const generateQueries = (input) => {
  const { brand, category, location } = input;
  
  if (!category || !location) {
    throw new Error('Category and Location are required to generate search queries.');
  }

  const cleanCategory = category.trim();
  const cleanLocation = location.trim();

  // Handle singular vs plural forms
  const isPlural = cleanCategory.toLowerCase().endsWith('s');
  const singular = isPlural ? cleanCategory.slice(0, -1) : cleanCategory;
  const plural = isPlural ? cleanCategory : `${cleanCategory}s`;

  // Extract granular location parts (e.g., "Vikhroli, Mumbai" -> ["Vikhroli", "Mumbai"])
  const locationParts = cleanLocation.split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);
  
  const primaryLoc = locationParts[0] || cleanLocation;
  const fullLoc = cleanLocation;

  const queriesSet = new Set();

  // Basic localized queries using primary location (e.g., "Vikhroli")
  queriesSet.add(`best ${singular.toLowerCase()} in ${primaryLoc.toLowerCase()}`);
  queriesSet.add(`top ${plural.toLowerCase()} in ${primaryLoc.toLowerCase()}`);
  queriesSet.add(`affordable ${singular.toLowerCase()} in ${primaryLoc.toLowerCase()}`);
  queriesSet.add(`${singular.toLowerCase()} near ${primaryLoc.toLowerCase()}`);

  // Advanced queries if location contains multiple parts (e.g., "Vikhroli, Mumbai")
  if (locationParts.length > 1) {
    queriesSet.add(`best ${singular.toLowerCase()} in ${fullLoc.toLowerCase()}`);
    queriesSet.add(`top ${plural.toLowerCase()} in ${fullLoc.toLowerCase()}`);
    queriesSet.add(`fitness center near ${primaryLoc.toLowerCase()}`); // Category-specific smart synonym mapping
    queriesSet.add(`popular ${singular.toLowerCase()} in ${fullLoc.toLowerCase()}`);
  } else {
    queriesSet.add(`best ${singular.toLowerCase()} in ${fullLoc.toLowerCase()}`);
    queriesSet.add(`top ${plural.toLowerCase()} in ${fullLoc.toLowerCase()}`);
    queriesSet.add(`popular ${singular.toLowerCase()} in ${fullLoc.toLowerCase()}`);
  }

  // General synonyms mapped intelligently
  if (singular.toLowerCase() === 'gym') {
    queriesSet.add(`fitness center near ${primaryLoc.toLowerCase()}`);
    queriesSet.add(`workout club in ${primaryLoc.toLowerCase()}`);
  } else if (singular.toLowerCase() === 'cafe' || singular.toLowerCase() === 'café') {
    queriesSet.add(`coffee shop in ${primaryLoc.toLowerCase()}`);
    queriesSet.add(`best places to drink coffee in ${primaryLoc.toLowerCase()}`);
  }

  // Convert to clean list, replace multiple spaces, and return first 4-5 high quality queries
  const finalQueries = Array.from(queriesSet)
    .map(query => query.replace(/\s+/g, ' ').trim())
    .slice(0, 5);

  console.log(`[Query Generator]: Created ${finalQueries.length} search queries for category "${cleanCategory}" in "${cleanLocation}":`, finalQueries);
  return finalQueries;
};

module.exports = {
  generateQueries
};
