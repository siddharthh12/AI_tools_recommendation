/**
 * Enrichment Validator
 * 
 * Validates, cleans, and deduplicates competitor profile records.
 */

const { isValidUrl, cleanUrl, parseRating, parseReviewCount } = require('./enrichmentUtils');

/**
 * Validates and cleans a raw enriched competitor profile.
 * @param {Object} rawProfile - Collected details
 * @returns {Object} Sanitized profile
 */
function validateProfile(rawProfile) {
  if (!rawProfile || !rawProfile.name) {
    throw new Error('Validation Error: Competitor profile must have a name.');
  }

  const sanitized = {
    name: rawProfile.name.trim(),
    category: rawProfile.category ? rawProfile.category.trim() : null,
    rating: parseRating(rawProfile.rating),
    reviewCount: parseReviewCount(rawProfile.reviewCount),
    website: isValidUrl(rawProfile.website) ? cleanUrl(rawProfile.website) : null,
    description: rawProfile.description ? rawProfile.description.trim() : null,
    address: rawProfile.address ? rawProfile.address.trim() : null,
    phone: rawProfile.phone ? rawProfile.phone.trim() : null,
    googleMapsLink: isValidUrl(rawProfile.googleMapsLink) ? cleanUrl(rawProfile.googleMapsLink) : null,
    socialLinks: {},
    sourceQuery: rawProfile.sourceQuery ? rawProfile.sourceQuery.trim() : null
  };

  // Validate social media links
  if (rawProfile.socialLinks && typeof rawProfile.socialLinks === 'object') {
    const platforms = ['instagram', 'facebook', 'linkedin', 'youtube', 'twitter', 'x'];
    platforms.forEach(platform => {
      const url = rawProfile.socialLinks[platform];
      if (url && isValidUrl(url)) {
        sanitized.socialLinks[platform] = cleanUrl(url);
      }
    });
  }

  return sanitized;
}

/**
 * Filters out duplicates and invalid profiles from a list of records.
 * @param {Array<Object>} profiles - Raw list of profiles
 * @returns {Array<Object>} Clean, unique list of profiles
 */
function deduplicateProfiles(profiles) {
  if (!Array.isArray(profiles)) return [];

  const unique = [];
  const namesSeen = new Set();
  const websitesSeen = new Set();

  profiles.forEach(profile => {
    try {
      const validated = validateProfile(profile);
      const nameKey = validated.name.toLowerCase().replace(/\s+/g, '');
      
      // Prevent duplicates by name
      if (namesSeen.has(nameKey)) {
        return;
      }

      // Prevent duplicates by website domain (if domain is present)
      if (validated.website) {
        const domainKey = new URL(validated.website).hostname.toLowerCase().replace('www.', '');
        if (websitesSeen.has(domainKey)) {
          return;
        }
        websitesSeen.add(domainKey);
      }

      namesSeen.add(nameKey);
      unique.push(validated);
    } catch (err) {
      console.warn(`[Validator Warning]: Skipped competitor due to validation crash: ${err.message}`);
    }
  });

  return unique;
}

module.exports = {
  validateProfile,
  deduplicateProfiles
};
