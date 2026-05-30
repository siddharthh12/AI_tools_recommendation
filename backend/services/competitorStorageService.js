/**
 * Competitor Storage Service
 * 
 * Manages database writes for real competitors discovered during local queries.
 * Attempts to persist records to PostgreSQL/Supabase tables, falling back to a
 * robust local JSON document-store file (`backend/data/competitor_scans.json`)
 * when Supabase configurations are unconfigured placeholders.
 */

const fs = require('fs');
const path = require('path');
const dbModule = require('../../database/connection');

// Resolve supabase instance dynamically to support initial loads
const getSupabaseClient = () => {
  return dbModule.supabase;
};

// Fallback JSON DB file path
const LOCAL_DB_PATH = path.join(__dirname, '../data/competitor_scans.json');

/**
 * Saves real competitor scan records to the active database.
 * @param {Object} scanDetails - Comprehensive scan results
 * @param {string} scanDetails.targetBusiness - Main user business name
 * @param {string} scanDetails.category - Business vertical
 * @param {string} scanDetails.city - Geographical city
 * @param {Array<Object>} scanDetails.competitors - List of discovered competitors
 */
const saveCompetitorScan = async (scanDetails) => {
  const { targetBusiness, category, city, competitors } = scanDetails;

  if (!competitors || competitors.length === 0) {
    console.log('[Storage Service]: No competitors to store.');
    return;
  }

  const timestamp = new Date().toISOString();
  
  // Format competitor listings matching database structure requirements
  const records = competitors.map(comp => ({
    business_name: targetBusiness,
    category: category,
    city: city,
    competitor_name: comp.name,
    website: comp.website || '',
    query_source: 'Google Search Organic / Maps',
    ranking: Math.round(comp.averagePosition) || 1,
    ai_mention_frequency: comp.mentions || 0,
    created_at: timestamp
  }));

  console.log(`[Storage Service]: Storing ${records.length} competitor listings...`);

  const supabase = getSupabaseClient();
  const hasSupabase = supabase && 
                      process.env.SUPABASE_URL && 
                      process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co';

  if (hasSupabase) {
    try {
      console.log('[Storage Service]: Writing to Supabase cloud tables...');
      const { error } = await supabase
        .from('real_competitor_records')
        .insert(records);

      if (error) throw error;
      console.log('[Storage Service]: Saved real competitors to Supabase successfully.');
      return;
    } catch (dbErr) {
      console.warn(`[Storage Service Warning]: Supabase cloud save failed (${dbErr.message}). Reverting to local JSON database persistence.`);
    }
  }

  // Local file storage fallback
  await saveToLocalJson(records);
};

/**
 * Writes records to the local JSON fallback store.
 */
const saveToLocalJson = async (records) => {
  try {
    const parentDir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    let existingData = [];
    if (fs.existsSync(LOCAL_DB_PATH)) {
      try {
        const fileContent = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (parseErr) {
        existingData = [];
      }
    }

    // Attach UUID-like hash values to the entries
    const entriesWithIds = records.map(r => ({
      id: `rc_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-4)}`,
      ...r
    }));

    const mergedData = [...entriesWithIds, ...existingData];
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(mergedData, null, 2), 'utf8');
    
    console.log(`[Storage Service]: Successfully persisted competitor records locally at: ${LOCAL_DB_PATH}`);
  } catch (err) {
    console.error(`[Storage Service Error]: Fallback local save crashed: ${err.message}`);
  }
};

module.exports = {
  saveCompetitorScan
};
