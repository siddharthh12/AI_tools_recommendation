/**
 * Social Link Extractor
 * 
 * Scans a business's homepage for verified links to social media networks:
 * Facebook, Instagram, LinkedIn, YouTube, X/Twitter.
 */

/**
 * Extracts social media URLs from the active page.
 * @param {Object} page - Playwright page context
 * @param {EnrichmentLogger} logger - Active logger
 * @returns {Promise<Object>} Dictionary of social links found
 */
async function extractSocialLinks(page, logger) {
  logger.log('SocialExtractor', 'Scanning homepage anchor tags for social profiles...');

  try {
    const socialLinks = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const socials = {};

      anchors.forEach(a => {
        const href = (a.href || '').trim();
        if (!href) return;

        // Instagram
        if (/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+/i.test(href)) {
          // Exclude generic platform links
          if (!href.includes('/p/') && !href.includes('/explore/') && !href.includes('/developer')) {
            socials.instagram = href;
          }
        }
        // Facebook
        else if (/https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_.]+/i.test(href)) {
          if (!href.includes('/sharer') && !href.includes('/plugins') && !href.includes('/policies')) {
            socials.facebook = href;
          }
        }
        // LinkedIn
        else if (/https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9_-]+/i.test(href)) {
          socials.linkedin = href;
        }
        // YouTube
        else if (/https?:\/\/(www\.)?(youtube\.com\/(@|channel|user)\/[a-zA-Z0-9_-]+|youtu\.be\/)/i.test(href)) {
          socials.youtube = href;
        }
        // Twitter / X
        else if (/https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_-]+/i.test(href)) {
          if (!href.includes('/share') && !href.includes('/intent') && !href.includes('/privacy')) {
            socials.twitter = href;
          }
        }
      });

      return socials;
    });

    const foundList = Object.keys(socialLinks);
    if (foundList.length > 0) {
      logger.log('SocialExtractor', `Discovered ${foundList.length} social profiles: ${JSON.stringify(socialLinks)}`);
    } else {
      logger.log('SocialExtractor', 'No social profiles detected on homepage.');
    }

    return socialLinks;

  } catch (err) {
    logger.log('SocialExtractor', `Failed to scrape page links: ${err.message}`, 'warn');
    return {};
  }
}

module.exports = {
  extractSocialLinks
};
