import axios from 'axios';

// Load backend API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Create configured Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000 // 60 seconds requests timeout because Playwright browser crawls take longer
});

/**
 * Validates the connection with Express backend health endpoint.
 * @returns {Promise<Object>} Backend health state
 */
const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return { success: false, message: 'Server is currently unreachable.' };
  }
};

/**
 * Triggers a brand discoverability check on the Express server.
 * @param {Object} scanParams - Business scanning query parameters
 */
const scanBusiness = async (scanParams) => {
  try {
    const response = await api.post('/scan', scanParams);
    return response.data;
  } catch (error) {
    console.error('AI brand discoverability scan failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to complete brand discoverability scan.');
  }
};

/**
 * Phase 2 Core - Triggers automated Perplexity Playwright engine analysis.
 * @param {Object} queryParams - Dynamic parameters
 * @param {string} queryParams.business - Target company brand name
 * @param {string} queryParams.category - Business vertical
 * @param {string} queryParams.city - Geographical city
 * @returns {Promise<Object>} Comprehensive Scraper results & Frequency data
 */
const executeQueryEngine = async (queryParams) => {
  try {
    const response = await api.post('/score/calculate', queryParams);
    return response.data;
  } catch (error) {
    console.error('AI scoring engine calculation failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to complete visibility scoring calculations.');
  }
};


const apiService = {
  checkBackendHealth,
  scanBusiness,
  executeQueryEngine
};

export default apiService;
