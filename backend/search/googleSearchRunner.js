/**
 * Google Search Scraper Runner (Playwright Chromium)
 * 
 * Automates real Google search crawls in headful/headless mode for visible debugging:
 * 1. Launches Playwright Chromium with headless state toggled by SCRAPER_HEADLESS.
 * 2. Opens Google Search and inputs the query.
 * 3. Handles any cookie consent overlay automatically.
 * 4. Extracts organic results and Local Map Business Pack details (Name, Address, Website, Maps Link).
 * 5. Handles CAPTCHAs, timeouts, and empty states cleanly.
 */

const { chromium } = require('playwright');
const logger = require('./searchLogger');

// In-memory cache for search results
// Maps query -> { timestamp: number, results: Array }
const queryCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Active search promise mapping for deduplication of parallel crawls of the same queries
// Maps query -> Promise<Array>
const activeSearchPromises = new Map();

// Sequential queue for scraper executions to avoid concurrent browser launches
let scraperQueue = Promise.resolve();

/**
 * Runs a real Google Search crawl session for multiple queries sequentially using a SINGLE browser context.
 * This completely avoids browser cold-start launch overhead and takes advantage of browser state caching.
 * @param {Array<string>} queries - List of search query strings to crawl
 * @returns {Promise<Array<Object>>} List of all raw competitor listings extracted across all queries
 */
