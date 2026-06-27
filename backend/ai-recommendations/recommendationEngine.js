/**
 * Recommendation Engine Orchestrator
 * 
 * Manages the generation lifecycle: builds prompts, calls Groq, parses response schemas,
 * runs validation checks, and applies fallback rule-based suggestions if API errors arise.
 */

const { buildPrompt } = require('./promptBuilder');
const { createChatCompletion, RECOMMENDED_MODEL } = require('./groqClient');
const { parseResponse } = require('./responseParser');
const { validateRecommendations } = require('./recommendationValidator');
const { sortRecommendations } = require('./priorityCalculator');
const { planImprovements } = require('./improvementPlanner');
const { detectWeaknesses } = require('../recommendations/weaknessDetector');

/**
 * Deterministic rule-based fallback when Groq client fails or is unconfigured.
 * @param {Object} targetProfile - Target business profile
 * @param {Array<Object>} competitors - Competitors list
 * @returns {Object} Validated recommendation schema
 */
const generateDeterministicFallback = (targetProfile, competitors = []) => {
  console.warn('[Recommendation Engine]: Invoking deterministic rule-based fallback engine.');

  const weaknesses = detectWeaknesses(targetProfile);
  const recommendations = [];

  // Map identified weakness types to structured recommendations
  weaknesses.forEach(w => {
    if (w.type === 'FEW_REVIEWS' || w.type === 'LOW_RATING') {
      recommendations.push({
        title: 'Increase Google Reviews Velocity',
        category: 'Reviews',
        problem: `Your reviews count (${targetProfile.reviewData?.reviewCount || 0}) is below target thresholds.`,
        reason: 'AI search engine scrapers trust brands with high reviews velocity and positive customer engagement signals.',
        recommendation: 'Create table tents with review QR codes and send automated post-visit email review requests.',
        priority: w.severity === 'HIGH' ? 'High' : 'Medium',
        expectedImpact: 'High',
        estimatedDifficulty: 'Easy',
        estimatedTime: '2-4 weeks',
        status: 'New'
      });
    } else if (w.type === 'WEAK_AUTHORITY') {
      recommendations.push({
        title: 'Enhance Website SEO Authority',
        category: 'Authority',
        problem: `Website Domain Authority (${targetProfile.authorityData?.domainAuthority || 0}) is low.`,
        reason: 'Search engines and LLMs use domain authority scores to assess brand relevance and establish citation trust.',
        recommendation: 'Partner with local directories, optimize sitemaps, and secure local backlink citations.',
        priority: 'High',
        expectedImpact: 'High',
        estimatedDifficulty: 'Hard',
        estimatedTime: '1-2 months',
        status: 'New'
      });
    } else if (w.type === 'MISSING_FAQ') {
      recommendations.push({
        title: 'Publish Dedicated Schema FAQs',
        category: 'FAQ',
        problem: 'Your site lacks structured FAQPage schema codes for conversational indexing.',
        reason: 'Conversational LLMs crawl specific question-answer code blocks to answer user queries directly.',
        recommendation: 'Write an organic /faqs page answering top client questions, and embed JSON-LD FAQ Schema headers.',
        priority: 'Medium',
        expectedImpact: 'Medium',
        estimatedDifficulty: 'Easy',
        estimatedTime: '1-2 weeks',
        status: 'New'
      });
    } else if (w.type === 'WEAK_COMMUNITY_SIGNALS') {
      recommendations.push({
        title: 'Boost Reddit Community Mentions',
        category: 'Reddit',
        problem: 'Zero active organic discussions citing your business on Reddit threads.',
        reason: 'Perplexity and ChatGPT scrape real discussions on Reddit to find organic recommendations.',
        recommendation: 'Monitor regional subreddits for recommendation requests, and engage in discussions naturally.',
        priority: 'Medium',
        expectedImpact: 'Medium',
        estimatedDifficulty: 'Medium',
        estimatedTime: '3-4 weeks',
        status: 'New'
      });
    }
  });

  // Ensure we have at least 2 recommendations
  if (recommendations.length < 2) {
    recommendations.push({
      title: 'Align Main Header Keywords',
      category: 'Local SEO',
      problem: 'Website heading tags are not aligned with local category keywords.',
      reason: 'AI search bots check page header titles to resolve category relevancy.',
      recommendation: 'Ensure your H1 tag contains your business category and location name clearly.',
      priority: 'Low',
      expectedImpact: 'Medium',
      estimatedDifficulty: 'Easy',
      estimatedTime: '1 week',
      status: 'New'
    });
  }

  // Generate dynamic week roadmap
  const roadmap = recommendations.map((r, i) => ({
    week: `Week ${i + 1}`,
    task: `Implement task: ${r.title}`
  }));
  
  // Fill roadmap to 6 weeks
  const standardRoadmap = [
    'Optimize Google Business details',
    'Launch review collection campaigns',
    'Publish Q&A structured faq schema page',
    'Engage on Reddit local discussions',
    'Optimize technical speed & SSL redirects',
    'Re-run visibility scan to audit growth'
  ];
  for (let i = roadmap.length; i < 6; i++) {
    roadmap.push({
      week: `Week ${i + 1}`,
      task: standardRoadmap[i]
    });
  }

  // Expected visibility targets
  const currentChat = targetProfile.platforms?.chatgpt || 0;
  const currentGem = targetProfile.platforms?.gemini || 0;
  const currentPerp = targetProfile.platforms?.perplexity || 0;

  const expectedImprovements = {
    chatgpt: { current: currentChat, target: Math.min(100, currentChat + 20) },
    gemini: { current: currentGem, target: Math.min(100, currentGem + 22) },
    perplexity: { current: currentPerp, target: Math.min(100, currentPerp + 18) }
  };

  return {
    summary: `Your business health has been evaluated as ${weaknesses.length > 3 ? 'Poor' : 'Fair'}. Key discoverability gaps exist in online authority and community citation signals.`,
    overallHealth: weaknesses.length > 4 ? 'Poor' : weaknesses.length > 2 ? 'Fair' : 'Good',
    recommendations,
    roadmap,
    expectedImprovements
  };
};

