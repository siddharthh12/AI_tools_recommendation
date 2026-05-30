const { runGoogleSearches } = require('../search/googleSearchRunner');
const logger = require('../search/searchLogger');

async function testSession() {
  logger.reset();
  console.log('--- STARTING OPTIMIZED SESSION CRAWL TEST ---');
  
  const testQueries = [
    'best gym in vikhroli',
    'fitness center near vikhroli'
  ];
  
  console.log(`Executing session search for queries: ${JSON.stringify(testQueries)}`);
  const startTime = Date.now();
  
  try {
    const rawListings = await runGoogleSearches(testQueries);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log(`--- BENCHMARK SUCCESSFUL ---`);
    console.log(`Scraped ${rawListings.length} raw business records.`);
    console.log(`Total execution duration: ${duration} seconds.`);
    console.log('Session log metrics:', logger.getSessionData().logs.map(l => `[${l.component}] ${l.message}`));
  } catch (err) {
    console.error('--- BENCHMARK FAILED ---', err.message);
  }
}

testSession();
