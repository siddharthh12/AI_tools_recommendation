/**
 * Suggestions Router
 * 
 * Exposes API routes for fetching dynamic, data-driven optimization playbooks.
 */

const express = require('express');
const router = express.Router();
const { getSuggestions, getSuggestionsHistory } = require('../controllers/suggestionsController');
const { protect } = require('../middleware/authMiddleware');

// All routes require user authentication
router.use(protect);

router.get('/', getSuggestions);
router.get('/history', getSuggestionsHistory);

module.exports = router;
