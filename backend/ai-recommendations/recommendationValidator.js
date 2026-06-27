/**
 * Recommendation Validator Module
 * 
 * Verifies that the AI engine response adheres to the expected structural shape,
 * filling in defaults/placeholders if any required properties are missing.
 */

/**
 * Validates the schema of the generated recommendation payload.
 * @param {Object} rawData - Parsed JSON object from Groq response
 * @returns {Object} Validated, sanitized recommendations profile
 */
const validateRecommendations = (rawData) => {
  const data = rawData || {};

  // 1. Verify top level parameters
  const summary = typeof data.summary === 'string' ? data.summary.trim() : 'No summary provided by the advisor.';
  
  let overallHealth = 'Fair';
  if (['Poor', 'Fair', 'Good', 'Excellent'].includes(data.overallHealth)) {
    overallHealth = data.overallHealth;
  }

  // 2. Validate individual recommendations list
  const rawRecs = Array.isArray(data.recommendations) ? data.recommendations : [];
  const recommendations = rawRecs.map((r, index) => {
    const title = typeof r.title === 'string' ? r.title.trim() : `Optimization Item #${index + 1}`;
    const category = typeof r.category === 'string' ? r.category.trim() : 'Local SEO';
    const problem = typeof r.problem === 'string' ? r.problem.trim() : 'Discoverability performance gap detected.';
    const reason = typeof r.reason === 'string' ? r.reason.trim() : 'Search engines prioritize brands with optimal signals.';
    const recText = typeof r.recommendation === 'string' ? r.recommendation.trim() : 'Update your business profile listing.';
    
    let priority = 'Medium';
    if (['High', 'Medium', 'Low'].includes(r.priority)) {
      priority = r.priority;
    }
    
    let expectedImpact = 'Medium';
    if (['High', 'Medium', 'Low'].includes(r.expectedImpact)) {
      expectedImpact = r.expectedImpact;
    }
    
    let estimatedDifficulty = 'Medium';
    if (['Easy', 'Medium', 'Hard'].includes(r.estimatedDifficulty)) {
      estimatedDifficulty = r.estimatedDifficulty;
    }
    
    const estimatedTime = typeof r.estimatedTime === 'string' ? r.estimatedTime.trim() : '2-4 weeks';

    return {
      title,
      category,
      problem,
      reason,
      recommendation: recText,
      priority,
      expectedImpact,
      estimatedDifficulty,
      estimatedTime,
      status: 'New'
    };
  });

  // 3. Validate roadmap timeline items
  const rawRoadmap = Array.isArray(data.roadmap) ? data.roadmap : [];
  const roadmap = rawRoadmap.map((step, index) => {
    const week = typeof step.week === 'string' ? step.week.trim() : `Week ${index + 1}`;
    const task = typeof step.task === 'string' ? step.task.trim() : 'Perform discoverability audit check';
    return { week, task };
  });

  // Fallback: If roadmap is empty, populate 6 standard weeks
  if (roadmap.length === 0) {
    const defaultTasks = [
      'Optimize Google Business Profile specifications',
      'Launch Google review collection requests',
      'Publish detailed site FAQ page & sitemaps',
      'Participate in relevant Reddit local community threads',
      'Audit site speed and landing keyword alignments',
      'Re-scan AI Visibility rankings to track growth metrics'
    ];
    for (let i = 0; i < 6; i++) {
      roadmap.push({
        week: `Week ${i + 1}`,
        task: defaultTasks[i]
      });
    }
  }

  // 4. Validate expected improvements
  const defaultProgress = { current: 0, target: 5 };
  const rawImprovements = data.expectedImprovements || {};
  const expectedImprovements = {
    chatgpt: {
      current: typeof rawImprovements.chatgpt?.current === 'number' ? rawImprovements.chatgpt.current : 0,
      target: typeof rawImprovements.chatgpt?.target === 'number' ? rawImprovements.chatgpt.target : 10
    },
    gemini: {
      current: typeof rawImprovements.gemini?.current === 'number' ? rawImprovements.gemini.current : 0,
      target: typeof rawImprovements.gemini?.target === 'number' ? rawImprovements.gemini.target : 10
    },
    perplexity: {
      current: typeof rawImprovements.perplexity?.current === 'number' ? rawImprovements.perplexity.current : 0,
      target: typeof rawImprovements.perplexity?.target === 'number' ? rawImprovements.perplexity.target : 10
    }
  };

  return {
    summary,
    overallHealth,
    recommendations,
    roadmap,
    expectedImprovements
  };
};

module.exports = {
  validateRecommendations
};
