/**
 * AI Competitor Insight Generator
 * 
 * Coordinates advanced reasoning insights comparing target and competitor profiles.
 * Features:
 * - Deterministic fallback using legacy rule-based engine.
 * - Cache lookup/hashing to prevent redundant API bills.
 * - Sanitized request payload formats sent to Groq.
 */

const { createChatCompletion, GROQ_API_KEY } = require('./groqClient');
const { competitorAnalysisPrompt } = require('./promptTemplates');
const { formatCompetitorInsightResponse } = require('./responseFormatter');
const { generatePayloadHash, getCachedResponse, setCachedResponse } = require('./aiUtils');
const { generateInsights } = require('../competitor-analysis/insightGenerator');

/**
 * Compiles competitive signals and generates rich AI-powered explanations or falls back.
 * @param {Object} target - Target brand profile metrics
 * @param {Object} competitor - Competitor brand profile metrics
 * @param {Object} comparisonProfile - Side-by-side calculated metrics
 * @returns {Promise<Object>} Formatted explanation payload: { reasonsRankedHigher, competitorStrengths, targetWeaknesses, businessSummary, isAiGenerated }
 */
const generateCompetitorInsights = async (target, competitor, comparisonProfile) => {
  // 1. Compile deterministic fallback insights first
  const ruleBasedInsights = generateInsights(comparisonProfile);
  
  const fallbackData = {
    reasonsRankedHigher: ruleBasedInsights,
    competitorStrengths: ['Higher review density', 'Dense local citation presence'],
    targetWeaknesses: ['Light keyword optimization', 'Sub-optimal mention volumes'],
    businessSummary: `Competitor "${competitor.name}" outperforms you in key visibility signals. Refer to specific metric comparison values for exact gaps.`,
    isAiGenerated: false
  };

  // If Groq key is not configured, exit early to fallback directly
  if (!GROQ_API_KEY) {
    console.log(`[AI Competitor Insight Generator]: GROQ_API_KEY not configured. Using rule-based fallback.`);
    return fallbackData;
  }

  // 2. Build cache key based on metrics payload
  const cachePayload = {
    target: {
      name: target.name,
      mentions: target.mentions,
      averagePosition: target.averagePosition,
      rating: target.reviewData?.rating,
      reviewCount: target.reviewData?.reviewCount,
      da: target.authorityData?.domainAuthority
    },
    competitor: {
      name: competitor.name,
      mentions: competitor.mentions,
      averagePosition: competitor.averagePosition,
      rating: competitor.reviewData?.rating,
      reviewCount: competitor.reviewData?.reviewCount,
      da: competitor.authorityData?.domainAuthority
    }
  };

  const hashKey = generatePayloadHash(cachePayload);
  const cached = getCachedResponse(hashKey);

  if (cached) {
    console.log(`[AI Competitor Insight Generator]: Cache HIT for competitor "${competitor.name}".`);
    return { ...cached, isAiGenerated: true };
  }

  // 3. Request LLM completion
  try {
    const systemPrompt = competitorAnalysisPrompt.system;
    const userPrompt = competitorAnalysisPrompt.renderUserPayload(target, competitor, comparisonProfile.metrics);

    const completion = await createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { response_format: { type: 'json_object' } });

    const rawText = completion.choices[0].message.content;
    const formatted = formatCompetitorInsightResponse(rawText, { insights: ruleBasedInsights });

    const finalResponse = {
      ...formatted,
      isAiGenerated: true
    };

    // Save in cache
    setCachedResponse(hashKey, finalResponse);

    return finalResponse;
  } catch (error) {
    console.error(`[AI Competitor Insight Generator Error]: Groq analysis failed. Reverting to rule-based insights.`, error.message);
    return fallbackData;
  }
};

module.exports = {
  generateCompetitorInsights
};
