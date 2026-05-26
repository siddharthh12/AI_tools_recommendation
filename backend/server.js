/**
 * AI Discoverability Platform Backend Server
 * 
 * Sets up Express framework, hooks up middleware libraries (CORS, JSON Parser, Logger),
 * registers the API router, and starts the server listening on the designated PORT.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');
const queryRoutes = require('./routes/queryRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const competitorRoutes = require('./routes/competitorRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// 1. GLOBAL MIDDLEWARES

// Enable CORS with dynamic settings matching the frontend configuration
app.use(cors({
  origin: config.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parser - permits parsing incoming JSON requests
app.use(express.json());

// Request logging middleware
app.use(logger);

// 2. REGISTER ROUTES
app.use('/api', apiRoutes);
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
app.listen(config.PORT, () => {
  console.log(`=================================================`);
  console.log(`  AI Discoverability Server is active!`);
  console.log(`  Environment : ${config.NODE_ENV}`);
  console.log(`  Port        : ${config.PORT}`);
  console.log(`  Access URL  : http://localhost:${config.PORT}`);
  console.log(`=================================================`);
});
