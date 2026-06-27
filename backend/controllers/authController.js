/**
 * Auth Controller
 * 
 * Handles user signup, login verification, and profile retrieval logic.
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Helper to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '30d' // Token valid for 30 days
  });
};

/**
 * Registers a new user.
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate request inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request. Please provide name, email, and password.'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    // Create user (pre-save hooks handles password hashing)
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to create user. Invalid user data.'
      });
    }

  } catch (error) {
    console.error('[Auth Controller signup Error]:', error.message);
    next(error);
  }
};

/**
 * Logins existing user.
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Lookup user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('[Auth Controller login Error]:', error.message);
    next(error);
  }
};

/**
 * Returns authenticated user profile.
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('[Auth Controller getMe Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to load user profile.'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe
};
