const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/healthController');
const { getCompetitors } = require('../controllers/competitorController');

// Health Check Route
router.get('/health', getHealth);

// Real competitor discovery scan route
router.post('/search/competitors', getCompetitors);

module.exports = router;
