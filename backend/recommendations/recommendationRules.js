/**
 * Recommendation Rules Dictionary
 * 
 * Central dictionary mapping detected search weakness keys to category groupings,
 * business problem titles, base recommendations, and expected discoverability impact.
 * Keeps rules centrally editable and scalable.
 */

const recommendationRules = {
  LOW_MENTIONS: {
    category: 'AI Visibility',
    problem: 'Low AI Citations',
    recommendation: 'Expand Brand citation footprints in directories',
    impact: 'AI search crawlers require dense directory references to discover, trust, and cite your brand.'
  },
  POOR_RANKING: {
    category: 'AI Visibility',
    problem: 'Sub-optimal AI Recommendation Ranks',
    recommendation: 'Optimize semantic content keywords tags positioning',
    impact: 'High impact on ranking early. Conversational search models prioritize brands matching exact query tags.'
  },
  FEW_REVIEWS: {
    category: 'Reviews',
    problem: 'Fewer Google Reviews volume',
    recommendation: 'Boost local review citations count',
    impact: 'Citations volume indicates reliability. Crawlers aggregate review counts to verify business legitimacy.'
  },
  LOW_RATING: {
    category: 'Reviews',
    problem: 'Low Reviews Star Rating',
    recommendation: 'Enhance Google review rating quality',
    impact: 'Critical filter. AI engines active-penalize local business options carrying sub-optimal rating scores.'
  },
  MISSING_FAQ: {
    category: 'FAQs',
    problem: 'Missing Conversational Q&A Content',
    recommendation: 'Incorporate structured FAQ sections in site markup',
    impact: 'Direct indexing. Structured questions and answers allow semantic indexers to parse precise facts.'
  },
  WEAK_AUTHORITY: {
    category: 'SEO',
    problem: 'Sub-optimal Website Authority',
    recommendation: 'Acquire niche-relevant backlink referrals',
    impact: 'SEO Domain Authority scales domain ranking trusts and website discoverability indices.'
  },
  WEAK_COMMUNITY_SIGNALS: {
    category: 'Community Signals',
    problem: 'Light Reddit Forum Footprint',
    recommendation: 'Cultivate organic community mentions',
    impact: 'AI engines like Gemini and SearchGPT actively sweep Reddit threads to gauge organic customer trust.'
  }
};

module.exports = recommendationRules;
