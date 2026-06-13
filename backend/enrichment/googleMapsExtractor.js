/**
 * Google Maps Data Extractor
 * 
 * Uses Playwright browser instance to search for a business name and location on Google,
 * and extracts Google rating, review counts, address, phone number, category, and maps links
 * from the Google Business Profile knowledge panel.
 */

const { parseRating, parseReviewCount } = require('./enrichmentUtils');

/**
 * Extracts business profile data from Google Search.
 * @param {Object} page - Playwright page context
 * @param {string} name - Competitor name
 * @param {string} location - Competitor location coordinates
 * @param {EnrichmentLogger} logger - Active enrichment logger
 * @returns {Promise<Object>} Extracted properties
 */
async function extractGoogleMapsData(page, name, location, logger) {
  const query = `${name} ${location}`;
  logger.log('MapsExtractor', `Searching Google Business listing for query: "${query}"`);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
  await page.goto(searchUrl, { waitUntil: 'commit' });

  // Handle Cookie Consent if it appears
  try {
    const consentBtnSelector = 'button#L2AGLb, button:has-text("Accept all"), button:has-text("I agree"), button[aria-label="Accept all"]';
    const consentButton = await page.$(consentBtnSelector);
    if (consentButton) {
      logger.log('MapsExtractor', 'Cookie banner detected. Accepting.');
      await consentButton.click();
      await page.waitForTimeout(1000);
    }
  } catch (err) {
    // Ignored
  }

  // Wait a short duration for main panels to load
  try {
    await page.waitForSelector('div#rhs, div.VkpGBb, div#search, h3', { timeout: 5000 });
  } catch (err) {
    logger.log('MapsExtractor', 'Knowledge elements did not load quickly. Extracting whatever exists.', 'warn');
  }

  // Check if Google CAPTCHA triggered
  const bodyText = await page.innerText('body');
  const hasUnusualTraffic = bodyText.includes('our systems have detected unusual traffic') || 
                            bodyText.includes('robot') || 
                            bodyText.includes('detect robot') ||
                            (await page.$('iframe[src*="recaptcha"]')) !== null ||
                            (await page.$('#captcha-form')) !== null;
  
  if (hasUnusualTraffic) {
    const headless = process.env.SCRAPER_HEADLESS !== 'false';
    if (headless) {
      logger.log('MapsExtractor', 'CAPTCHA verification wall detected in headless mode! Aborting maps extraction query immediately.', 'error');
      throw new Error('Google Maps extraction blocked by CAPTCHA in headless mode.');
    }

    logger.log('MapsExtractor', 'CAPTCHA verification wall detected! SCRAPER IS PAUSED.', 'warn');
    logger.log('MapsExtractor', 'Please switch to the open Chromium window and solve the CAPTCHA challenge manually.', 'warn');
    
    // Wait up to 120 seconds for the user to solve it manually
    const maxWaitTime = 120000; 
    const startTime = Date.now();
    let solved = false;
    
    while (Date.now() - startTime < maxWaitTime) {
      logger.log('MapsExtractor', 'Waiting for manual CAPTCHA completion... (Please solve in browser)', 'info');
      await page.waitForTimeout(3500); // Check every 3.5 seconds
      
      try {
        // Re-evaluate page context to check if search results or h3 headers are visible
        const resultsVisible = await page.evaluate(() => {
          return !!(document.querySelector('div#search') || document.querySelectorAll('h3').length > 1 || document.querySelector('div.VkpGBb'));
        });
        
        if (resultsVisible) {
          logger.log('MapsExtractor', 'CAPTCHA solved! Resuming Google maps extraction...', 'info');
          solved = true;
          break;
        }
      } catch (evaluateError) {
        // Context destroyed indicates page is actively reloading search results. Let's wait for the next loop tick.
        logger.log('MapsExtractor', 'Detecting page redirect and reloading results page context...', 'info');
      }
    }
    
    if (!solved) {
      throw new Error('Google search CAPTCHA solve timed out after 2 minutes.');
    }
  }

  // Evaluate the page context to scrape business panel details
  const rawData = await page.evaluate(() => {
    // Helper to search text across elements
    const findTextNextSibling = (labelText) => {
      const elements = Array.from(document.querySelectorAll('span, div, b, td'));
      for (const el of elements) {
        if (el.innerText && el.innerText.trim().startsWith(labelText)) {
          // If the element has a sibling or contains the text directly
          const text = el.innerText.trim();
          if (text.length > labelText.length) {
            return text.substring(labelText.length).trim().replace(/^:/, '').trim();
          }
          const sibling = el.nextElementSibling || el.parentElement?.nextElementSibling;
          if (sibling) {
            return sibling.innerText.trim();
          }
        }
      }
      return null;
    };

    // 1. Extract Name
    // Knowledge panels often have headings like rhs h2 or large spans
    const nameEl = document.querySelector('div.kp-header h2, div[data-attrid="title"], h2[data-attrid="title"], div.SPZzUd h2 span');
    const nameText = nameEl ? nameEl.innerText.trim() : '';

    // 2. Extract Rating
    let rating = null;
    const ratingEl = document.querySelector('span.Aq14f, div.Ob5HMc span.Aq14f, span.UR1Ycf, [data-attrid="kc:/local:merchant_rating"] span');
    if (ratingEl) {
      rating = ratingEl.innerText.trim();
    } else {
      // Find rating via aria-label of star elements
      const starsEl = document.querySelector('g-review-stars span[aria-label*="out of 5"], span[aria-label*="stars"]');
      if (starsEl) {
        const label = starsEl.getAttribute('aria-label');
        const match = label.match(/(\d(\.\d)?)/);
        if (match) rating = match[0];
      }
    }

    // 3. Extract Review Count
    let reviewCount = null;
    const reviewsEl = document.querySelector('span.z5jxId, span.hqzQzc, a[data-async-trigger="trigger_review_dialog"] span');
    if (reviewsEl) {
      reviewCount = reviewsEl.innerText.trim();
    } else {
      // Text search inside anchors or spans
      const spans = Array.from(document.querySelectorAll('span, a'));
      for (const s of spans) {
        const txt = s.innerText || '';
        if (txt.includes('Google reviews') || txt.includes('Google review')) {
          reviewCount = txt;
          break;
        }
      }
    }

    // 4. Extract Category
    let category = null;
    const catEl = document.querySelector('span.YhemCb, [data-attrid="kc:/local:one_line_summary"], div.kp-header span.FC83fc, div.Z0LcW');
    if (catEl) {
      category = catEl.innerText.trim();
    } else {
      // Try finding category near ratings or under title
      const detailsSub = document.querySelector('div.kp-header div.SPZzUd + div');
      if (detailsSub) {
        category = detailsSub.innerText.trim().split('·')[0].trim();
      }
    }

    // 5. Extract Address
    let address = null;
    const addrEl = document.querySelector('[data-attrid="kc:/local:address"] span.Lrzca, span.Lrzca');
    if (addrEl && (addrEl.innerText.includes(',') || addrEl.innerText.match(/\d+/))) {
      address = addrEl.innerText.trim();
    } else {
      address = findTextNextSibling('Address:');
    }

    // 6. Extract Phone Number
    let phone = null;
    const phoneEl = document.querySelector('[data-attrid="kc:/local:phone"] span.Lrzca, a[href^="tel:"] span, span.Lrzca');
    if (phoneEl && (phoneEl.innerText.startsWith('+') || phoneEl.innerText.match(/^\(?\d{3}\)?/))) {
      phone = phoneEl.innerText.trim();
    } else {
      phone = findTextNextSibling('Phone:');
    }

    // 7. Extract Maps Directions Link
    let googleMapsLink = '';
    const mapsLinkEl = document.querySelector('a[href*="google.com/maps"], a[href*="/maps/place"], [data-attrid="kc:/local:directions"] a');
    if (mapsLinkEl) {
      googleMapsLink = mapsLinkEl.href;
    }

    // 8. Extract Website
    let website = '';
    const webEl = document.querySelector('a[data-attrid="kc:/local:website"], [data-attrid="kc:/local:website"] a');
    if (webEl) {
      website = webEl.href;
    } else {
      // Look for Website button anchor
      const anchors = Array.from(document.querySelectorAll('a'));
      for (const a of anchors) {
        if (a.innerText && a.innerText.trim() === 'Website' && !a.href.includes('google.com')) {
          website = a.href;
          break;
        }
      }
    }

    return {
      name: nameText,
      rating,
      reviewCount,
      category,
      address,
      phone,
      googleMapsLink,
      website
    };
  });

  // Parse strings to correct types using helper utilities
  const parsedRating = parseRating(rawData.rating);
  const parsedReviewCount = parseReviewCount(rawData.reviewCount);

  logger.log('MapsExtractor', `Extracted details: Rating=${parsedRating}, Reviews=${parsedReviewCount}, Category="${rawData.category}", Website="${rawData.website}"`);
  
  // Return extracted details
  return {
    name: rawData.name || name, // Fallback to supplied name if Google heading is not found
    rating: parsedRating,
    reviewCount: parsedReviewCount,
    category: rawData.category || null,
    address: rawData.address || null,
    phone: rawData.phone || null,
    googleMapsLink: rawData.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    website: rawData.website || null
  };
}

module.exports = {
  extractGoogleMapsData
};
