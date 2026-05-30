/**
 * Search Query Builder Module
 * 
 * Generates realistic Google search queries using dynamic category and city injection.
 * Provides reusable templates and clean string formatting.
 */

/**
 * Generates Google search queries based on business category and city.
 * @param {Object} input - Query builder inputs
 * @param {string} input.business - Name of the user's business
 * @param {string} input.category - Business vertical/category (e.g. Gym, Cafe)
 * @param {string} input.city - Geographical location (e.g. Mumbai, Berlin)
 * @returns {Array<string>} An array of formatted search queries
 */
const buildQueries = (input) => {
  const { business, category, city } = input;
  if (!category || !city) {
    throw new Error('Category and City are required to generate search queries.');
  }

  const cleanCategory = category.trim();
  const cleanCity = city.trim();

  // Determine standard singular and plural forms for category phrasing
  const isPlural = cleanCategory.toLowerCase().endsWith('s');
  const singular = isPlural ? cleanCategory.slice(0, -1) : cleanCategory;
  const plural = isPlural ? cleanCategory : `${cleanCategory}s`;

  // Generate localized, premium variation queries
  const templates = [
    `best ${plural.toLowerCase()} in ${cleanCity}`,
    `top ${singular.toLowerCase()} centers in ${cleanCity}`,
    `affordable ${singular.toLowerCase()} in ${cleanCity}`,
    `${singular.toLowerCase()} near ${cleanCity}`,
    `best beginner ${singular.toLowerCase()} in ${cleanCity}`
  ];

  // Map and clean queries from double spaces
  const queries = templates.map(query => query.replace(/\s+/g, ' ').trim());
  console.log(`[Query Builder]: Generated ${queries.length} search probes for ${cleanCategory} in ${cleanCity}:`, queries);
  return queries;
};

module.exports = {
  buildQueries
};
