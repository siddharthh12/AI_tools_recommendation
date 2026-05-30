/**
 * Groq AI Client Wrapper
 * 
 * Sets up connection using an OpenAI-compatible axios configuration to call the Groq endpoint.
 * Supports:
 * - Environment variable authentication (GROQ_API_KEY).
 * - Timeout handling (default 12 seconds).
 * - Exponential backoff retry loops (up to 3 retries).
 * - Multi-provider scalability (base URL config).
 */

const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
const RECOMMENDED_MODEL = 'llama-3.3-70b-versatile';

/**
 * Delay execution for a given number of milliseconds.
 * @param {number} ms - Milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Standard chat completion caller with automatic retry & backoff.
 * @param {Array<Object>} messages - OpenAI style chat messages
 * @param {Object} options - Completion parameters (temperature, model, response_format)
 * @param {number} retries - Retry count remaining
 * @param {number} backoffMs - Next retry backoff delay
 * @returns {Promise<Object>} API JSON payload response
 */
const createChatCompletion = async (messages, options = {}, retries = 3, backoffMs = 1000) => {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in the environment variables.');
  }

  const model = options.model || RECOMMENDED_MODEL;
  const temperature = options.temperature !== undefined ? options.temperature : 0.1;
  const responseFormat = options.response_format;

  try {
    console.log(`[Groq Client]: Sending request to ${model}...`);
    const response = await axios({
      method: 'POST',
      url: `${GROQ_BASE_URL}/chat/completions`,
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        model,
        messages,
        temperature,
        ...(responseFormat ? { response_format: responseFormat } : {})
      },
      timeout: 15000 // Strict 15-second timeout to prevent stalling
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data;
    } else {
      throw new Error('Invalid API response format received from Groq.');
    }
  } catch (error) {
    const status = error.response ? error.response.status : null;
    const errorMessage = error.response && error.response.data && error.response.data.error 
      ? error.response.data.error.message 
      : error.message;

    console.error(`[Groq Client Error]: Status ${status} | message: "${errorMessage}"`);

    // Retry on rate limit (429) or server errors (5xx) or timeout
    const isRetryable = status === 429 || (status >= 500 && status <= 599) || error.code === 'ECONNABORTED';

    if (isRetryable && retries > 0) {
      console.warn(`[Groq Client Warning]: Retrying in ${backoffMs}ms... (${retries} retries left)`);
      await delay(backoffMs);
      return createChatCompletion(messages, options, retries - 1, backoffMs * 2);
    }

    throw new Error(`Groq Completion Failed: ${errorMessage}`);
  }
};

module.exports = {
  createChatCompletion,
  RECOMMENDED_MODEL,
  GROQ_API_KEY
};
