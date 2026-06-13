/**
 * Competitor Profile Storage Service
 * 
 * Manages database reads and writes for enriched competitor profiles.
 * Attempts to persist records to PostgreSQL/Supabase tables, falling back to a
 * robust local JSON document-store file (`backend/data/competitor_profiles.json`)
 * when Supabase configurations are unconfigured placeholders.
 */

const fs = require('fs');
const path = require('path');
const dbModule = require('../../database/connection');

// Resolve supabase instance dynamically to support initial loads
const getSupabaseClient = () => {
  return dbModule.supabase;
};

// Fallback JSON DB file path for competitor profiles
const LOCAL_PROFILES_PATH = path.join(__dirname, '../data/competitor_profiles.json');

/**
 * Ensures the parent directory for the local JSON file exists.
 */
const ensureLocalDirectory = () => {
  const parentDir = path.dirname(LOCAL_PROFILES_PATH);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
};

/**
 * Reads profiles from the local JSON file.
 * @returns {Array<Object>} List of profiles
 */
const readLocalProfiles = () => {
  ensureLocalDirectory();
  if (!fs.existsSync(LOCAL_PROFILES_PATH)) {
    return [];
  }
  try {
    const content = fs.readFileSync(LOCAL_PROFILES_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[Profile Storage Error]: Failed to parse local profiles JSON:', err.message);
    return [];
  }
};

/**
 * Writes profiles to the local JSON file.
 * @param {Array<Object>} profiles - Profiles list
 */
const writeLocalProfiles = (profiles) => {
  ensureLocalDirectory();
  try {
    fs.writeFileSync(LOCAL_PROFILES_PATH, JSON.stringify(profiles, null, 2), 'utf8');
  } catch (err) {
    console.error('[Profile Storage Error]: Failed to write local profiles JSON:', err.message);
  }
};

/**
 * Saves or updates a single competitor profile.
 * @param {Object} profile - Enriched competitor profile details
 * @returns {Promise<Object>} The saved profile
 */
const saveEnrichedProfile = async (profile) => {
  const supabase = getSupabaseClient();
  const hasSupabase = supabase && 
                      process.env.SUPABASE_URL && 
                      process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co';

  const timestamp = new Date().toISOString();
  
  // Format details for the database
  const record = {
    name: profile.name,
    category: profile.category || null,
    rating: profile.rating !== undefined && profile.rating !== null ? parseFloat(profile.rating) : null,
    review_count: profile.reviewCount !== undefined && profile.reviewCount !== null ? parseInt(profile.reviewCount, 10) : null,
    website: profile.website || null,
    description: profile.description || null,
    address: profile.address || null,
    phone: profile.phone || null,
    google_maps_link: profile.googleMapsLink || null,
    social_links: profile.socialLinks || {},
    source_query: profile.sourceQuery || null,
    updated_at: timestamp
  };

  if (hasSupabase) {
    try {
      console.log(`[Profile Storage]: Attempting to persist "${profile.name}" to Supabase...`);
      
      // Check if entry already exists by name (case-insensitive)
      const { data: existing, error: findError } = await supabase
        .from('competitor_profiles')
        .select('id')
        .ilike('name', profile.name.trim())
        .limit(1);

      if (findError) throw findError;

      if (existing && existing.length > 0) {
        // Update existing record
        const recordId = existing[0].id;
        const { data: updated, error: updateError } = await supabase
          .from('competitor_profiles')
          .update(record)
          .eq('id', recordId)
          .select();

        if (updateError) throw updateError;
        console.log(`[Profile Storage]: Successfully updated profile in Supabase (ID: ${recordId})`);
        return updated[0];
      } else {
        // Insert new record
        const newRecord = { ...record, created_at: timestamp };
        const { data: inserted, error: insertError } = await supabase
          .from('competitor_profiles')
          .insert([newRecord])
          .select();

        if (insertError) throw insertError;
        console.log(`[Profile Storage]: Successfully inserted new profile in Supabase`);
        return inserted[0];
      }
    } catch (dbErr) {
      console.warn(`[Profile Storage Warning]: Supabase save failed (${dbErr.message}). Reverting to local JSON persistence.`);
    }
  }

  // Fallback local JSON storage
  console.log(`[Profile Storage]: Persisting "${profile.name}" locally...`);
  const localProfiles = readLocalProfiles();
  const existingIndex = localProfiles.findIndex(
    p => p.name.toLowerCase().trim() === profile.name.toLowerCase().trim()
  );

  let savedRecord;
  if (existingIndex >= 0) {
    // Merge updates
    savedRecord = {
      ...localProfiles[existingIndex],
      ...record,
      updated_at: timestamp
    };
    localProfiles[existingIndex] = savedRecord;
    console.log(`[Profile Storage]: Updated local profile entry (ID: ${savedRecord.id})`);
  } else {
    // Create new profile with mock UUID/hash ID
    savedRecord = {
      id: `rc_enrich_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString().slice(-4)}`,
      ...record,
      created_at: timestamp
    };
    localProfiles.unshift(savedRecord);
    console.log(`[Profile Storage]: Created new local profile entry (ID: ${savedRecord.id})`);
  }

  writeLocalProfiles(localProfiles);
  return savedRecord;
};

/**
 * Fetches all enriched profiles.
 * @returns {Promise<Array<Object>>} List of competitor profiles
 */
const getAllEnrichedProfiles = async () => {
  const supabase = getSupabaseClient();
  const hasSupabase = supabase && 
                      process.env.SUPABASE_URL && 
                      process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co';

  if (hasSupabase) {
    try {
      const { data, error } = await supabase
        .from('competitor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (dbErr) {
      console.warn(`[Profile Storage Warning]: Supabase read failed (${dbErr.message}). Reverting to local JSON.`);
    }
  }

  return readLocalProfiles();
};

/**
 * Fetches a single competitor profile by ID.
 * @param {string} id - UUID or custom mock ID
 * @returns {Promise<Object|null>} The competitor profile details
 */
const getEnrichedProfileById = async (id) => {
  const supabase = getSupabaseClient();
  const hasSupabase = supabase && 
                      process.env.SUPABASE_URL && 
                      process.env.SUPABASE_URL !== 'https://your-supabase-project.supabase.co';

  if (hasSupabase) {
    try {
      const { data, error } = await supabase
        .from('competitor_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    } catch (dbErr) {
      console.warn(`[Profile Storage Warning]: Supabase select by ID failed (${dbErr.message}). Reverting to local JSON.`);
    }
  }

  const localProfiles = readLocalProfiles();
  return localProfiles.find(p => p.id === id) || null;
};

module.exports = {
  saveEnrichedProfile,
  getAllEnrichedProfiles,
  getEnrichedProfileById
};
