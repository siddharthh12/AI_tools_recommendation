const { chromium } = require('playwright');

async function testHeadless() {
  console.log('--- STARTING HEADLESS TEST ---');
  let browser = null;
  try {
    console.log('Launching in headless mode...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const url = 'https://www.google.com/search?q=best+gym+in+vikhroli&hl=en';
    console.log(`Navigating to: ${url}`);
    
    await page.goto(url, { waitUntil: 'commit', timeout: 15000 });
    console.log('Navigation successful!');
    
    console.log('Waiting for search elements...');
    await page.waitForSelector('h3', { timeout: 5000 });
    
    const titles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h3')).map(el => el.innerText.trim()).filter(t => t.length > 0);
    });
    
    console.log(`Successfully scraped ${titles.length} headings!`);
    console.log('Sample headings:', titles.slice(0, 3));
    console.log('--- HEADLESS TEST SUCCESSFUL ---');
  } catch (err) {
    console.error('--- HEADLESS TEST FAILED ---', err.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testHeadless();
