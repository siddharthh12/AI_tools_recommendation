/**
 * Dashboard Controller
 * 
 * Aggregates visibility histories from MongoDB to compute overall averages,
 * weekly/monthly changes, platform comparisons, and trend graph lines.
 */

const VisibilityHistory = require('../models/VisibilityHistory');

/**
 * Returns latest dashboard metrics summary.
 * GET /api/dashboard
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all user scan histories, sorted descending
    const scans = await VisibilityHistory.find({ userId }).sort({ scanDate: -1 });

    if (scans.length === 0) {
      return res.status(200).json({
        success: true,
        businessName: '',
        overallScore: 0,
        weeklyChange: 0,
        monthlyChange: 0,
        lastScanDate: null,
        platforms: {
          chatgpt: { score: 0, previous: 0, growth: 0 },
          gemini: { score: 0, previous: 0, growth: 0 },
          perplexity: { score: 0, previous: 0, growth: 0 }
        },
        insights: [
          'No scans found yet. Launch a search crawl in the Cockpit to generate visibility analytics!'
        ]
      });
    }

    const latestScan = scans[0];
    const prevScan = scans[1] || null;

    // Calculate weekly change (compared to previous scan)
    const weeklyChange = prevScan 
      ? latestScan.overallVisibility - prevScan.overallVisibility 
      : 0;

    // Calculate monthly change (scan closest to 30 days ago)
    let monthlyScan = null;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find the first scan that is around 30 days ago
    for (const scan of scans) {
      if (scan.scanDate <= thirtyDaysAgo) {
        monthlyScan = scan;
        break;
      }
    }

    // Fallback: if no scan older than 30 days, use the oldest scan in history if we have at least 3 scans
    if (!monthlyScan && scans.length > 2) {
      monthlyScan = scans[scans.length - 1];
    }

    const monthlyChange = monthlyScan
      ? latestScan.overallVisibility - monthlyScan.overallVisibility
      : weeklyChange; // fallback to weekly if no monthly scan

    // Compile platform stats
    const getPlatformStats = (platName) => {
      const current = latestScan.platforms[platName] || 0;
      const previous = prevScan ? (prevScan.platforms[platName] || 0) : 0;
      const growth = current - previous;
      return {
        score: current,
        previous,
        growth
      };
    };

    const platforms = {
      chatgpt: getPlatformStats('chatgpt'),
      gemini: getPlatformStats('gemini'),
      perplexity: getPlatformStats('perplexity')
    };

    // Compile simple rule-based insights
    const insights = [];
    
    // 1. Overall monthly/weekly change insight
    if (monthlyChange > 0) {
      insights.push(`Your AI visibility improved by ${monthlyChange}% this month.`);
    } else if (monthlyChange < 0) {
      insights.push(`Your AI visibility declined by ${Math.abs(monthlyChange)}% this month.`);
    } else if (weeklyChange > 0) {
      insights.push(`Your AI visibility improved by ${weeklyChange}% since your last scan.`);
    } else {
      insights.push('Your AI visibility remained stable over the recent period.');
    }

    // 2. Strongest platform insight
    const pScores = [
      { name: 'ChatGPT', score: platforms.chatgpt.score },
      { name: 'Gemini', score: platforms.gemini.score },
      { name: 'Perplexity', score: platforms.perplexity.score }
    ];
    pScores.sort((a, b) => b.score - a.score);
    
    if (pScores[0].score > 0) {
      insights.push(`${pScores[0].name} is your strongest platform.`);
    }

    // 3. Platform growth insight
    const pGrowths = [
      { name: 'ChatGPT', growth: platforms.chatgpt.growth },
      { name: 'Gemini', growth: platforms.gemini.growth },
      { name: 'Perplexity', growth: platforms.perplexity.growth }
    ].filter(p => p.growth > 0);

    pGrowths.sort((a, b) => b.growth - a.growth);
    if (pGrowths.length > 0) {
      insights.push(`${pGrowths[0].name} visibility increased compared to last week.`);
    }

    return res.status(200).json({
      success: true,
      businessName: latestScan.businessName,
      overallScore: latestScan.overallVisibility,
      weeklyChange,
      monthlyChange,
      lastScanDate: latestScan.scanDate,
      platforms,
      insights
    });

  } catch (error) {
    console.error('[Dashboard Controller summary Error]:', error.message);
    next(error);
  }
};

/**
 * Returns scan history list, limited to latest 10 scans.
 * GET /api/dashboard/history
 */
const getDashboardHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Retrieve latest 10 scans for this user
    const scans = await VisibilityHistory.find({ userId })
      .sort({ scanDate: -1 })
      .limit(10);

    const historyData = scans.map(s => ({
      id: s._id,
      date: s.scanDate,
      overallVisibility: s.overallVisibility,
      platforms: s.platforms
    }));

    return res.status(200).json({
      success: true,
      history: historyData
    });

  } catch (error) {
    console.error('[Dashboard Controller history Error]:', error.message);
    next(error);
  }
};

/**
 * Returns graph trends metrics filtered by period scope.
 * GET /api/dashboard/trends
 */
const getDashboardTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = '30days' } = req.query;

    // Calculate start date boundary
    const cutoffDate = new Date();
    if (period === '7days') {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (period === '90days') {
      cutoffDate.setDate(cutoffDate.getDate() - 90);
    } else if (period === 'year') {
      cutoffDate.setDate(cutoffDate.getDate() - 365);
    } else {
      // Default: 30 days
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    }

    // Retrieve scans in period sorted ascending for Recharts timeline
    const scans = await VisibilityHistory.find({
      userId,
      scanDate: { $gte: cutoffDate }
    }).sort({ scanDate: 1 });

    const trends = scans.map(s => {
      const dateLabel = new Date(s.scanDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return {
        date: dateLabel,
        visibility: s.overallVisibility
      };
    });

    return res.status(200).json({
      success: true,
      trends
    });

  } catch (error) {
    console.error('[Dashboard Controller trends Error]:', error.message);
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardHistory,
  getDashboardTrends
};
