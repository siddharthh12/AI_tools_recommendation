/**
 * Competitor Comparison Module
 * 
 * Aggregates all structural discoverability signals (AI citations, ratings,
 * domain authority, community signals, FAQ structures) for the target business
 * and a competitor into matched, side-by-side comparison structures.
 */

const { analyzeRedditSignals } = require('./redditSignalAnalyzer');
const { analyzeFaqContent } = require('./faqAnalyzer');
const { calculateAuthorityValue } = require('./authorityComparison');

/**
 * Builds a side-by-side comparison profile between target and competitor.
 * @param {Object} target - Target brand compiled records
 * @param {Object} competitor - Competitor brand compiled records
 * @returns {Object} Structured comparison profile
 */
const compareProfiles = (target, competitor) => {
  // 1. Analyze target sub-scores
  const targetReddit = analyzeRedditSignals(target.redditData);
  const targetFaq = analyzeFaqContent(target.faqData);
  const targetAuthScore = calculateAuthorityValue(target.authorityData);

  // 2. Analyze competitor sub-scores
  const compReddit = analyzeRedditSignals(competitor.redditData);
  const compFaq = analyzeFaqContent(competitor.faqData);
  const compAuthScore = calculateAuthorityValue(competitor.authorityData);

  return {
    competitorName: competitor.name,
    metrics: {
      mentions: {
        label: 'AI Search Mentions',
        target: target.mentions || 0,
        competitor: competitor.mentions || 0,
        better: competitor.mentions > target.mentions ? 'competitor' : competitor.mentions < target.mentions ? 'target' : 'draw'
      },
      averagePosition: {
        label: 'Average Citation Rank',
        target: target.averagePosition || 0,
        competitor: competitor.averagePosition || 0,
        // For rank positions, LOWER average position is better (e.g. #1.5 is better than #3.2)
        better: getBetterRank(target.averagePosition, competitor.averagePosition)
      },
      rating: {
        label: 'Google Review Rating',
        target: target.reviewData?.rating || 0,
        competitor: competitor.reviewData?.rating || 0,
        better: (competitor.reviewData?.rating || 0) > (target.reviewData?.rating || 0) ? 'competitor' : (competitor.reviewData?.rating || 0) < (target.reviewData?.rating || 0) ? 'target' : 'draw'
      },
      reviewCount: {
        label: 'Google Reviews Count',
        target: target.reviewData?.reviewCount || 0,
        competitor: competitor.reviewData?.reviewCount || 0,
        better: (competitor.reviewData?.reviewCount || 0) > (target.reviewData?.reviewCount || 0) ? 'competitor' : (competitor.reviewData?.reviewCount || 0) < (target.reviewData?.reviewCount || 0) ? 'target' : 'draw'
      },
      domainAuthority: {
        label: 'Domain Authority',
        target: target.authorityData?.domainAuthority || 0,
        competitor: competitor.authorityData?.domainAuthority || 0,
        better: (competitor.authorityData?.domainAuthority || 0) > (target.authorityData?.domainAuthority || 0) ? 'competitor' : (competitor.authorityData?.domainAuthority || 0) < (target.authorityData?.domainAuthority || 0) ? 'target' : 'draw'
      },
      redditScore: {
        label: 'Reddit Trust Score',
        target: targetReddit.score,
        competitor: compReddit.score,
        better: compReddit.score > targetReddit.score ? 'competitor' : compReddit.score < targetReddit.score ? 'target' : 'draw',
        details: {
          targetMentions: targetReddit.mentions,
          compMentions: compReddit.mentions
        }
      },
      faqScore: {
        label: 'Conversational FAQ Score',
        target: targetFaq.score,
        competitor: compFaq.score,
        better: compFaq.score > targetFaq.score ? 'competitor' : compFaq.score < targetFaq.score ? 'target' : 'draw',
        details: {
          targetCount: targetFaq.faqCount,
          compCount: compFaq.faqCount
        }
      },
      authorityScore: {
        label: 'SEO Authority Score',
        target: targetAuthScore,
        competitor: compAuthScore,
        better: compAuthScore > targetAuthScore ? 'competitor' : compAuthScore < targetAuthScore ? 'target' : 'draw'
      }
    }
  };
};

function getBetterRank(targetRank, compRank) {
  if (!targetRank && !compRank) return 'draw';
  if (!targetRank) return 'competitor';
  if (!compRank) return 'target';
  
  if (compRank < targetRank) return 'competitor';
  if (targetRank < compRank) return 'target';
  return 'draw';
}

module.exports = {
  compareProfiles
};
