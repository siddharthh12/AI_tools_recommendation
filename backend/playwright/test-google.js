/**
 * Playwright Automation Verification Script
 * 
 * This is a clean, simple starter script to verify Playwright works perfectly.
 * It performs three simple actions:
 * 1. Launches a headless Chromium browser instance.
 * 2. Navigates to google.com.
 * 3. Fetches the page title, logs it, and gracefully closes the browser.
 */

const { chromium } = require('playwright');

async function runTest() {
  console.log('[Playwright]: Launching Chromium browser...');
  
  // Launch browser in headless mode (perfect for background server environments)
  const browser = await chromium.launch({ headless: true });
  
  try {
    console.log('[Playwright]: Creating browser context and opening a new page...');
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('[Playwright]: Navigating to Google...');
    // Navigate to Google (waits for standard load state)
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
    
    // Get the page title
    const title = await page.title();
    console.log(`[Playwright]: Successfully loaded page!`);
    console.log(`[Playwright]: Title of page is: "${title}"`);
    
  } catch (error) {
    console.error('[Playwright]: Error encountered during execution:', error);
  } finally {
    console.log('[Playwright]: Closing the browser...');
    await browser.close();
    console.log('[Playwright]: Done!');
  }
}

// Execute the test script
runTest();
