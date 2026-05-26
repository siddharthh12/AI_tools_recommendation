const express = require('express');
const router = express.Router();
const { calculateVisibilityScore } = require('../controllers/scoreController');

// Main endpoint to compute dynamic visibility score breakdowns
router.post('/calculate', calculateVisibilityScore);

module.exports = router;
