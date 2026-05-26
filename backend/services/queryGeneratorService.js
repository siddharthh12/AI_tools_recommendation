/**
 * Query Generator Service
 * 
 * Compiles dynamic search phrases by injecting the target category and city
 * into defined placeholder templates.
 */

const queryTemplates = require('../utils/queryTemplates');

/**
 * Compiles search queries from templates.
 * @param {string} category - Business vertical (e.g. Gym, Cafe)
 * @param {string} city - Geographical location (e.g. Mumbai, Berlin)
 * @returns {Array<string>} Compiled search queries
 */
const generateQueries = (category, city) => {
  if (!category || !city) {
    throw new Error('Category and City are required to generate queries.');
  }

  const cleanCategory = category.trim();
  const cleanCity = city.trim();

  // Map each template, swapping placeholders
  return queryTemplates.map(template => {
    return template
      .replace(/\[category\]/g, cleanCategory)
      .replace(/\[city\]/g, cleanCity);
  });
};

module.exports = {
  generateQueries
};
