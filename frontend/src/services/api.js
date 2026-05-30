import axios from 'axios';

// Load backend API URL from environment variables, fallback to port 5000 in dev
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Create configured Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000 // 120s timeout limit since Playwright headful crawls search multiple queries sequentially
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
 * Triggers the live Google search competitor discovery scan.
 * @param {Object} searchCoords - The brand, category, and location coordinates
 * @param {string} searchCoords.brand - Brand name
 * @param {string} searchCoords.category - Category vertical
 * @param {string} searchCoords.location - Location string
 * @returns {Promise<Object>} The queries, competitor list, and session logs
 */
const discoverCompetitors = async (searchCoords) => {
  try {
    const response = await api.post('/search/competitors', searchCoords);
    return response.data;
  } catch (error) {
    console.error('Competitor discovery scan failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to complete competitor discovery scan.');
  }
};

const apiService = {
  checkBackendHealth,
  discoverCompetitors
};

export default apiService;
