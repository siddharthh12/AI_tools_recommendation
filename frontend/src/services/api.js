import axios from 'axios';

// Load backend API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Create configured Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000 // 15 seconds request timeout
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
 * @param {string} scanParams.businessName - Brand name to audit
 * @param {string} scanParams.industry - Industry vertical
 * @param {string} scanParams.competitors - List of competitor names (comma separated)
 * @returns {Promise<Object>} Discoverability report indices
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

const apiService = {
  checkBackendHealth,
  scanBusiness
};

export default apiService;
