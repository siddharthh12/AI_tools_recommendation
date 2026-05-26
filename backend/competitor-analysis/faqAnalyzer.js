/**
 * FAQ & Conversational Content Analyzer
 * 
 * Scores how conversational a brand's website content is.
 * Conversational question-answer blocks help LLMs semantic indexers index details.
 * 
 * Heuristic Awards:
 * 1. Has FAQ page/section = +40 points
 * 2. Total Question Count (worth up to 30 points) = min(30, count * 3)
 * 3. Uses JSON-LD FAQPage Schema markup = +30 points
 */

const normalize = require('../scoring/normalizeScore');

/**
 * Heuristically scores site conversational content signals.
 * @param {Object} faqData - Site conversational logs
 * @param {boolean} faqData.hasFaqPage - True if dedicated FAQ exists
 * @param {number} faqData.faqCount - Total Q&A pairs (0 - 15)
 * @param {boolean} faqData.usesSchema - True if FAQ schema detected in site code
 * @returns {Object} Scorecard: { score: 85, usesSchema: true, faqCount: 8 }
 */
const analyzeFaqContent = (faqData) => {
  if (!faqData) {
    return { score: 0, usesSchema: false, faqCount: 0 };
  }

  const { hasFaqPage = false, faqCount = 0, usesSchema = false } = faqData;

  let rawScore = 0;

  if (hasFaqPage) {
    rawScore += 40; // Base presence points
    rawScore += Math.min(30, faqCount * 3); // Max 30 points for count density
    if (usesSchema) {
      rawScore += 30; // Max 30 points for structured schema
    }
  }

  return {
    score: normalize(rawScore),
    usesSchema,
    faqCount
  };
};

module.exports = {
  analyzeFaqContent
};
