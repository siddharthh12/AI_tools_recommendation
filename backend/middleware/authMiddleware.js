/**
 * Auth Middleware
 * 
 * Intercepts requests, validates incoming JWT tokens in the Authorization headers,
 * and attaches user profile details to the request object.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for header authorization token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. Decode and verify JWT token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // 3. Resolve user details from database and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user profile not found.'
        });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware Error]: Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed.'
      });
    }
  }

  // 4. Return unauthorized if token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no verification token supplied.'
    });
  }
};

module.exports = { protect };
