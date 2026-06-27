/**
 * AI Discoverability Platform Backend Server
 * 
 * Sets up Express framework, hooks up middleware libraries (CORS, JSON Parser, Logger),
 * registers the API router, and starts the server listening on the designated PORT.
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');
const queryRoutes = require('./routes/queryRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const competitorRoutes = require('./routes/competitorRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const suggestionsRoutes = require('./routes/suggestionsRoutes');

// MongoDB / Mongoose connection setup
console.log(`[MongoDB]: Connecting to URI: ${config.MONGO_URI}`);
mongoose.connect(config.MONGO_URI)
  .then(() => console.log('[MongoDB]: Client successfully connected to MongoDB.'))
  .catch(err => console.error('[MongoDB Critical Error]: Connection to MongoDB failed:', err.message));


const app = express();

// 1. GLOBAL MIDDLEWARES

// Enable CORS allowing request origin dynamically to prevent local development port mismatches
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parser - permits parsing incoming JSON requests
app.use(express.json());

// Request logging middleware
app.use(logger);

// 2. REGISTER ROUTES
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/recommendations', recommendationRoutes);








// Root route placeholder message
app.get('/', (req, res) => {
  res.status(200).send('AI Discoverability Platform Backend API is running. Query GET /api/health for system status.');
});

// Fallback for unregistered paths (404 Error handler)
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 3. CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

// 4. LAUNCH ENGINE
const server = app.listen(config.PORT, () => {
  console.log(`=================================================`);
  console.log(`  AI Discoverability Server is active!`);
  console.log(`  Environment : ${config.NODE_ENV}`);
  console.log(`  Port        : ${config.PORT}`);
  console.log(`  Access URL  : http://localhost:${config.PORT}`);
  console.log(`=================================================`);
});

// Set server connection timeout to 6 minutes (360000 ms) to support longer crawler sessions
server.timeout = 360000;
// Reload triggered


// Server triggered reload