const runGoogleSearches = async (queries) => {
  if (!queries || !Array.isArray(queries) || queries.length === 0) {
    return [];
  }

  const uncachedQueries = [];
  const cachedResults = [];

  // 1. Resolve cached queries first to minimize scraping overhead
  for (const query of queries) {
    const cleanQuery = query.trim().toLowerCase();
    if (queryCache.has(cleanQuery)) {
      const cached = queryCache.get(cleanQuery);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        logger.log('Cache', `Returning cached results for query: "${query}"`);
        cachedResults.push(...cached.results);
        continue;
      } else {
        queryCache.delete(cleanQuery); // Expired cache entry
      }
    }
    uncachedQueries.push(query);
  }

  // If all queries were successfully retrieved from cache, return them immediately
  if (uncachedQueries.length === 0) {
    return cachedResults;
  }

  logger.log('Browser', `Initializing Chromium browser session for ${uncachedQueries.length} query/queries (Resolved ${queries.length - uncachedQueries.length} queries from cache).`);
  logger.setBrowserStatus('launching');

  const headless = process.env.SCRAPER_HEADLESS !== 'false';
  let browser = null;
  let context = null;
  const newResults = [];

  try {
    // Launch browser in headless/headful mode with slowMo delay for visible debugging
    browser = await chromium.launch({
      headless: headless,
      slowMo: headless ? 0 : 150
    });

    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      locale: 'en-US',
      timezoneId: 'Asia/Kolkata'
    });

    const page = await context.newPage();
    page.setDefaultTimeout(45000); // 45s timeout limit per-query for robust handling

    // Loop through the uncached queries in the same browser session
    for (let i = 0; i < uncachedQueries.length; i++) {
      const query = uncachedQueries[i];
      logger.setBrowserStatus('searching');
      logger.log('Browser', `Crawling query (${i + 1}/${uncachedQueries.length}): "${query}"`);

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
      logger.log('Browser', `Navigating to search URL: ${searchUrl}`);

      await page.goto(searchUrl, { waitUntil: 'commit' });

      // Handle Google Cookie Consent / Accept All Dialog if it blocks the screen (only on first navigation)
      if (i === 0) {
        try {
          const consentBtnSelector = 'button#L2AGLb, button:has-text("Accept all"), button:has-text("I agree"), button[aria-label="Accept all"]';
          const consentButton = await page.waitForSelector(consentBtnSelector, { timeout: 2500 });
          if (consentButton) {
            logger.log('Browser', 'Google Cookie Consent overlay detected. Clicking Accept All.');
            await consentButton.click();
            await page.waitForTimeout(1000); // Pause for reload
          }
        } catch (err) {
          // Cookie banner is not present, proceed
        }
      }

      // Check if Google blocked us with a CAPTCHA
      const bodyText = await page.innerText('body');
      const hasUnusualTraffic = bodyText.includes('our systems have detected unusual traffic') || 
                                bodyText.includes('robot') || 
                                bodyText.includes('detect robot') ||
                                (await page.$('iframe[src*="recaptcha"]')) !== null ||
                                (await page.$('#captcha-form')) !== null;
      
      if (hasUnusualTraffic) {
        if (headless) {
          logger.log('Browser', 'CAPTCHA verification wall detected in headless mode! Aborting search query immediately.', 'error');
          throw new Error('Google search blocked by CAPTCHA in headless mode.');
        }

        logger.log('Browser', 'CAPTCHA verification wall detected! SCRAPER IS PAUSED.', 'warn');
        logger.log('Browser', 'Please switch to the open Chromium window and solve the CAPTCHA challenge manually.', 'warn');
        
        // Wait up to 120 seconds for the user to solve it manually
        const maxWaitTime = 120000; 
        const startTime = Date.now();
        let solved = false;
        
        while (Date.now() - startTime < maxWaitTime) {
          logger.log('Browser', 'Waiting for manual CAPTCHA completion... (Please solve in browser)', 'info');
          await page.waitForTimeout(3500); // Check every 3.5 seconds
          
          try {
            // Re-evaluate page context to check if search results or h3 headers are visible
            const resultsVisible = await page.evaluate(() => {
              return !!(document.querySelector('div#search') || document.querySelectorAll('h3').length > 1 || document.querySelector('div.VkpGBb'));
            });
            
            if (resultsVisible) {
              logger.log('Browser', 'CAPTCHA solved! Resuming Google search extraction...', 'info');
              solved = true;
              break;
            }
          } catch (evaluateError) {
            // Context destroyed indicates page is actively reloading search results. Let's wait for the next loop tick.
            logger.log('Browser', 'Detecting page redirect and reloading results page context...', 'info');
          }
        }
        
        if (!solved) {
          throw new Error('Google search CAPTCHA solve timed out after 2 minutes.');
        }
      }

      // Wait for search result indicators
      logger.log('Browser', 'Waiting for search elements to load...');
      try {
        await page.waitForSelector('div#search, h3, div#rcnt, div.VkpGBb', { timeout: 4000 });
      } catch (waitErr) {
        logger.log('Browser', 'Main search selectors did not render in 4s. Scanning whatever is available.', 'warn');
      }

      logger.setBrowserStatus('extracting');
      logger.log('Browser', `Parsing Google Search results page for query: "${query}"`);

      // Evaluate selectors on the page to collect real business items
      const queryResults = await page.evaluate((queryStr) => {
        const results = [];

        // 1. Scrape Local Business Pack (Maps listings on Search results page)
        // Classic local pack cards container: 'div.VkpGBb'
        const localCards = document.querySelectorAll('div.VkpGBb');
        localCards.forEach((card, idx) => {
          // Business name
          const titleEl = card.querySelector('div[role="heading"], div.dbg0pd, span.OSrXXb, div.rllt__title');
          const name = titleEl ? titleEl.innerText.trim() : '';

          // Extract website button or hyperlink
          let website = '';
          const websiteLink = card.querySelector('a[href^="http"]:not([href*="google.com"])');
          if (websiteLink) {
            website = websiteLink.href;
          }

          // Extract snippet info (reviews count, phone, location address, category)
          const detailsEl = card.querySelector('div.rllt__details, div.wDYx1c');
          let detailsText = detailsEl ? detailsEl.innerText.trim() : '';
          
          // Maps location/address snippet (usually looks like 'Gym · Vikhroli West' or contains address details)
          let location = '';
          let snippet = 'Real local physical business listing discovered inside Google Maps Local Pack.';
          
          if (detailsText) {
            snippet = detailsText.replace(/\n/g, ' | ');
            // Guess location from details text (split by '·' or take the last parts)
            const parts = detailsText.split('·').map(p => p.trim());
            if (parts.length > 1) {
              location = parts[1].split('|')[0].trim();
            }
          }

          // Get Google Maps direction link
          let mapsLink = '';
          const mapsAnchor = card.querySelector('a[href*="google.com/maps"]');
          if (mapsAnchor) {
            mapsLink = mapsAnchor.href;
          }

          if (name && name.length > 2) {
            results.push({
              name,
              website,
              location: location || 'Vikhroli, Mumbai',
              mapsLink,
              snippet,
              sourceQuery: queryStr,
              position: idx + 1,
              isLocalPack: true
            });
          }
        });

        // 2. Scrape Organic Search Results
        const organicBlocks = document.querySelectorAll('div.g, div.tF23ub');
        organicBlocks.forEach((block, idx) => {
          const titleEl = block.querySelector('h3');
          if (!titleEl) return;

          const name = titleEl.innerText.trim();

          // Extract hyperlink
          const linkEl = block.querySelector('a');
          const website = linkEl ? linkEl.href : '';

          // Extract organic description snippet
          const snippetEl = block.querySelector('div.VwiC3b, span.aCOpbc');
          const snippet = snippetEl ? snippetEl.innerText.trim() : 'Real organic search listing discovered on Google Search.';

          // Maps link (usually empty for generic organic results unless it matches location)
          const mapsLink = '';
          const location = '';

          if (name && name.length > 2 && website && !website.includes('google.com')) {
            // Prevent duplicates with Local Pack entries
            const isDuplicate = results.some(r => r.name.toLowerCase() === name.toLowerCase() || (website && r.website === website));
            if (!isDuplicate) {
              results.push({
                name,
                website,
                location: location || 'Vikhroli, Mumbai',
                mapsLink,
                snippet,
                sourceQuery: queryStr,
                position: results.length + 1,
                isLocalPack: false
              });
            }
          }
        });

        return results;
      }, query);

      // Cache the result for this specific query
      queryCache.set(query.trim().toLowerCase(), {
        timestamp: Date.now(),
        results: queryResults
      });

      logger.incrementExtraction(queryResults.length);
      logger.log('Browser', `Query "${query}" crawl complete. Found ${queryResults.length} raw listings.`);
      newResults.push(...queryResults);

      // Early-exit check: If we have gathered enough raw listings across both cached and new results,
      // stop the crawl loop early to save execution time and prevent Google blocks
      const totalCollected = cachedResults.length + newResults.length;
      if (totalCollected >= 15 && i < uncachedQueries.length - 1) {
        logger.log('Browser', `Collected ${totalCollected} listings. Stopping search loop early to optimize execution.`);
        break;
      }

      // Add a standard organic human pause between consecutive searches in the same session
      if (i < uncachedQueries.length - 1) {
        logger.log('Browser', 'Pausing to mimic natural human search delay...');
        await page.waitForTimeout(1500);
      }
    }

    logger.setBrowserStatus('closing');
    return [...cachedResults, ...newResults];

  } catch (error) {
    logger.log('Browser', `Scrape session failed: ${error.message}`, 'error');
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        // Ignored
      }
    }
    logger.setBrowserStatus('done');
  }
};

