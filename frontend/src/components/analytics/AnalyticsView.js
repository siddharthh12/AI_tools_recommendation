'use client';

import React, { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import TrendChart from '../charts/TrendChart';
import ScoreComparisonChart from '../charts/ScoreComparisonChart';
import { 
  generateHistoricalScores, 
  generateCompetitorComparisonData,
  generateReviewGrowthData
} from '../../lib/mockData';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { LineChart as LucideLineChart, TrendingUp, Award, MessageSquare } from 'lucide-react';

export default function AnalyticsView() {
  const { report, compReport, businessName } = useDashboard();

  if (!report) return null;

  const currentScore = report.overallScore || 0;
  const competitorsList = compReport?.topCompetitors || [];

  // Generate name-hash stable time-series mocks on the fly
  const scoreTrendData = useMemo(() => {
    return generateHistoricalScores(businessName, currentScore);
  }, [businessName, currentScore]);

  const comparisonTrendData = useMemo(() => {
    return generateCompetitorComparisonData(businessName, currentScore, competitorsList);
  }, [businessName, currentScore, competitorsList]);

  const reviewGrowthData = useMemo(() => {
    const startCount = report.reviewData?.reviewCount || 100;
    return generateReviewGrowthData(businessName, startCount);
  }, [businessName, report.reviewData?.reviewCount]);

  // Compute telemetry metadata summaries
  const startingScore = scoreTrendData[0]?.score || 0;
  const scoreDelta = currentScore - startingScore;

  return (
    <div className="space-y-10 py-2">
      
      {/* 1. Header description */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 text-indigo-400">
          <LucideLineChart className="h-4.5 w-4.5" />
          <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Chronological Trends &amp; Telemetry</h3>
        </div>
        <p className="text-[11px] text-gray-500 font-semibold">
          Chronological progress charts tracking index deltas, benchmark gaps, and review accumulations.
        </p>
      </div>

      {/* 2. Telemetry metadata recap widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex gap-4 items-center">
          <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">30-Day Index Gain</div>
            <div className="text-lg font-black text-white mt-0.5">
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} points
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex gap-4 items-center">
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <Award className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Current AI Rank Score</div>
            <div className="text-lg font-black text-white mt-0.5">
              {currentScore}/100 Index
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex gap-4 items-center">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Total citations reviews</div>
            <div className="text-lg font-black text-white mt-0.5">
              {report.reviewData?.reviewCount || 0} reviews
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recharts graphs panels grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Overall Score timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-900 shadow-xl space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white leading-none">30-Day Visibility Progression</h4>
            <p className="text-[10px] text-gray-500 font-semibold">Chronological delta tracking calculated visibility index weights.</p>
          </div>
          <TrendChart data={scoreTrendData} />
        </div>

        {/* Brand vs competitors benchmark */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-900 shadow-xl space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white leading-none">Competitors Gap Progression</h4>
            <p className="text-[10px] text-gray-500 font-semibold">Comparative time-series line contrasting brand gains against local averages.</p>
          </div>
          <ScoreComparisonChart data={comparisonTrendData} />
        </div>

      </div>

      {/* 4. Review signals growth curve block */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-900 shadow-xl space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white leading-none">Local Review Accumulation Curve</h4>
          <p className="text-[10px] text-gray-500 font-semibold">Chronological timeline mapping star review accumulation trust signals.</p>
        </div>
        
        <div className="h-56 w-full text-xs font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reviewGrowthData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, #1f2937)" className="stroke-gray-800 dark:stroke-gray-900" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={10} stroke="#6b7280" />
              <YAxis tickLine={false} axisLine={false} dx={-10} stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#030712', borderColor: '#1f2937', borderRadius: '12px', padding: '10px 14px' }}
                itemStyle={{ color: '#10b981', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="reviews" name="Reviews count" stroke="#10b981" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
