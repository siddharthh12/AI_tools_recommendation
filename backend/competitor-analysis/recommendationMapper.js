/**
 * Recommendation Mapper Module
 * 
 * Takes specific brand discoverability weaknesses (where the competitor beats you)
 * and maps them directly to concrete, actionable local search and reputation
 * marketing optimization tasks.
 */

/**
 * Maps competitor comparison gaps to actionable task suggestions.
 * @param {Object} comparisonProfile - The comparison metrics compiled by compareProfiles
 * @returns {Array<string>} Actionable task recommendations list
 */
const mapRecommendations = (comparisonProfile) => {
  if (!comparisonProfile || !comparisonProfile.metrics) {
    return [];
  }

  const { metrics, competitorName } = comparisonProfile;
  const recommendations = [];

  // 1. Map AI Mentions weakness
  if (metrics.mentions.better === 'competitor') {
    recommendations.push(
      `Acquire references in local directory listings and business catalog profiles where ${competitorName} is cited to bridge discoverability index gaps.`
    );
  }

  // 2. Map Rank Position weakness
  if (metrics.averagePosition.better === 'competitor') {
    recommendations.push(
      'Integrate clean JSON-LD LocalBusiness and Organization schema structured markup on your site pages to raise your catalog rank position.'
    );
  }

  // 3. Map Review Count weakness
  if (metrics.reviewCount.better === 'competitor') {
    recommendations.push(
      `Deploy automated post-service text invite campaigns targeting your customers to match ${competitorName}'s Google review citations volume.`
    );
  }

  // 4. Map Reddit footprint weakness
  if (metrics.redditScore.better === 'competitor') {
    recommendations.push(
      'Promote organic mentions inside localized subreddit discussions by sharing helpful user answers and catalog reviews.'
    );
  }

  // 5. Map FAQ conversational content weakness
  if (metrics.faqScore.better === 'competitor') {
    recommendations.push(
      'Add a dedicated Q&A block on your website answering common buyer search queries and incorporate conversational FAQPage JSON-LD schemas.'
    );
  }

  // 6. Map Domain Authority weakness
  if (metrics.domainAuthority.better === 'competitor') {
    recommendations.push(
      `Acquire domain backlinks from respected industry blogs and high-authority local catalogs to boost Domain Authority above #${metrics.domainAuthority.competitor}.`
    );
  }

  // Default suggestions if target is winning everything
  if (recommendations.length === 0) {
    recommendations.push(
      'Keep monitoring query variations weekly and update structured schemas to defend your top visibility spot.'
    );
  }

  return recommendations;
};

module.exports = {
  mapRecommendations
};