/**
 * Coordinates prompt assembly and AI query tasks.
 * @param {Object} targetProfile - Business profiles metrics
 * @param {Array<Object>} competitorMetrics - Competitors lists
 * @param {Array<Object>} scanHistory - Historical trends
 * @returns {Promise<Object>} Formatted recommendations playbook
 */
const generatePlaybook = async (targetProfile, competitorMetrics = [], scanHistory = []) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_actual_groq_api_key_here') {
    return generateDeterministicFallback(targetProfile, competitorMetrics);
  }

  try {
    const messages = buildPrompt(targetProfile, competitorMetrics, scanHistory);
    
    // Call Groq completion
    const rawResult = await createChatCompletion(messages, {
      model: RECOMMENDED_MODEL,
      response_format: { type: 'json_object' }
    });

    const completionText = rawResult.choices[0].message.content;
    const parsed = parseResponse(completionText);

    if (!parsed) {
      throw new Error('Groq returned a malformed response that could not be parsed.');
    }

    // Validate and clean JSON properties
    const validated = validateRecommendations(parsed);

    // Sort by priority (High -> Medium -> Low)
    validated.recommendations = sortRecommendations(validated.recommendations);

    // Group Quick Wins vs. Long Term tasks
    const { quickWins, longTermImprovements } = planImprovements(validated.recommendations);
    validated.quickWins = quickWins;
    validated.longTermImprovements = longTermImprovements;

    validated.groqResponse = rawResult;
    return validated;

  } catch (error) {
    console.error('[Recommendation Engine Error]: Failed to generate AI playbook via Groq:', error.message);
    
    // Fallback to rules generator
    const fallback = generateDeterministicFallback(targetProfile, competitorMetrics);
    const { quickWins, longTermImprovements } = planImprovements(fallback.recommendations);
    fallback.quickWins = quickWins;
    fallback.longTermImprovements = longTermImprovements;
    return fallback;
  }
};

module.exports = {
  generatePlaybook,
  generateDeterministicFallback
};
