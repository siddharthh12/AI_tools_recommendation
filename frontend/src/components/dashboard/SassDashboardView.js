'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import apiService from '../../services/api';
import { useDashboard } from '../../context/DashboardContext';

export default function SassDashboardView() {
  const { token, user } = useDashboard();

  // Summary, History, and Trend metrics state
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState([]);
  
  // Loading and Error states
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Trend filtering period: '7days' | '30days' | '90days' | 'year'
  const [period, setPeriod] = useState('30days');

  // Fetch Dashboard Summary details
  const fetchSummary = async () => {
    try {
      setLoadingSummary(true);
      const data = await apiService.getDashboardSummary();
      if (data.success) {
        setSummary(data);
      }
    } catch (err) {
      console.error('[SassDashboardView fetchSummary]:', err.message);
      setErrorMsg(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch Dashboard scan log history
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await apiService.getDashboardHistory();
      if (data.success) {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('[SassDashboardView fetchHistory]:', err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch trend graph coordinates
  const fetchTrends = async (selectedPeriod) => {
    try {
      setLoadingTrends(true);
      const data = await apiService.getDashboardTrends(selectedPeriod);
      if (data.success) {
        setTrends(data.trends || []);
      }
    } catch (err) {
      console.error('[SassDashboardView fetchTrends]:', err.message);
    } finally {
      setLoadingTrends(false);
    }
  };

  // Fetch on mount / when token is loaded
  useEffect(() => {
    if (token) {
      fetchSummary();
      fetchHistory();
    }
  }, [token]);

  // Re-fetch trends when time filter parameter changes or token is loaded
  useEffect(() => {
    if (token) {
      fetchTrends(period);
    }
  }, [period, token]);

  // Handle format scan dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const dateObj = new Date(dateString);
    const today = new Date();
    
    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-emerald-600 bg-emerald-50';
    if (growth < 0) return 'text-rose-600 bg-rose-50';
    return 'text-gray-500 bg-gray-50';
  };

  const renderGrowthPill = (growth) => {
    const isPositive = growth > 0;
    const isNegative = growth < 0;
    const absGrowth = Math.abs(growth);

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold leading-none shrink-0 ${getGrowthColor(growth)}`}>
        {isPositive && <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" />}
        {isNegative && <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />}
        <span>{isPositive ? '+' : isNegative ? '-' : ''}{absGrowth}%</span>
      </span>
    );
  };

  if (loadingSummary && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 font-bold">Assembling dashboard analytics...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl flex items-start space-x-3 text-sm max-w-lg mx-auto mt-12 shadow-sm">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-rose-800">Connection Failure</h4>
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  // Fallback defaults if no scans found
  const {
    businessName = 'N/A',
    overallScore = 0,
    weeklyChange = 0,
    monthlyChange = 0,
    lastScanDate = null,
    platforms = {
      chatgpt: { score: 0, previous: 0, growth: 0 },
      gemini: { score: 0, previous: 0, growth: 0 },
      perplexity: { score: 0, previous: 0, growth: 0 }
    },
    insights = []
  } = summary || {};

  return (
    <div className="space-y-8 pb-12 font-sans select-text">
      
      {/* Dashboard Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            {businessName && businessName !== 'N/A' 
              ? `Performance tracking for ${businessName}` 
              : 'Sign in details and historical visibility tracking metrics'}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 bg-gray-50/70 border border-gray-100 rounded-xl px-3 py-1.5 shadow-sm shrink-0">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span>Last Refreshed: {formatDate(lastScanDate)}</span>
        </div>
      </div>

      {/* SECTION 1: Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Overall Visibility */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Overall AI Visibility
            </span>
            <h2 className="text-4xl font-extrabold text-gray-950 mt-2 tracking-tight">
              {overallScore}%
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-auto">
            Aggregated platform average
          </p>
        </div>

        {/* Card 2: Weekly Growth */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-emerald-500/5 blur-xl pointer-events-none rounded-full" />
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Weekly Growth
            </span>
            <div className="flex items-center space-x-2.5 mt-2">
              <h2 className={`text-4xl font-extrabold tracking-tight ${
                weeklyChange > 0 ? 'text-emerald-600' : weeklyChange < 0 ? 'text-rose-600' : 'text-gray-950'
              }`}>
                {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
              </h2>
              <span className={`p-1.5 rounded-xl ${
                weeklyChange > 0 ? 'bg-emerald-50 text-emerald-600' : weeklyChange < 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'
              }`}>
                {weeklyChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-auto">
            Change since previous scan
          </p>
        </div>

        {/* Card 3: Monthly Growth */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-blue-500/5 blur-xl pointer-events-none rounded-full" />
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Monthly Growth
            </span>
            <div className="flex items-center space-x-2.5 mt-2">
              <h2 className={`text-4xl font-extrabold tracking-tight ${
                monthlyChange > 0 ? 'text-emerald-600' : monthlyChange < 0 ? 'text-rose-600' : 'text-gray-950'
              }`}>
                {monthlyChange >= 0 ? '+' : ''}{monthlyChange}%
              </h2>
              <span className={`p-1.5 rounded-xl ${
                monthlyChange > 0 ? 'bg-emerald-50 text-emerald-600' : monthlyChange < 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'
              }`}>
                {monthlyChange >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-auto">
            Change over trailing 30 days
          </p>
        </div>

        {/* Card 4: Last Scan */}
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-40">
          <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-cyan-500/5 blur-xl pointer-events-none rounded-full" />
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
              Last Scan Date
            </span>
            <h2 className="text-3xl font-extrabold text-gray-950 mt-3 tracking-tight">
              {formatDate(lastScanDate)}
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-semibold mt-auto">
            Timestamp of latest data fetch
          </p>
        </div>

      </div>

      {/* SECTION 2: Visibility Trend Line Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
              Visibility Trend
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1.5">
              Historical index scores timeline representation
            </p>
          </div>
          
          {/* Period selector buttons */}
          <div className="flex items-center p-1 bg-slate-50 border border-gray-100 rounded-2xl shrink-0">
            {[
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: '90days', label: '90 Days' },
              { id: 'year', label: '1 Year' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  period === p.id 
                    ? 'bg-white text-indigo-650 shadow-sm border border-gray-100/50' 
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72 w-full">
          {loadingTrends ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl animate-pulse">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading trend telemetry...</span>
            </div>
          ) : trends.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl p-6 text-center">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">No trend coordinates compiled</span>
              <p className="text-[11px] text-gray-400 font-medium max-w-xs mt-1">Run multiple scans over time to see your progress chart build up!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trends}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  stroke="#94a3b8"
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tickCount={6}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  stroke="#94a3b8"
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#f1f5f9',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                    fontFamily: 'sans-serif'
                  }}
                  itemStyle={{ color: '#4f46e5', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  formatter={(value) => [`${value}%`, 'Visibility Score']}
                />
                <Line
                  type="monotone"
                  dataKey="visibility"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: '#ffffff', strokeWidth: 2, fill: '#4f46e5' }}
                  activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* SECTION 3: Platform Comparison */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
            Platform Comparison
          </h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Current discoverability score changes by core provider
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'chatgpt', name: 'ChatGPT', metrics: platforms.chatgpt, glow: 'bg-emerald-500/5' },
            { id: 'gemini', name: 'Gemini', metrics: platforms.gemini, glow: 'bg-blue-500/5' },
            { id: 'perplexity', name: 'Perplexity', metrics: platforms.perplexity, glow: 'bg-cyan-500/5' }
          ].map((plat) => (
            <div 
              key={plat.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-32"
            >
              <div className={`absolute top-0 right-0 -z-10 h-16 w-16 ${plat.glow} blur-lg pointer-events-none rounded-full`} />
              <div className="flex justify-between items-start">
                <span className="text-sm font-extrabold text-gray-950">{plat.name}</span>
                {renderGrowthPill(plat.metrics.growth)}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Score</span>
                  <span className="text-2xl font-extrabold text-gray-950 mt-1 block">{plat.metrics.score}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Previous</span>
                  <span className="text-xs text-gray-400 font-semibold mt-1 block">{plat.metrics.previous}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Recent Scans + Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* SECTION 4: Recent Scans */}
        <div className="lg:col-span-3 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 flex flex-col">
          <div>
            <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
              Recent Scans
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1.5">
              Chronological log of the latest 10 visibility checks
            </p>
          </div>

          <div className="flex-grow overflow-x-auto">
            {loadingHistory ? (
              <div className="h-48 w-full flex items-center justify-center bg-gray-50/50 rounded-2xl animate-pulse">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading scan history...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="h-48 w-full flex flex-col items-center justify-center bg-gray-50/50 rounded-2xl text-center p-6 border border-dashed border-gray-200">
                <HelpCircle className="h-7 w-7 text-gray-350" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1.5">No scans registered</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-semibold text-gray-500 min-w-[450px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest font-black text-gray-400">
                    <th className="pb-3 pr-2">Date</th>
                    <th className="pb-3 px-2 text-center">Overall</th>
                    <th className="pb-3 px-2 text-center">ChatGPT</th>
                    <th className="pb-3 px-2 text-center">Gemini</th>
                    <th className="pb-3 pl-2 text-center">Perplexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((scan) => (
                    <tr key={scan.id} className="text-gray-900">
                      <td className="py-3 pr-2 text-gray-500 font-bold">{formatDate(scan.date)}</td>
                      <td className="py-3 px-2 text-center font-extrabold text-[#5939fc]">{scan.overallVisibility}%</td>
                      <td className="py-3 px-2 text-center font-bold">{scan.platforms?.chatgpt || 0}%</td>
                      <td className="py-3 px-2 text-center font-bold">{scan.platforms?.gemini || 0}%</td>
                      <td className="py-3 pl-2 text-center font-bold">{scan.platforms?.perplexity || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SECTION 5: Quick Insights */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
                  Quick Insights
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">
                  AI visibility optimizations advice
                </p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              {insights.length === 0 ? (
                <p className="text-xs text-gray-450 italic leading-relaxed">
                  No automated insights compiled yet. As soon as you crawl visibility results, dynamic insights will populate here.
                </p>
              ) : (
                insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-650 bg-slate-50/50 p-3 rounded-2xl border border-gray-100/50">
                    <span className="text-indigo-600 shrink-0 font-bold">•</span>
                    <span className="font-semibold leading-relaxed select-text">{insight}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50/70 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Powered by rule-based engines
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
