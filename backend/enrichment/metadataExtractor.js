/**
 * Metadata Extractor
 * 
 * Extracts business descriptions, summaries, and homepage titles from Google listings
 * and HTML metadata headers.
 */

/**
 * Extracts business description and homepage titles.
 * @param {Object} page - Playwright page context
 * @param {string|null} websiteUrl - Resolved official website URL
 * @param {EnrichmentLogger} logger - Active logger
 * @returns {Promise<Object>} Object containing description and title details
 */
async function extractMetadata(page, websiteUrl, logger) {
  let description = null;
  let homepageTitle = null;

  // 1. Try to extract Google Business Description from Google Search panel (if page is still on Google search results)
  try {
    description = await page.evaluate(() => {
      // Look for merchant description or about snippet
      const merchantDesc = document.querySelector('[data-attrid="kc:/local:merchant_description"] span, div.kno-rscr span');
      if (merchantDesc) return merchantDesc.innerText.trim();

      // Look for custom local summaries
      const oneLineSummary = document.querySelector('[data-attrid="kc:/local:one_line_summary"]');
      if (oneLineSummary) return oneLineSummary.innerText.trim();

      return null;
    });

    if (description) {
      logger.log('MetadataExtractor', `Extracted merchant description from Google Panel: "${description.substring(0, 60)}..."`);
    }
  } catch (err) {
    // Page is not on Google Search results or evaluation failed
  }

  // 2. If website URL is available, navigate to it and extract meta description and title
  if (websiteUrl) {
    logger.log('MetadataExtractor', `Navigating to website to fetch meta details: ${websiteUrl}`);
    try {
      // Set short timeouts to avoid stalling the pipeline on broken website links
      await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
      
      homepageTitle = await page.title();
      
      const siteDescription = await page.evaluate(() => {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && metaDesc.content) return metaDesc.content.trim();

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && ogDesc.content) return ogDesc.content.trim();

        return null;
      });

      if (siteDescription) {
        logger.log('MetadataExtractor', `Discovered website meta description: "${siteDescription.substring(0, 60)}..."`);
        if (!description) {
          description = siteDescription;
        } else {
          // Merge description if different
          description = `${description} | ${siteDescription}`;
        }
      }

      if (homepageTitle) {
        logger.log('MetadataExtractor', `Extracted website title: "${homepageTitle}"`);
        homepageTitle = homepageTitle.trim();
      }
    } catch (err) {
      logger.log('MetadataExtractor', `Failed to crawl website metadata (${err.message}). Using Google snippet fallback.`, 'warn');
    }
  }

  return {
    description: description || 'No description available.',
    homepageTitle: homepageTitle || null
  };
}

module.exports = {
  extractMetadata
};
