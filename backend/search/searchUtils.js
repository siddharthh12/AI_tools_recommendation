/**
 * Search Utilities Module
 * 
 * Provides shared helper functions for string cleaning, domain extraction,
 * temporary filesystem contexts, and directory cleanups.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

/**
 * Normalizes URL strings to retrieve their core website domain.
 * Example: "https://www.cultfit.com/mumbai/gyms" -> "cultfit.com"
 * @param {string} urlStr - Raw website URL
 * @returns {string} Clean normalized domain or empty string
 */
const getDomainFromUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return '';
  try {
    let cleanUrl = urlStr.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const parsed = new URL(cleanUrl);
    let hostname = parsed.hostname.toLowerCase();
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch (err) {
    return '';
  }
};

/**
 * Sanitizes brand titles extracted from web pages or search listings.
 * Removes descriptors, slogans, markdown markup, and trailing elements.
 * Example: "Gold's Gym Vikhroli - India's Premium Fitness" -> "Gold's Gym Vikhroli"
 * @param {string} rawName - Raw business listing name
 * @returns {string} Cleaned business title
 */
const cleanBusinessName = (rawName) => {
  if (!rawName || typeof rawName !== 'string') return '';
  let cleaned = rawName.trim();
  
  // 1. Remove standard trailing title decorations
  cleaned = cleaned.split(' - ')[0].split(' | ')[0].split(' : ')[0].split(' – ')[0].trim();

  // 2. Remove markdown bolding and asterisks
  cleaned = cleaned.replace(/\*\*/g, '').replace(/\*/g, '');

  // 3. Strip leading and trailing quotes, double spaces, and excess commas
  cleaned = cleaned.replace(/^["'“”`\s,.-]+|["'“”`\s,.-]+$/g, '').trim();

  // 4. Normalize spaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned;
};

/**
 * Generates a unique temporary directory path for storing a Playwright profile context.
 * Prevents concurrency locking on profile directories when scanning multiple queries.
 * @returns {string} Absolute directory path
 */
const getUniqueTempProfilePath = () => {
  const uniqueId = crypto.randomBytes(8).toString('hex');
  return path.join(os.tmpdir(), `playwright-profile-${uniqueId}`);
};

/**
 * Safely removes a temporary directory from the operating system.
 * @param {string} dirPath - Absolute directory path to delete
 */
const safeCleanupDirectory = (dirPath) => {
  if (!dirPath || typeof dirPath !== 'string') return;
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`[Search Utils]: Safely deleted temporary browser context: ${path.basename(dirPath)}`);
    }
  } catch (err) {
    console.warn(`[Search Utils Warning]: Temporary directory delete failed for ${dirPath}: ${err.message}`);
  }
};

module.exports = {
  getDomainFromUrl,
  cleanBusinessName,
  getUniqueTempProfilePath,
  safeCleanupDirectory
};
