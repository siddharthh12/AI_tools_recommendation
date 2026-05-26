/**
 * Dynamic Mock Time-Series Telemetry Generator
 * 
 * Compiles reproducible, name-hash stable historical records for the Recharts
 * dashboard sections. This ensures premium SaaS-grade demos and timeline graphing.
 */

// Simple deterministic hash based on a string name to keep data stable across audits
function getStableHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Compiles a 30-day historical scores timeline.
 * @param {string} business - Brand name
 * @param {number} currentScore - The calculated current score
 * @returns {Array<Object>} List of daily scores [{ date: "May 01", score: 62 }]
 */
export function generateHistoricalScores(business = "Your Brand", currentScore = 75) {
  const data = [];
  const hash = getStableHash(business);
  
  // Starting score from 30 days ago (make it lower to show growth)
  const baseStart = Math.max(35, currentScore - 20 - (hash % 15));
  
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    
    // Format: "May 12"
    const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    
    // Progressive growth with subtle random daily shifts
    const progressionPercent = (29 - i) / 29;
    const dailyDelta = Math.sin((29 - i) * 0.5) * 2; // subtle wave
    const scoreVal = Math.round(baseStart + (currentScore - baseStart) * progressionPercent + dailyDelta);
    
    data.push({
      date: dateStr,
      score: Math.min(100, Math.max(0, scoreVal))
    });
  }
  
  // Ensure the last item exactly matches the current score
  data[data.length - 1].score = currentScore;
  
  return data;
}

/**
 * Compiles a 30-day competitor score comparison dataset.
 * @param {string} business - Brand name
 * @param {number} currentScore - Calculated score
 * @param {Array<Object>} competitors - Top competitor profiles
 * @returns {Array<Object>} List of comparative daily scores [{ date: "May 01", You: 62, CompetitorA: 78 }]
 */
export function generateCompetitorComparisonData(business = "You", currentScore = 75, competitors = []) {
  const data = [];
  const compA = competitors[0]?.name || "Competitor A";
  const compAScore = competitors[0]?.score || 80;
  
  const compB = competitors[1]?.name || "Competitor B";
  const compBScore = competitors[1]?.score || 72;

  const hash = getStableHash(business);
  const userStart = Math.max(35, currentScore - 25 - (hash % 10));
  
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    
    const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    
    // User progress over 30 days
    const uPercent = (29 - i) / 29;
    const uVal = Math.round(userStart + (currentScore - userStart) * uPercent + Math.sin(i) * 1.5);
    
    // Competitors remain relatively flat / horizontal
    const aVal = Math.round(compAScore - 2 + Math.cos(i * 0.5) * 1);
    const bVal = Math.round(compBScore - 1 + Math.sin(i * 0.8) * 1.2);
    
    data.push({
      date: dateStr,
      You: Math.min(100, Math.max(0, uVal)),
      [compA]: Math.min(100, Math.max(0, aVal)),
      [compB]: Math.min(100, Math.max(0, bVal))
    });
  }
  
  // Clean final coordinates lock
  data[data.length - 1].You = currentScore;
  if (competitors[0]) data[data.length - 1][compA] = compAScore;
  if (competitors[1]) data[data.length - 1][compB] = compBScore;
  
  return data;
}

/**
 * Generates a 30-day tracking of review counts signals.
 */
export function generateReviewGrowthData(business = "Brand", startCount = 120) {
  const data = [];
  const hash = getStableHash(business);
  const growthRate = 2 + (hash % 4); // reviews gained per week on average
  
  const today = new Date();
  let countAccumulator = Math.max(10, startCount - Math.round(growthRate * 4.2));
  
  for (let i = 29; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    
    const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    
    // Increment review count on random days
    if (i % 7 === 0 && i !== 29) {
      countAccumulator += Math.round(growthRate * (0.8 + Math.random() * 0.4));
    }
    
    data.push({
      date: dateStr,
      reviews: countAccumulator
    });
  }
  
  data[data.length - 1].reviews = startCount;
  
  return data;
}
