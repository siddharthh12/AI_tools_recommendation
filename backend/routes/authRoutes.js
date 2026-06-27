/**
 * Auth Router
 * 
 * Exposes endpoints for registering new profiles and logging in.
 */

const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/signup', signup);
router.post('/login', login);

// Protected endpoints
router.get('/me', protect, getMe);

module.exports = router;
