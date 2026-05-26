const express = require('express');
const router = express.Router();
const { runCompetitorAnalysis } = require('../controllers/competitorController');

// Main endpoint to execute automated competitor discoverability scans
router.post('/analyze', runCompetitorAnalysis);

module.exports = router;
