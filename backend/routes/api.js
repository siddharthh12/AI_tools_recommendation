const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/healthController');
const { getCompetitors } = require('../controllers/competitorController');
const { runVisibilityAudit } = require('../controllers/aiVisibilityController');
const { protect } = require('../middleware/authMiddleware');

// Health Check Route
router.get('/health', getHealth);

// Real competitor discovery scan route
router.post('/search/competitors', protect, getCompetitors);

// AI Visibility Analysis Engine route
router.post('/ai-visibility/run', protect, runVisibilityAudit);


module.exports = router;
