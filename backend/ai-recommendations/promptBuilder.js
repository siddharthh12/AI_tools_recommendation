/**
 * Prompt Builder Module
 * 
 * Compiles target business metrics, competitor averages, and historical trend data
 * into a highly structured comparative prompt for the Groq AI engine.
 */

/**
 * Calculates average values for reviews, authority, and FAQs across all competitors.
 * @param {Array<Object>} competitors - Discovered competitors and their stats
 * @returns {Object} Computed average metrics
 */
const calculateAverages = (competitors = []) => {
  if (competitors.length === 0) {
    return {
      reviewCount: 300,
      rating: 4.4,
      domainAuthority: 40,
      faqCount: 3,
      redditMentions: 5
    };
  }

  let totalReviews = 0;
  let totalRating = 0;
  let totalDa = 0;
  let totalFaq = 0;
  let totalReddit = 0;

  competitors.forEach(c => {
    totalReviews += c.reviewData?.reviewCount || 0;
    totalRating += c.reviewData?.rating || 0;
    totalDa += c.authorityData?.domainAuthority || 0;
    totalFaq += c.faqData?.faqCount || 0;
    totalReddit += c.redditData?.mentions || 0;
  });

  const count = competitors.length;
  return {
    reviewCount: Math.round(totalReviews / count),
    rating: parseFloat((totalRating / count).toFixed(1)),
    domainAuthority: Math.round(totalDa / count),
    faqCount: Math.round(totalFaq / count),
    redditMentions: Math.round(totalReddit / count)
  };
};

/**
 * Builds the prompt messages array for Groq Chat Completion.
 * @param {Object} targetProfile - Quantitative metrics of target business
 * @param {Array<Object>} competitorMetrics - List of competitor profiles
 * @param {Array<Object>} scanHistory - Historical scores of target business
 * @returns {Array<Object>} Messages array (system and user prompts)
 */
