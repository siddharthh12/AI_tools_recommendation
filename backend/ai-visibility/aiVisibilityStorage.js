/**
 * AI Visibility Results Storage Service
 * 
 * Manages database operations for individual AI search results.
 * Attempts to persist records to PostgreSQL/Supabase tables, falling back to a
 * local JSON file (`backend/data/ai_visibility_results.json`) when Supabase is unavailable.
 */

const fs = require('fs');
const path = require('path');
const dbModule = require('../../database/connection');

// Resolve supabase instance dynamically to support initial loads
const getSupabaseClient = () => {
  return dbModule.supabase;
};

// Fallback JSON DB file path for visibility results
const LOCAL_VISIBILITY_PATH = path.join(__dirname, '../data/ai_visibility_results.json');

/**
 * Ensures the parent directory for the local JSON file exists.
 */
const ensureLocalDirectory = () => {
  const parentDir = path.dirname(LOCAL_VISIBILITY_PATH);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
};

/**
 * Reads results from the local JSON file.
 * @returns {Array<Object>} List of results
 */
const readLocalResults = () => {
  ensureLocalDirectory();
  if (!fs.existsSync(LOCAL_VISIBILITY_PATH)) {
    return [];
  }
  try {
    const content = fs.readFileSync(LOCAL_VISIBILITY_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Visibility Storage Error]: Failed to parse local visibility results JSON:', err.message);
    return [];
  }
};

/**
 * Writes results to the local JSON file.
 * @param {Array<Object>} results - Results list
 */
const writeLocalResults = (results) => {
  ensureLocalDirectory();
  try {
    fs.writeFileSync(LOCAL_VISIBILITY_PATH, JSON.stringify(results, null, 2), 'utf8');
  } catch (err) {
    console.error('[Visibility Storage Error]: Failed to write local visibility results JSON:', err.message);
  }
};

/**
 * Saves a list of visibility result records to the database.
 * @param {Array<Object>} results - List of result items to store
 * @returns {Promise<Array<Object>>} Saved records
 */
const saveVisibilityResults = async (results) => {
  if (!results || results.length === 0) {
    console.log('[Visibility Storage]: No results to store.');
    return [];
  }

  const timestamp = new Date().toISOString();
  
  // Format details for the database
  const records = results.map(r => ({
    business_name: r.business_name,
    query: r.query,
    platform: r.platform || 'perplexity',
    mentioned: !!r.mentioned,
    position: r.position !== undefined && r.position !== null ? parseInt(r.position, 10) : null,
    response_text: r.response_text || '',
    source_links: r.source_links || [],
    visibility_score: r.visibility_score !== undefined && r.visibility_score !== null ? parseInt(r.visibility_score, 10) : 0,
    created_at: timestamp
  }));

  const supabase = getSupabaseClient();
  const hasSupabase = supabase && 
                      process.env.SUPABASE_URL && 
                      process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co';

  if (hasSupabase) {
    try {
      console.log(`[Visibility Storage]: Attempting to persist ${records.length} records to Supabase...`);
      const { data, error } = await supabase
        .from('ai_visibility_results')
        .insert(records)
        .select();

      if (error) throw error;
      console.log(`[Visibility Storage]: Successfully inserted records in Supabase`);
      return data;
    } catch (dbErr) {
      console.warn(`[Visibility Storage Warning]: Supabase save failed (${dbErr.message}). Reverting to local JSON persistence.`);
    }
  }

  // Fallback local JSON storage
  console.log(`[Visibility Storage]: Persisting ${records.length} records locally at: ${LOCAL_VISIBILITY_PATH}`);
  const localResults = readLocalResults();
  
  const entriesWithIds = records.map(r => ({
    id: `vi_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-4)}`,
    ...r
  }));

  const mergedResults = [...entriesWithIds, ...localResults];
  writeLocalResults(mergedResults);
  
  console.log('[Visibility Storage]: Local persistence complete.');
  return entriesWithIds;
};

/**
 * Fetches all saved visibility results.
 * @returns {Promise<Array<Object>>} List of visibility records
 */
const getAllVisibilityResults = async () => {
  const supabase = getSupabaseClient();
  const hasSupabase = supabase && 
                      process.env.SUPABASE_URL && 
                      process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co';

  if (hasSupabase) {
    try {
      const { data, error } = await supabase
        .from('ai_visibility_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (dbErr) {
      console.warn(`[Visibility Storage Warning]: Supabase read failed (${dbErr.message}). Reverting to local JSON.`);
    }
  }

  return readLocalResults();
};

module.exports = {
  saveVisibilityResults,
  getAllVisibilityResults
};
