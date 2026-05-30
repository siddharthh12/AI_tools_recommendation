const { runGoogleSearch } = require('../search/googleSearchRunner');
const { extractCompetitors } = require('../search/competitorExtractor');
const { cleanCompetitorsData } = require('../search/dataCleaner');
const logger = require('../search/searchLogger');

async function test() {
  logger.reset();
  console.log('--- STARTING SCRAPER TEST RUN ---');
  
  const query = 'best gym in vikhroli';
  console.log(`Executing search for: "${query}"`);
  
  try {
    const rawListings = await runGoogleSearch(query);
    console.log(`Raw listings extracted: ${rawListings.length}`);
    console.log('Sample raw item:', rawListings[0]);
    
    console.log('Extracting competitors...');
    const competitors = extractCompetitors(rawListings, 'Be Strong Gym', 'Gym', 'Vikhroli, Mumbai');
    console.log(`Extracted competitors count: ${competitors.length}`);
    
    console.log('Cleaning and deduplicating competitors...');
    const cleanList = cleanCompetitorsData(competitors, 'Gym', 'Vikhroli, Mumbai');
    console.log('Clean Competitors List:', cleanList);
    
    console.log('--- TEST RUN SUCCESSFUL ---');
  } catch (err) {
    console.error('--- TEST RUN FAILED ---', err);
  }
}

test();
