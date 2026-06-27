/**
 * Groq Client Wrapper
 * 
 * Reuses the central Groq client configuration from the main AI module.
 */

const { createChatCompletion, RECOMMENDED_MODEL } = require('../ai/groqClient');

module.exports = {
  createChatCompletion,
  RECOMMENDED_MODEL
};
