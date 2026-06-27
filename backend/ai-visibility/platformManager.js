/**
 * Platform Manager Abstraction
 * 
 * Provides a single unified interface to query different AI search platforms.
 * Handles Perplexity, ChatGPT, and Gemini, routing execution to their respective runners.
 * Supports future extensibility (e.g., Claude, Grok, DeepSeek).
 */

const { runPerplexity, closeBrowserSession: closePerplexity } = require('./perplexityRunner');
const { runChatGPT, closeBrowserSession: closeChatGPT } = require('./chatgptRunner');
const { runGemini, closeBrowserSession: closeGemini } = require('./geminiRunner');

/**
 * Runs a query on the designated AI platform.
 * @param {string} platform - The AI search platform (perplexity, chatgpt, gemini)
 * @param {string} query - The search query/prompt
 * @param {string} targetBusiness - The target business name
 * @param {string} category - Business vertical/category
 * @param {string} city - Location city/region
 * @param {Array<string>} competitors - Competitors list
 * @param {Function} logCallback - Activity logging callback
 * @returns {Promise<Object>} Crawler execution results
 */
async function runPlatformQuery(
  platform,
  query,
  targetBusiness,
  category,
  city,
  competitors = [],
  logCallback = console.log
) {
  const platKey = (platform || '').toLowerCase().trim();
  
  logCallback(`[Platform Manager]: Routing query for "${platKey}"...`);

  switch (platKey) {
    case 'perplexity':
      return await runPerplexity(query, targetBusiness, category, city, competitors, logCallback);
    case 'chatgpt':
      return await runChatGPT(query, targetBusiness, category, city, competitors, logCallback);
    case 'gemini':
      return await runGemini(query, targetBusiness, category, city, competitors, logCallback);
    default:
      throw new Error(`Unsupported AI platform: "${platform}"`);
  }
}

/**
 * Gracefully shuts down all active browser sessions.
 */
async function closeAllBrowserSessions() {
  console.log('[Platform Manager]: Closing all active browser sessions...');
  await Promise.allSettled([
    closePerplexity(),
    closeChatGPT(),
    closeGemini()
  ]);
}

module.exports = {
  runPlatformQuery,
  closeAllBrowserSessions
};
