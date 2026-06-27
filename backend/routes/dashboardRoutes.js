/**
 * Dashboard Router
 * 
 * Exposes endpoints for loading summary KPIs, timeline charts, and scan logs.
 */

const express = require('express');
const router = express.Router();
const { 
  getDashboardSummary, 
  getDashboardHistory, 
  getDashboardTrends 
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes require user authentication
router.use(protect);

router.get('/', getDashboardSummary);
router.get('/history', getDashboardHistory);
router.get('/trends', getDashboardTrends);

module.exports = router;