const buildPrompt = (targetProfile, competitorMetrics = [], scanHistory = []) => {
  const competitorAverages = calculateAverages(competitorMetrics);

  // Format historical trend
  const trendText = scanHistory.length > 0
    ? scanHistory.map(s => `- Date: ${new Date(s.scanDate || s.date).toLocaleDateString('en-US')}, Score: ${s.overallVisibility || s.score}%`).join('\n')
    : '- Date: Today, Score: ' + (targetProfile.overallVisibility || 0) + '%';

  // Format competitor list for comparison
  const competitorsText = competitorMetrics.map(c => {
    return `- Brand: ${c.name}
  * Rating: ${c.reviewData?.rating || 'N/A'} stars (${c.reviewData?.reviewCount || 0} reviews)
  * Website DA: ${c.authorityData?.domainAuthority || 'N/A'} (SSL: ${c.authorityData?.sslEnabled ? 'Yes' : 'No'})
  * FAQ Count: ${c.faqData?.faqCount || 0} (Uses Schema: ${c.faqData?.usesSchema ? 'Yes' : 'No'})
  * Reddit Citations: ${c.redditData?.mentions || 0} mentions`;
  }).join('\n');

  const systemInstructions = `You are a professional AI Discoverability Consultant specializing in local search optimization (AEO - Answer Engine Optimization).
Your task is to analyze the provided quantitative metrics for the business and compile a customized optimization audit playbook.

CRITICAL INSTRUCTIONS:
1. Use ONLY the provided business and competitor metrics. Do NOT invent, assume, or extrapolate details not present in the data.
2. Focus on improving organic discoverability and AI search citation rates. Do NOT recommend paid advertising or campaigns (such as Google Ads, Facebook Ads).
3. Explain recommendations in simple business language, translating technical values (e.g. low website Domain Authority) into plain-English business consequences.
4. Categorize each recommendation strictly under one of these categories: "Reviews", "Website", "Content", "Community", "Reddit", "Google Business", "FAQ", "Social Media", "Local SEO", "Business Information", "Authority", "AI Visibility", "Brand Mentions".
5. Return ONLY a valid JSON object matching the requested schema. No conversation, no markdown wrappers (such as \`\`\`json), just raw JSON.

JSON SCHEMA STRUCTURE REQUIRED:
{
  "summary": "High-level summary of business visibility state, strengths, and weaknesses (2-3 sentences).",
  "overallHealth": "Poor" | "Fair" | "Good" | "Excellent",
  "recommendations": [
    {
      "title": "A short, actionable title",
      "category": "Reviews" | "Website" | "Content" | "Community" | "Reddit" | "Google Business" | "FAQ" | "Social Media" | "Local SEO" | "Business Information" | "Authority" | "AI Visibility" | "Brand Mentions",
      "problem": "Specific metric gap (e.g., Competitors have 6x more reviews.)",
      "reason": "Technical explanation of why AI search crawlers care about this (e.g., AI trust signals...)",
      "recommendation": "Step-by-step actionable advice for the business owner",
      "priority": "High" | "Medium" | "Low",
      "expectedImpact": "High" | "Medium" | "Low",
      "estimatedDifficulty": "Easy" | "Medium" | "Hard",
      "estimatedTime": "e.g., 2-4 weeks or 1-2 months"
    }
  ],
  "roadmap": [
    { "week": "Week 1", "task": "Actionable task title" },
    { "week": "Week 2", "task": "Actionable task title" },
    { "week": "Week 3", "task": "Actionable task title" },
    { "week": "Week 4", "task": "Actionable task title" },
    { "week": "Week 5", "task": "Actionable task title" },
    { "week": "Week 6", "task": "Actionable task title" }
  ],
  "expectedImprovements": {
    "chatgpt": { "current": Number, "target": Number },
    "gemini": { "current": Number, "target": Number },
    "perplexity": { "current": Number, "target": Number }
  }
}`;

  const userContext = `Please analyze the discoverability metrics for my business:

BUSINESS PROFILES:
- Target Business Name: ${targetProfile.name}
- Category: ${targetProfile.category}
- Location: ${targetProfile.location}

VISIBILITY TELEMETRY:
- Overall AI Visibility: ${targetProfile.overallVisibility || 0}%
- Platform Breakdown:
  * ChatGPT: ${targetProfile.platforms?.chatgpt || 0}%
  * Gemini: ${targetProfile.platforms?.gemini || 0}%
  * Perplexity: ${targetProfile.platforms?.perplexity || 0}%

BUSINESS REVIEWS:
- Business Rating: ${targetProfile.reviewData?.rating || 'N/A'} stars
- Competitor Rating Average: ${competitorAverages.rating} stars
- Business Reviews Count: ${targetProfile.reviewData?.reviewCount || 0} reviews
- Competitor Reviews Count Average: ${competitorAverages.reviewCount} reviews

BUSINESS WEBSITE & SEO:
- Domain Authority: ${targetProfile.authorityData?.domainAuthority || 0}
- Competitor Domain Authority Average: ${competitorAverages.domainAuthority}
- Has Target Keywords: ${targetProfile.authorityData?.hasKeywords ? 'Yes' : 'No'}
- SSL Enabled: ${targetProfile.authorityData?.sslEnabled ? 'Yes' : 'No'}

FAQ & STRUCTURED SCHEMA:
- Has FAQ Page: ${targetProfile.faqData?.hasFaqPage ? 'Yes' : 'No'}
- FAQ Questions Count: ${targetProfile.faqData?.faqCount || 0}
- Competitor FAQ Count Average: ${competitorAverages.faqCount}
- Uses FAQ Schema: ${targetProfile.faqData?.usesSchema ? 'Yes' : 'No'}

COMMUNITY DISCUSSION & CITATIONS:
- Reddit Mentions Count: ${targetProfile.redditData?.mentions || 0} mentions
- Competitor Reddit Mentions Average: ${competitorAverages.redditMentions} mentions

HISTORICAL SCAN TRENDS:
${trendText}

COMPETITOR LANDSCAPE DETAILS:
${competitorsText}

Compile the JSON recommendations profile now.`;

  return [
    { role: 'system', content: systemInstructions },
    { role: 'user', content: userContext }
  ];
};

module.exports = {
  buildPrompt,
  calculateAverages
};
