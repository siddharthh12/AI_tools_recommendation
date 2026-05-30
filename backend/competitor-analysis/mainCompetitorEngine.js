/**
 * Main Competitor Analysis Engine
 * 
 * Orchestrates the competitor comparative workflow:
 * 1. Coordinates target business metrics with competitor metrics.
 * 2. Triggers comparison calculations for each competitor.
 * 3. Generates human-readable explanations detailing why competitors rank higher.
 * 4. Compiles dynamic, actionable suggestions to bypass them.
 */

const { compareProfiles } = require('./competitorComparison');
const { generateInsights } = require('./insightGenerator');
const { mapRecommendations } = require('./recommendationMapper');
const { generateCompetitorInsights } = require('../ai/competitorInsightGenerator');

/**
 * Executes a full competitor discoverability audit.
 * @param {Object} target - Target business parameters
 * @param {Array<Object>} competitorsList - List of competitor variables
 * @returns {Promise<Array<Object>>} Comprehensive comparison reports for each competitor
 */
const analyzeCompetitors = async (target, competitorsList) => {
  if (!target || !competitorsList || !Array.isArray(competitorsList)) {
    return [];
  }

  return Promise.all(
    competitorsList.map(async (competitor) => {
      // 1. Run comparative metrics pairings
      const comparisonProfile = compareProfiles(target, competitor);

      // 2. Generate explainable insights via AI (falls back automatically to rules)
      const aiInsights = await generateCompetitorInsights(target, competitor, comparisonProfile);

      // 3. Translate gaps into actionable suggestions (deterministic fallback/tasks)
      const tasks = mapRecommendations(comparisonProfile);

      return {
        name: competitor.name,
        mentions: competitor.mentions,
        averagePosition: competitor.averagePosition,
        comparison: comparisonProfile.metrics,
        reasonsRankedHigher: aiInsights.reasonsRankedHigher,
        competitorStrengths: aiInsights.competitorStrengths,
        targetWeaknesses: aiInsights.targetWeaknesses,
        businessSummary: aiInsights.businessSummary,
        isAiGenerated: aiInsights.isAiGenerated,
        recommendations: tasks
      };
    })
  );
};

module.exports = {
  analyzeCompetitors
};