/**
 * Compatibility wrapper running a single search query in a single browser context.
 * Utilizes a sequential execution queue and promise deduplication to prevent concurrent browser launches.
 * @param {string} query - Google search query string
 * @returns {Promise<Array<Object>>} Extracted search results
 */
const runGoogleSearch = async (query) => {
  const cleanQuery = query.trim().toLowerCase();

  // 1. Check in-memory cache first
  if (queryCache.has(cleanQuery)) {
    const cached = queryCache.get(cleanQuery);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      logger.log('Cache', `Returning cached results for query: "${query}"`);
      return cached.results;
    } else {
      queryCache.delete(cleanQuery);
    }
  }

  // 2. Check for an active search promise for the exact same query (deduplication)
  if (activeSearchPromises.has(cleanQuery)) {
    logger.log('Cache', `Joining existing active search promise for query: "${query}"`);
    return activeSearchPromises.get(cleanQuery);
  }

  // 3. Queue the scraper execution to prevent concurrent browser launches
  const scrapeTask = (async () => {
    // Wait for the previous queued search to finish
    await scraperQueue;

    // Check cache again in case a prior queue item resolved this query
    if (queryCache.has(cleanQuery)) {
      const cached = queryCache.get(cleanQuery);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.results;
      }
    }

    try {
      return await runGoogleSearches([query]);
    } finally {
      activeSearchPromises.delete(cleanQuery);
    }
  })();

  // Chain the queue
  scraperQueue = scrapeTask.catch(() => {});
  activeSearchPromises.set(cleanQuery, scrapeTask);

  return scrapeTask;
};

module.exports = {
  runGoogleSearch,
  runGoogleSearches
};
