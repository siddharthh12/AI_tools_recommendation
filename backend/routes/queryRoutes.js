const express = require('express');
const router = express.Router();
const { runQueryEngine } = require('../controllers/queryController');

// Main endpoint to execute automated AI Query runs
router.post('/run', runQueryEngine);

module.exports = router;
