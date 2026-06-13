const express = require('express');
const router = express.Router();
const { runCompetitorAnalysis } = require('../controllers/competitorController');
const { streamEnrichment, getProfiles, getProfileById } = require('../controllers/competitorEnrichmentController');

// Main endpoint to execute automated competitor discoverability scans
router.post('/analyze', runCompetitorAnalysis);

// Enrichment stream and profiles endpoints
router.post('/enrich/stream', streamEnrichment);
router.get('/profiles', getProfiles);
router.get('/profiles/:id', getProfileById);

module.exports = router;
