/**
 * AI Recommendation Generator
 * 
 * Orchestrates AI-driven business growth suggestions using Groq.
 * Features:
 * - Deterministic fallback utilizing mapping tables.
 * - Local cache matching to control token expenses.
 * - Sanitized request payload formats sent to Groq.
 */

const { createChatCompletion, GROQ_API_KEY } = require('./groqClient');
const { recommendationsPrompt } = require('./promptTemplates');
const { formatRecommendationsResponse } = require('./responseFormatter');
const { generatePayloadHash, getCachedResponse, setCachedResponse } = require('./aiUtils');
const { mapToRecommendations } = require('../recommendations/recommendationMapper');

/**
 * Generates prioritized, highly contextual business recommendations or falls back.
 * @param {Object} target - Target brand profile metrics
 * @param {Array<Object>} weaknesses - List of detected weaknesses: [{ type, severity, value }]
 * @param {Object} overallScore - Deterministic scorecard: { score, breakdown }
 * @returns {Promise<Array<Object>>} List of prioritized recommendations
 */
const generateAiRecommendations = async (target, weaknesses, overallScore) => {
  // 1. Compile deterministic fallback recommendations first
  const ruleBasedRecommendations = mapToRecommendations(weaknesses);
  
  const fallbackList = ruleBasedRecommendations.map(item => ({
    ...item,
    isAiGenerated: false
  }));

  // If Groq key is not configured, exit early to fallback directly
  if (!GROQ_API_KEY) {
    console.log(`[AI Recommendation Generator]: GROQ_API_KEY not configured. Using rule-based fallback.`);
    return fallbackList;
  }

  // 2. Build cache key based on weaknesses and score
  const cachePayload = {
    businessName: target.name,
    score: overallScore.score,
    weaknesses: weaknesses.map(w => ({ type: w.type, severity: w.severity, value: w.value }))
  };

  const hashKey = generatePayloadHash(cachePayload);
  const cached = getCachedResponse(hashKey);

  if (cached && cached.recommendations) {
    console.log(`[AI Recommendation Generator]: Cache HIT for recommendations.`);
    return cached.recommendations.map(item => ({ ...item, isAiGenerated: true }));
  }

  // 3. Request LLM completion
  try {
    const systemPrompt = recommendationsPrompt.system;
    const userPrompt = recommendationsPrompt.renderUserPayload(target, weaknesses, overallScore);

    const completion = await createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { response_format: { type: 'json_object' } });

    const rawText = completion.choices[0].message.content;
    const formatted = formatRecommendationsResponse(rawText, ruleBasedRecommendations);

    const recommendationsWithAiFlag = formatted.recommendations.map(item => ({
      ...item,
      isAiGenerated: true
    }));

    // Save in cache
    setCachedResponse(hashKey, { recommendations: recommendationsWithAiFlag });

    return recommendationsWithAiFlag;
  } catch (error) {
    console.error(`[AI Recommendation Generator Error]: Groq advisory failed. Reverting to rule-based recommendations.`, error.message);
    return fallbackList;
  }
};

module.exports = {
  generateAiRecommendations
};
