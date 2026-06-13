/**
 * Enrichment Utilities
 * 
 * General utility helper functions for the competitor enrichment pipeline.
 */

/**
 * Validates if a string is a valid HTTP/HTTPS URL.
 * @param {string} urlStr - The URL candidate
 * @returns {boolean} True if valid
 */
function isValidUrl(urlStr) {
  if (!urlStr) return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Normalizes a URL, adding https:// prefix if protocol is missing.
 * @param {string} url - The URL to clean
 * @returns {string} Normalized URL
 */
function cleanUrl(url) {
  if (!url) return '';
  let cleaned = url.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  try {
    const parsed = new URL(cleaned);
    return parsed.href;
  } catch (_) {
    return url; // Return as-is if invalid
  }
}

/**
 * Extracts the primary domain name from a URL.
 * @param {string} urlStr - URL string
 * @returns {string} E.g., "cooperchimney.com"
 */
function extractDomain(urlStr) {
  if (!urlStr) return '';
  try {
    const cleaned = cleanUrl(urlStr);
    const parsed = new URL(cleaned);
    let hostname = parsed.hostname;
    
    // Remove www. prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch (_) {
    return '';
  }
}

/**
 * Parses numeric reviews from Google reviews count text.
 * E.g., "5,200", "5.2K", "1.5M", "4.2T reviews"
 * @param {string|number} value - The raw text review value
 * @returns {number|null} Clean integer or null
 */
function parseReviewCount(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Math.round(value);

  let str = value.toString().trim().toUpperCase();
  // Strip non-numeric suffixes or descriptions like "reviews"
  str = str.replace(/REVIEWS|REVIEW/g, '').trim();

  // Handle common formatting commas or dots
  let multiplier = 1;
  if (str.includes('K')) {
    multiplier = 1000;
    str = str.replace('K', '');
  } else if (str.includes('M')) {
    multiplier = 1000000;
    str = str.replace('M', '');
  } else if (str.includes('T')) {
    // In some locales (like India / Marathi / German), T stands for Thousand (Tausend) or similar. 
    // We treat it as 1000 if it looks like a normal rating suffix (e.g. 5.2T reviews)
    multiplier = 1000;
    str = str.replace('T', '');
  }

  // Remove commas or spaces
  str = str.replace(/,/g, '').replace(/\s/g, '');

  const num = parseFloat(str);
  if (isNaN(num)) return null;

  return Math.round(num * multiplier);
}

/**
 * Parses rating string to a clean float between 1.0 and 5.0.
 * E.g. "4.5 out of 5", "4,5"
 * @param {string|number} value - Raw rating value
 * @returns {number|null} Float rating or null
 */
function parseRating(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') {
    return value >= 1 && value <= 5 ? parseFloat(value.toFixed(2)) : null;
  }

  let str = value.toString().trim();
  // Handle commas as decimal separator (e.g., European/Indian standard formats in some queries)
  str = str.replace(',', '.');
  
  // Extract the first float matching e.g., "4.5"
  const match = str.match(/(\d(\.\d)?)/);
  if (!match) return null;

  const num = parseFloat(match[0]);
  if (isNaN(num) || num < 1.0 || num > 5.0) return null;

  return parseFloat(num.toFixed(2));
}

/**
 * Standard sleep/delay function.
 * @param {number} ms - Milliseconds to pause
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  isValidUrl,
  cleanUrl,
  extractDomain,
  parseReviewCount,
  parseRating,
  sleep
};
