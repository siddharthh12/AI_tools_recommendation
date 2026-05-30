/**
 * AI Utilities and Cost Optimization Module
 * 
 * Provides:
 * 1. Simple in-memory cache with eviction/clear capabilities.
 * 2. Deterministic request hashing.
 */

const crypto = require('crypto');

// Simple in-memory storage for AI responses
const responseCache = new Map();

/**
 * Generates a deterministic hash for a given object payload.
 * @param {Object} payload - Structured input data
 * @returns {string} SHA-256 hash string
 */
const generatePayloadHash = (payload) => {
  if (!payload) return '';
  const serialized = JSON.stringify(payload, Object.keys(payload).sort());
  return crypto.createHash('sha256').update(serialized).digest('hex');
};

/**
 * Checks cache for a saved response.
 * @param {string} cacheKey - Hash key
 * @returns {Object|null} Cached response or null
 */
const getCachedResponse = (cacheKey) => {
  if (!cacheKey) return null;
  const entry = responseCache.get(cacheKey);
  if (!entry) return null;

  // Simple TTL check (e.g., cache valid for 1 hour to prevent stale insights in session)
  const ONE_HOUR = 60 * 60 * 1000;
  if (Date.now() - entry.timestamp > ONE_HOUR) {
    responseCache.delete(cacheKey);
    return null;
  }

  return entry.data;
};

/**
 * Saves a response in cache.
 * @param {string} cacheKey - Hash key
 * @param {Object} data - Formatted response object
 */
const setCachedResponse = (cacheKey, data) => {
  if (!cacheKey || !data) return;
  
  // Evict oldest if cache gets too large (simple LRU fallback)
  if (responseCache.size >= 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }

  responseCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

module.exports = {
  generatePayloadHash,
  getCachedResponse,
  setCachedResponse,
  responseCache
};
