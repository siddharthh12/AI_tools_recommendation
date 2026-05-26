/**
 * Insight Generator Module
 * 
 * The core business value of the platform.
 * Evaluates the competitor comparison metrics, identifies areas where the
 * competitor outperforms the target business, and compiles human-readable,
 * ratio-based explainability statements (e.g., "2.5x more reviews").
 */

/**
 * Evaluates comparative signals and generates human-readable explanations.
 * @param {Object} comparisonProfile - The comparison metrics compiled by compareProfiles
 * @returns {Array<string>} List of insights explaining why the competitor ranked higher
 */
const generateInsights = (comparisonProfile) => {
  if (!comparisonProfile || !comparisonProfile.metrics) {
    return [];
  }

  const { metrics, competitorName } = comparisonProfile;
  const insights = [];

  // 1. EVALUATE AI MENTIONS GATEWAY
  if (metrics.mentions.better === 'competitor') {
    const compMentions = metrics.mentions.competitor;
    const targetMentions = metrics.mentions.target;
    insights.push(
      `Appears more frequently in AI search query responses (${compMentions} vs ${targetMentions} mentions)`
    );
  }

  // 2. EVALUATE CITATION RANK POSITION
  if (metrics.averagePosition.better === 'competitor') {
    const compRank = metrics.averagePosition.competitor;
    const targetRank = metrics.averagePosition.target;
    
    if (targetRank > 0) {
      insights.push(
        `Recommended earlier in AI response directories (average ranking position #${compRank} vs your #${targetRank})`
      );
    } else {
      insights.push(
        `Recommended at average rank position #${compRank}, while your brand remains unlisted`
      );
    }
  }

  // 3. EVALUATE GOOGLE REVIEWS VOLUMES
  if (metrics.reviewCount.better === 'competitor') {
    const compCount = metrics.reviewCount.competitor;
    const targetCount = metrics.reviewCount.target;

    if (targetCount > 0) {
      const ratio = (compCount / targetCount).toFixed(1);
      insights.push(
        `Has ${ratio}x more Google reviews than your business (${compCount} vs ${targetCount} reviews)`
      );
    } else {
      insights.push(
        `Has ${compCount} Google reviews establishing trust, while you have none`
      );
    }
  }

  // 4. EVALUATE REDDIT DISCUSSIONS
  if (metrics.redditScore.better === 'competitor') {
    const compReddit = metrics.redditScore.details.compMentions;
    const targetReddit = metrics.redditScore.details.targetMentions;

    if (compReddit > 0) {
      if (targetReddit > 0) {
        const ratio = (compReddit / targetReddit).toFixed(1);
        insights.push(
          `Stronger community footprint on Reddit forums with ${ratio}x more brand mentions`
        );
      } else {
        insights.push(
          `Mentioned in ${compReddit} active Reddit threads, while you have zero forum citations`
        );
      }
    }
  }

  // 5. EVALUATE FAQ CONVERSATIONAL CONTENT
  if (metrics.faqScore.better === 'competitor') {
    const compFAQ = metrics.faqScore.details.compCount;
    const targetFAQ = metrics.faqScore.details.targetCount;

    if (compFAQ > 0) {
      if (targetFAQ > 0) {
        insights.push(
          `Website contains denser conversational content (${compFAQ} FAQs vs your ${targetFAQ} questions)`
        );
      } else {
        insights.push(
          `Website contains structured conversational FAQ sections, while your homepage lacks Q&A blocks`
        );
      }
    }
  }

  // 6. EVALUATE SEO DOMAIN AUTHORITY
  if (metrics.domainAuthority.better === 'competitor') {
    const compDA = metrics.domainAuthority.competitor;
    const targetDA = metrics.domainAuthority.target;
    insights.push(
      `Stronger organic website authority indices (Domain Authority ${compDA} vs your ${targetDA})`
    );
  }

  // Default fallback if target outperforms in all areas
  if (insights.length === 0) {
    insights.push(
      `Your brand outperforms ${competitorName} in all indexed visibility factors!`
    );
  }

  return insights;
};

module.exports = {
  generateInsights
};
