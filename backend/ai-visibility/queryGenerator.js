/**
 * AI Visibility query generator.
 * Generates realistic search query prompts to analyze local business recommendability in AI search engines.
 */

/**
 * Normalizes and pluralizes a category name.
 * @param {string} category 
 * @returns {string} Pluralized category
 */
function pluralizeCategory(category) {
  const clean = category.trim().toLowerCase();
  
  if (clean === 'gym') return 'gyms';
  if (clean === 'cafe' || clean === 'café') return 'cafes';
  if (clean === 'dentist') return 'dentists';
  if (clean === 'hotel') return 'hotels';
  if (clean === 'clinic') return 'clinics';
  if (clean === 'restaurant') return 'restaurants';
  if (clean === 'boutique') return 'boutiques';
  
  if (clean.endsWith('y')) {
    return category.trim().slice(0, -1) + 'ies';
  }
  if (clean.endsWith('s') || clean.endsWith('x') || clean.endsWith('z') || clean.endsWith('ch') || clean.endsWith('sh')) {
    return category.trim() + 'es';
  }
  return category.trim() + 's';
}

/**
 * Gets a related search synonym for a given category.
 * @param {string} category 
 * @returns {string} Synonym category name
 */
function getCategorySynonym(category) {
  const clean = category.trim().toLowerCase();
  if (clean === 'gym') return 'fitness centers';
  if (clean === 'cafe' || clean === 'café') return 'coffee shops';
  if (clean === 'clinic') return 'healthcare centers';
  if (clean === 'restaurant') return 'dining places';
  if (clean === 'dentist') return 'dental clinics';
  return category.trim();
}

/**
 * Generates search queries for the AI Visibility engine.
 * @param {string} category - Business vertical (e.g., Gym, Cafe)
 * @param {string} location - Target city or area (e.g., Vikhroli, Mumbai)
 * @returns {Array<string>} list of generated query strings
 */
function generateQueries(category, location) {
  if (!category || !location) {
    throw new Error('Category and Location are required to generate queries.');
  }

  const cleanCat = category.trim();
  const cleanLoc = location.trim();
  const pluralCat = pluralizeCategory(cleanCat);
  const synonym = getCategorySynonym(cleanCat);

  // Template queries representing standard consumer searches
  const templates = [
    `best ${cleanCat.toLowerCase()} in [location]`,
    `top ${synonym} in [location]`,
    `affordable ${pluralCat} in [location]`,
    `best beginner ${cleanCat.toLowerCase()} in [location]`,
    `recommended ${pluralCat} in [location]`
  ];

  return templates.map(t => t.replace(/\[location\]/g, cleanLoc));
}

module.exports = {
  generateQueries,
  pluralizeCategory,
  getCategorySynonym
};
