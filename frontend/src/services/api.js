import axios from 'axios';

// Load backend API URL from environment variables, fallback to port 5000 in dev
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Create configured Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 360000 // 360s (6 minutes) timeout limit since Playwright crawls search multiple queries sequentially
});

// Automatically inject JWT authorization token from localStorage in request headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


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

/**
 * Triggers and consumes the Server-Sent Events (SSE) competitor enrichment stream.
 * @param {Array<Object>} competitors - Discovered competitors
 * @param {string} sourceQuery - Trigger query
 * @param {Function} onProgress - Progress updates callback
 * @returns {Promise<Array<Object>>} Enriched results
 */
const enrichCompetitorsStream = async (competitors, sourceQuery, onProgress) => {
  try {
    const response = await fetch(`${API_URL}/api/competitors/enrich/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ competitors, sourceQuery }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to initialize competitor enrichment stream.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let finalResults = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop(); // Keep incomplete block in the buffer

      for (const block of blocks) {
        if (!block.trim()) continue;
        const lines = block.split('\n');
        let eventType = 'message';
        let dataStr = '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            dataStr = line.substring(5).trim();
          }
        }

        if (dataStr) {
          try {
            const parsedData = JSON.parse(dataStr);
            if (eventType === 'end') {
              finalResults = parsedData.results || [];
            } else {
              onProgress(parsedData);
            }
          } catch (e) {
            console.error('[SSE Parse Error]:', e);
          }
        }
      }
    }

    return finalResults;

  } catch (error) {
    console.error('Competitor enrichment stream failed:', error.message);
    throw error;
  }
};

/**
 * Fetches all saved competitor profiles.
 * @returns {Promise<Object>} Profiles payload
 */
const getCompetitorProfiles = async () => {
  try {
    const response = await api.get('/competitors/profiles');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch competitor profiles:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch competitor profiles.');
  }
};

/**
 * Fetches a single competitor profile by ID.
 * @param {string} id - The profile ID
 * @returns {Promise<Object>} Profile details payload
 */
const getCompetitorProfileById = async (id) => {
  try {
    const response = await api.get(`/competitors/profiles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch competitor profile ${id}:`, error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch competitor profile.');
  }
};

/**
 * Executes Perplexity AI visibility analysis.
 * @param {Object} coords - Brand, category, location, and optional competitors
 * @returns {Promise<Object>} The queries, visibility breakdown, and debug logs
 */
const runAIVisibility = async (coords) => {
  try {
    const response = await api.post('/ai-visibility/run', coords);
    return response.data;
  } catch (error) {
    console.error('AI visibility analysis scan failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to complete AI visibility analysis.');
  }
};

const apiService = {
  checkBackendHealth,
  discoverCompetitors,
  enrichCompetitorsStream,
  getCompetitorProfiles,
  getCompetitorProfileById,
  runAIVisibility,
  
  // Authentication
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login request failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to authenticate user credentials.');
    }
  },
  signup: async (details) => {
    try {
      const response = await api.post('/auth/signup', details);
      return response.data;
    } catch (error) {
      console.error('Signup request failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to register user.');
    }
  },
  
  // Dashboard
  getDashboardSummary: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve dashboard summary metrics:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard summary.');
    }
  },
  getDashboardHistory: async () => {
    try {
      const response = await api.get('/dashboard/history');
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve dashboard history logs:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch scan history.');
    }
  },
  getDashboardTrends: async (period) => {
    try {
      const response = await api.get(`/dashboard/trends?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve dashboard trends metrics:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch visibility trends.');
    }
  },
  
  // Suggestions
  getSuggestions: async () => {
    try {
      const response = await api.get('/suggestions');
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve suggestions metrics:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch suggestions.');
    }
  },
  getSuggestionsHistory: async () => {
    try {
      const response = await api.get('/suggestions/history');
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve suggestions history logs:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch suggestions history.');
    }
  }
};

export default apiService;

