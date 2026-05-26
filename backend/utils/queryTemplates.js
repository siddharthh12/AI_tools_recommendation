/**
 * AI Query Engine - Reusable Search Templates
 * 
 * Defines standard search phrases used to probe AI platforms like Perplexity.
 * The query generator dynamically swaps '[category]' and '[city]' placeholders
 * with active search parameters inputted by businesses.
 */

const queryTemplates = [
  "best [category] in [city]",
  "top rated [category] in [city]",
  "recommended [category] near [city]"
];

module.exports = queryTemplates;
