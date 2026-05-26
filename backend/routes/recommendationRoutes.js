const express = require('express');
const router = express.Router();
const { runRecommendationGenerator } = require('../controllers/recommendationController');

// Main endpoint to execute automated recommendation crawls
router.post('/generate', runRecommendationGenerator);

module.exports = router;
