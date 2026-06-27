/**
 * Recommendation Database Service
 * 
 * Handles caching checks, resolves competitor comparative metrics,
 * translates numbers into star-rating grids, and maps Completed/Pending tasks.
 */

const Recommendation = require('../models/Recommendation');
const VisibilityHistory = require('../models/VisibilityHistory');
const { getBrandMetrics } = require('../services/mockCompetitorData');
const { generatePlaybook } = require('./recommendationEngine');

/**
 * Converts a numerical score to a comparative star string (e.g. "★★★★").
 * @param {number} value - The parameter value
 * @param {string} type - Metric category: 'rating' | 'authority' | 'visibility'
 * @returns {string} Stars representation
 */
const convertToStars = (value, type) => {
  if (type === 'rating') {
    if (value >= 4.7) return '★★★★★';
    if (value >= 4.4) return '★★★★';
    if (value >= 4.0) return '★★★';
    if (value >= 3.5) return '★★';
    return '★';
  } else if (type === 'authority') {
    if (value >= 70) return '★★★★★';
    if (value >= 55) return '★★★★';
    if (value >= 40) return '★★★';
    if (value >= 30) return '★★';
    return '★';
  } else {
    // Visibility
    if (value >= 80) return '★★★★★';
    if (value >= 60) return '★★★★';
    if (value >= 40) return '★★★';
    if (value >= 20) return '★★';
    return '★';
  }
};

/**
 * Fetches or generates unique suggestions for the user's latest scanned business.
 * @param {string} userId - Auth user ID
 * @returns {Promise<Object>} Suggestions playbook payload
 */
const getOrCreateSuggestions = async (userId) => {
  // 1. Get the user's latest visibility scan log
  const latestScan = await VisibilityHistory.findOne({ userId }).sort({ scanDate: -1 });
  if (!latestScan) {
    throw new Error('No scan history found. Please execute a visibility audit in the Cockpit first.');
  }

  // 2. Caching check: Check if recommendations already exist for this exact scan ID
  const cached = await Recommendation.findOne({ userId, scanId: latestScan._id });
  if (cached) {
    console.log(`[Recommendation Service]: Cache Hit. Reusing playbook for scan "${latestScan._id}"`);
    return cached;
  }

  console.log(`[Recommendation Service]: Cache Miss. Compiling new playbook for scan "${latestScan._id}"`);

  // 3. Resolve quantitative metrics for the target brand
  const targetProfile = {
    name: latestScan.businessName,
    category: latestScan.category,
    location: latestScan.location,
    overallVisibility: latestScan.overallVisibility,
    platforms: latestScan.platforms,
    // Enrich with detailed SEO & FAQ parameters
    ...getBrandMetrics(latestScan.businessName)
  };

  // 4. Resolve details for each discovered competitor
  const competitorMetrics = latestScan.competitors.map(c => {
    return {
      ...c,
      ...getBrandMetrics(c.name)
    };
  });

  // 5. Query user's historical trends logs
  const pastScans = await VisibilityHistory.find({ 
    userId, 
    businessName: latestScan.businessName 
  }).sort({ scanDate: 1 }).limit(10);
  
  const scanHistory = pastScans.map(s => ({
    date: s.scanDate,
    score: s.overallVisibility
  }));

  // 6. Invoke AI Generator Engine (with rules fallback safety)
  const playbook = await generatePlaybook(targetProfile, competitorMetrics, scanHistory);

  // 7. Structure competitor comparative stars grid
  const competitorComparison = [
    {
      name: 'Your Business',
      reviewsRating: convertToStars(targetProfile.reviewData?.rating || 4.0, 'rating'),
      websiteQuality: convertToStars(targetProfile.authorityData?.domainAuthority || 45, 'authority'),
      aiVisibility: convertToStars(targetProfile.overallVisibility || 0, 'visibility')
    }
  ];

  competitorMetrics.forEach(c => {
    competitorComparison.push({
      name: c.name,
      reviewsRating: convertToStars(c.reviewData?.rating || 4.2, 'rating'),
      websiteQuality: convertToStars(c.authorityData?.domainAuthority || 50, 'authority'),
      aiVisibility: convertToStars(c.visibility || 0, 'visibility')
    });
  });

  playbook.competitorComparison = competitorComparison;

  // 8. Lifecycle comparison: Compare against previous recommendations (Completed, Pending, New)
  const prevRec = await Recommendation.findOne({ 
    userId, 
    businessName: latestScan.businessName 
  }).sort({ generatedDate: -1 });

  if (prevRec && prevRec.recommendations) {
    const prevTitles = prevRec.recommendations.map(r => r.title.toLowerCase().trim());
    const newTitles = playbook.recommendations.map(r => r.title.toLowerCase().trim());

    // Mark current items as Pending (unresolved) or New
    playbook.recommendations = playbook.recommendations.map(r => {
      const isPending = prevTitles.includes(r.title.toLowerCase().trim());
      return {
        ...r,
        status: isPending ? 'Pending' : 'New'
      };
    });

    // Capture items that are resolved (exist in prev but not in new)
    prevRec.recommendations.forEach(oldR => {
      const isSolved = !newTitles.includes(oldR.title.toLowerCase().trim());
      if (isSolved && oldR.status !== 'Completed') {
        playbook.recommendations.push({
          title: oldR.title,
          category: oldR.category,
          problem: oldR.problem,
          reason: oldR.reason,
          recommendation: oldR.recommendation,
          priority: oldR.priority,
          expectedImpact: oldR.expectedImpact,
          estimatedDifficulty: oldR.estimatedDifficulty,
          estimatedTime: oldR.estimatedTime,
          status: 'Completed'
        });
      } else if (oldR.status === 'Completed') {
        // Carry forward already completed items
        playbook.recommendations.push({
          title: oldR.title,
          category: oldR.category,
          problem: oldR.problem,
          reason: oldR.reason,
          recommendation: oldR.recommendation,
          priority: oldR.priority,
          expectedImpact: oldR.expectedImpact,
          estimatedDifficulty: oldR.estimatedDifficulty,
          estimatedTime: oldR.estimatedTime,
          status: 'Completed'
        });
      }
    });
  }

  // 9. Save new recommendation record to MongoDB
  const saved = await Recommendation.create({
    userId,
    businessName: latestScan.businessName,
    scanId: latestScan._id,
    summary: playbook.summary,
    overallHealth: playbook.overallHealth,
    recommendations: playbook.recommendations,
    roadmap: playbook.roadmap,
    quickWins: playbook.quickWins,
    longTermImprovements: playbook.longTermImprovements,
    competitorComparison: playbook.competitorComparison,
    expectedImprovements: playbook.expectedImprovements,
    generatedDate: new Date(),
    groqResponse: playbook.groqResponse
  });

  return saved;
};

module.exports = {
  getOrCreateSuggestions
};
