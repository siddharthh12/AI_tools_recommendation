/**
 * Response Formatter and Validator Module
 * 
 * Safely parses, cleans, and structures raw output strings returned by LLMs.
 * Features:
 * - Markdown fence removal (e.g. ```json ... ```)
 * - Leading/trailing conversational junk trimming
 * - Safe JSON parsing with fallback triggers
 * - Schema structure validation
 */

/**
 * Sanitizes a string that contains JSON, removing code fences and whitespace.
 * @param {string} rawString - Raw text from LLM
 * @returns {string} Cleaned string containing only JSON
 */
const sanitizeRawJsonString = (rawString) => {
  if (!rawString) return '';
  
  let cleaned = rawString.trim();
  
  // Remove markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  cleaned = cleaned.trim();
  
  // Extract content between the first '{' and the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned;
};

/**
 * Safe parser for competitor analysis outputs.
 * @param {string} rawResponse - LLM text response
 * @param {Object} fallback - Fallback data compiled from rule-based engine
 * @returns {Object} Validated JSON profile
 */
const formatCompetitorInsightResponse = (rawResponse, fallback = {}) => {
  const fallbackStructure = {
    reasonsRankedHigher: fallback.insights || [],
    competitorStrengths: ['Established brand references', 'Indexed search footprint'],
    targetWeaknesses: ['Sub-optimal review volumes or SEO profiles compared to competitor'],
    businessSummary: 'Competitor outclasses target in overall citation frequency and average search ranking positions.'
  };

  try {
    const cleaned = sanitizeRawJsonString(rawResponse);
    if (!cleaned) return fallbackStructure;

    const parsed = JSON.parse(cleaned);

    return {
      reasonsRankedHigher: Array.isArray(parsed.reasonsRankedHigher) ? parsed.reasonsRankedHigher : fallbackStructure.reasonsRankedHigher,
      competitorStrengths: Array.isArray(parsed.competitorStrengths || parsed.competitorStrengthsList) ? (parsed.competitorStrengths || parsed.competitorStrengthsList) : fallbackStructure.competitorStrengths,
      targetWeaknesses: Array.isArray(parsed.targetWeaknesses || parsed.targetWeaknessesList) ? (parsed.targetWeaknesses || parsed.targetWeaknessesList) : fallbackStructure.targetWeaknesses,
      businessSummary: typeof parsed.businessSummary === 'string' ? parsed.businessSummary : fallbackStructure.businessSummary
    };
  } catch (error) {
    console.error('[Response Formatter Warning]: Failed to parse competitor insights JSON. Triggering fallback.', error.message);
    return fallbackStructure;
  }
};

/**
 * Safe parser for recommendations outputs.
 * @param {string} rawResponse - LLM text response
 * @param {Array<Object>} fallbackList - Fallback list from rule-based engine
 * @returns {Object} Validated JSON recommendations list
 */
const formatRecommendationsResponse = (rawResponse, fallbackList = []) => {
  try {
    const cleaned = sanitizeRawJsonString(rawResponse);
    if (!cleaned) return { recommendations: fallbackList };

    const parsed = JSON.parse(cleaned);
    const recs = parsed.recommendations || parsed;

    if (!Array.isArray(recs)) {
      throw new Error('Recommendations field is not an array.');
    }

    const validated = recs.map((item, idx) => {
      const fbItem = fallbackList[idx] || {};
      return {
        category: typeof item.category === 'string' ? item.category : (fbItem.category || 'General'),
        problem: typeof item.problem === 'string' ? item.problem : (fbItem.problem || 'Discoverability Gap'),
        recommendation: typeof item.recommendation === 'string' ? item.recommendation : (fbItem.recommendation || 'Optimize discoverability footprint'),
        priority: ['HIGH', 'MEDIUM', 'LOW'].includes(String(item.priority).toUpperCase()) ? String(item.priority).toUpperCase() : (fbItem.priority || 'MEDIUM'),
        impact: typeof item.impact === 'string' ? item.impact : (fbItem.impact || 'Improves AI crawling indexing.'),
        insight: typeof item.insight === 'string' ? item.insight : (fbItem.insight || 'Your brand displays discoverability gaps.'),
        actions: Array.isArray(item.actions) ? item.actions : (fbItem.actions || ['Configure search profiles.'])
      };
    });

    return { recommendations: validated };
  } catch (error) {
    console.error('[Response Formatter Warning]: Failed to parse recommendations JSON. Triggering fallback.', error.message);
    return { recommendations: fallbackList };
  }
};

module.exports = {
  sanitizeRawJsonString,
  formatCompetitorInsightResponse,
  formatRecommendationsResponse
};
