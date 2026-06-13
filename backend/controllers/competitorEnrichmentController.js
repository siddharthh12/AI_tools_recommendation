/**
 * Competitor Enrichment Controller
 * 
 * Manages HTTP requests and Server-Sent Events (SSE) streaming
 * for bulk competitor intelligence enrichment and profile reads.
 */

const { enrichCompetitors } = require('../enrichment/competitorEnrichmentEngine');
const EnrichmentLogger = require('../enrichment/enrichmentLogger');
const { getAllEnrichedProfiles, getEnrichedProfileById } = require('../services/competitorProfileService');

/**
 * Executes competitor enrichment and streams progress via SSE.
 * POST /api/competitors/enrich/stream
 */
const streamEnrichment = async (req, res, next) => {
  const { competitors, sourceQuery } = req.body;

  if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. Supply a list of competitors in "competitors" array.'
    });
  }

  // 1. Configure SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in proxy servers (like Nginx)
  res.flushHeaders();

  // 2. Initialize logger for this request
  const logger = new EnrichmentLogger();

  // Flag to check if connection is still alive
  let isConnectionAlive = true;

  res.on('close', () => {
    isConnectionAlive = false;
    logger.log('Controller', 'Response stream closed.');
  });

  // Callback to stream update JSON blocks to the frontend
  const sendProgressEvent = (payload) => {
    if (isConnectionAlive) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
    }
  };

  try {
    logger.log('Controller', `Starting streaming enrichment pipeline for ${competitors.length} competitors.`);
    
    // Execute the enrichment workflow
    const results = await enrichCompetitors(
      competitors,
      sourceQuery || 'Google Search Organic / Maps',
      logger,
      sendProgressEvent
    );

    // Send final end event with results payload
    if (isConnectionAlive) {
      logger.log('Controller', 'Enrichment complete. Transmission closed.');
      res.write(`event: end\ndata: ${JSON.stringify({ success: true, results })}\n\n`);
      res.end();
    }

  } catch (error) {
    logger.log('Controller', `Enrichment streaming crashed: ${error.message}`, 'error');
    if (isConnectionAlive) {
      res.write(`event: error\ndata: ${JSON.stringify({ success: false, message: error.message })}\n\n`);
      res.end();
    }
  }
};

/**
 * Retrieves all saved competitor profiles.
 * GET /api/competitors/profiles
 */
const getProfiles = async (req, res, next) => {
  try {
    const profiles = await getAllEnrichedProfiles();
    res.status(200).json({
      success: true,
      profiles
    });
  } catch (error) {
    console.error('[Enrichment Controller Error]: Failed to fetch profiles:', error);
    next(error);
  }
};

/**
 * Retrieves a competitor profile by ID.
 * GET /api/competitors/profiles/:id
 */
const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await getEnrichedProfileById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: `Competitor profile with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error(`[Enrichment Controller Error]: Failed to fetch profile ID ${req.params.id}:`, error);
    next(error);
  }
};

module.exports = {
  streamEnrichment,
  getProfiles,
  getProfileById
};
