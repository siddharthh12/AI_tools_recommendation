'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  HelpCircle,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  Compass
} from 'lucide-react';
import apiService from '../../services/api';
import { useDashboard } from '../../context/DashboardContext';

export default function SuggestionsView() {
  const { token, businessName } = useDashboard();

  // Recommendations and History state
  const [playbook, setPlaybook] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Loading and Error states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // UI Tabs / Accordion state
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'wins' | 'comparison' | 'history'
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all' | 'New' | 'Pending' | 'Completed'
  const [expandedRec, setExpandedRec] = useState(null);

  // Fetch suggestions
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await apiService.getSuggestions();
      if (response.success && response.playbook) {
        setPlaybook(response.playbook);
      } else {
        setErrorMsg(response.message || 'Failed to load suggestions.');
      }
    } catch (err) {
      console.error('[SuggestionsView fetchSuggestions Error]:', err.message);
      setErrorMsg(err.message || 'Failed to connect to backend recommendations engine.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions logs history
  const fetchSuggestionsHistory = async () => {
    try {
      const response = await apiService.getSuggestionsHistory();
      if (response.success) {
        setHistory(response.history || []);
      }
    } catch (err) {
      console.error('[SuggestionsView fetchSuggestionsHistory Error]:', err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSuggestions();
      fetchSuggestionsHistory();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-650 animate-spin" />
        <p className="text-sm text-gray-500 font-bold">Generating unique recommendations playbook...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-2xl flex items-start space-x-3 text-sm max-w-lg mx-auto mt-12 shadow-sm">
        <AlertCircle className="h-6 w-6 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-rose-800">Calculation Fault</h4>
          <p className="font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  const {
    summary = 'No summary profile generated.',
    overallHealth = 'Fair',
    recommendations = [],
    roadmap = [],
    quickWins = [],
    longTermImprovements = [],
    competitorComparison = [],
    expectedImprovements = {
      chatgpt: { current: 0, target: 0 },
      gemini: { current: 0, target: 0 },
      perplexity: { current: 0, target: 0 }
    }
  } = playbook || {};

  // Color mappings
  const getHealthBadgeColor = (health) => {
    switch (health) {
      case 'Excellent': return 'text-emerald-700 bg-emerald-50 border-emerald-250';
      case 'Good': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Fair': return 'text-amber-700 bg-amber-50 border-amber-250';
      case 'Poor': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-150';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Pending': return 'text-amber-650 bg-amber-50 border-amber-100';
      case 'New': return 'text-indigo-650 bg-indigo-50 border-indigo-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-150';
    }
  };

  const getDifficultyIcon = (diff) => {
    switch (diff) {
      case 'Easy': return <Zap className="h-3.5 w-3.5 text-emerald-500" />;
      case 'Medium': return <Compass className="h-3.5 w-3.5 text-indigo-500" />;
      case 'Hard': return <Clock className="h-3.5 w-3.5 text-rose-500" />;
      default: return <Zap className="h-3.5 w-3.5 text-gray-500" />;
    }
  };

  const filteredHistoryRecommendations = recommendations.filter(r => {
    if (historyFilter === 'all') return true;
    return r.status === historyFilter;
  });

  return (
    <div className="space-y-8 pb-12 font-sans select-text">
      
      {/* Suggestions Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-none flex items-center space-x-2">
            <Sparkles className="h-7 w-7 text-indigo-650 animate-pulse" />
            <span>AI Optimization Suggestions</span>
          </h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Tailored discoverability recommendations for {businessName}
          </p>
        </div>
      </div>

      {/* Grid: Health Card + Expected Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Card 1: Health Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden h-60">
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
          <div className="space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Overall Business Health</span>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1.5 rounded-full text-base font-extrabold border shadow-sm ${getHealthBadgeColor(overallHealth)}`}>
                {overallHealth}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed pt-1 select-text">
              {summary}
            </p>
          </div>
          <div className="pt-4 border-t border-gray-50 select-none text-[10px] text-indigo-650 font-black tracking-widest uppercase flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            <span>Custom Scopes Evaluated Successfully</span>
          </div>
        </div>

        {/* Card 2: Expected improvements */}
        <div className="lg:col-span-3 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between h-60">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Expected Visibility Improvement</span>
                <p className="text-[10px] text-amber-600 font-bold uppercase mt-1">Estimated impact based on similar patterns, not guarantees.</p>
              </div>
              <span className="p-1 rounded-xl bg-indigo-50 text-indigo-600">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>

            {/* Score lists */}
            <div className="space-y-3.5 pt-3">
              {Object.keys(expectedImprovements).map((key) => {
                const plat = expectedImprovements[key];
                const current = plat.current || 0;
                const target = plat.target || 0;
                const delta = target - current;

                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500 min-w-[80px]">
                      {key}
                    </span>
                    <div className="flex-grow mx-4 flex items-center justify-between text-xs font-bold bg-gray-50/50 border border-gray-100 p-2.5 rounded-xl">
                      <span className="text-gray-400">Current: <strong className="text-gray-700">{current}%</strong></span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-indigo-600">Expected: <strong className="text-indigo-700">{target}%</strong></span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg shrink-0">
                      +{delta}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Suggestions Body Area Tabs */}
      <div className="space-y-6">
        
        {/* Navigation Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-50 border border-gray-100 rounded-2xl w-max max-w-full overflow-x-auto">
          {[
            { id: 'roadmap', label: 'Roadmap Checklist' },
            { id: 'wins', label: 'Quick Wins vs. Long Term' },
            { id: 'comparison', label: 'Competitor Comparison' },
            { id: 'history', label: 'Recommendation History' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id 
                  ? 'bg-white text-indigo-650 shadow-sm border border-gray-100/50' 
                  : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ROADMAP CHECKLIST TIMELINE */}
        {activeTab === 'roadmap' && (
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
                Improvement Roadmap
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">
                Dynamic, sequential 6-week timeline generated specifically for your business
              </p>
            </div>

            <div className="relative border-l-2 border-indigo-100 ml-4 pl-6 space-y-8 select-text">
              {roadmap.map((step, idx) => (
                <div key={idx} className="relative select-text">
                  {/* Timeline dot */}
                  <span className="absolute -left-[35px] top-1 h-5 w-5 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                      {step.week}
                    </span>
                    <h4 className="text-sm font-extrabold text-gray-950 select-text leading-snug">
                      {step.task}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QUICK WINS VS. LONG TERM ACCORDION */}
        {activeTab === 'wins' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Quick Wins Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <Zap className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
                      Quick Wins
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      Small effort tasks with immediate discoverability gains
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-5">
                  {quickWins.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No low-effort quick wins identified.</p>
                  ) : (
                    quickWins.map((win, idx) => (
                      <div key={idx} className="border border-gray-100 p-4 rounded-2xl bg-gray-50/30 space-y-1.5 select-text">
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 select-text">
                          {win.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed select-text">
                          {win.recommendation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* High Impact Long Term Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <TrendingUp className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
                      High Impact Improvements
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      Strategic actions yielding critical rankings optimization over time
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-5">
                  {longTermImprovements.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No long term items identified.</p>
                  ) : (
                    longTermImprovements.map((item, idx) => (
                      <div key={idx} className="border border-gray-100 p-4 rounded-2xl bg-gray-50/30 space-y-1.5 select-text">
                        <h4 className="text-xs font-black uppercase tracking-wider text-[#5939fc] select-text">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed select-text">
                          {item.recommendation}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: COMPETITOR COMPARISON INDEX */}
        {activeTab === 'comparison' && (
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
                Competitor Comparison Index
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">
                Comparison of signals between your business and discovered competitors
              </p>
            </div>

            <div className="overflow-x-auto select-none">
              <table className="w-full text-left text-xs font-semibold text-gray-500 min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest font-black text-gray-400">
                    <th className="pb-3 pr-2">Business Name</th>
                    <th className="pb-3 px-2 text-center">Reviews Quality</th>
                    <th className="pb-3 px-2 text-center">Website Authority</th>
                    <th className="pb-3 pl-2 text-center">AI Visibility Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {competitorComparison.map((comp, idx) => {
                    const isTarget = comp.name === 'Your Business';
                    return (
                      <tr key={idx} className={isTarget ? 'text-indigo-650 bg-indigo-50/30 font-black' : 'text-gray-900'}>
                        <td className="py-3.5 pr-2 font-extrabold">{comp.name} {isTarget && '(You)'}</td>
                        <td className="py-3.5 px-2 text-center text-amber-500">{comp.reviewsRating}</td>
                        <td className="py-3.5 px-2 text-center text-blue-500">{comp.websiteQuality}</td>
                        <td className="py-3.5 pl-2 text-center text-[#5939fc]">{comp.aiVisibility}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: RECOMMENDATION HISTORY STATUS */}
        {activeTab === 'history' && (
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-950 tracking-tight leading-none">
                  Recommendation History
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-1.5">
                  Comparison log tracking completed, pending, and new tasks
                </p>
              </div>

              {/* History category selectors */}
              <div className="flex items-center p-1 bg-slate-50 border border-gray-100 rounded-2xl shrink-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'New', label: 'New' },
                  { id: 'Pending', label: 'Pending' },
                  { id: 'Completed', label: 'Completed' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setHistoryFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      historyFilter === f.id 
                        ? 'bg-white text-indigo-650 shadow-sm border border-gray-100/50' 
                        : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List items */}
            <div className="space-y-4 pt-2">
              {filteredHistoryRecommendations.length === 0 ? (
                <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <CheckCircle2 className="h-6 w-6 text-gray-350 mx-auto" />
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-2">No items match this filter status</p>
                </div>
              ) : (
                filteredHistoryRecommendations.map((r, idx) => {
                  const isExpanded = expandedRec === idx;
                  const isCompleted = r.status === 'Completed';

                  return (
                    <div 
                      key={idx}
                      className={`border rounded-2xl transition-all relative overflow-hidden select-text ${
                        isExpanded ? 'border-indigo-150 bg-indigo-50/5' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedRec(isExpanded ? null : idx)}
                        className="w-full flex items-center justify-between p-4 cursor-pointer focus:outline-none"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300 shrink-0" />
                          )}
                          <div>
                            <h4 className={`text-sm font-extrabold select-text leading-snug ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-950'}`}>
                              {r.title}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">{r.category}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider leading-none shrink-0 ${getStatusColor(r.status)}`}>
                            {r.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider leading-none shrink-0 ${getPriorityColor(r.priority)}`}>
                            {r.priority} Priority
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-5 pt-1 border-t border-gray-100/50 space-y-4 text-xs font-semibold text-gray-600 bg-gray-50/20 select-text">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Problem</span>
                              <p className="text-gray-800 font-extrabold select-text">{r.problem}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Impact</span>
                              <p className="text-gray-800 font-extrabold select-text">{r.expectedImpact} Impact</p>
                            </div>
                            <div className="space-y-1 flex items-center space-x-2">
                              {getDifficultyIcon(r.estimatedDifficulty)}
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Difficulty & Time</span>
                                <p className="text-gray-800 font-extrabold select-text">{r.estimatedDifficulty} • {r.estimatedTime}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Why it matters</span>
                            <p className="leading-relaxed select-text">{r.reason}</p>
                          </div>

                          <div className="space-y-1 bg-white p-3 border border-gray-100 rounded-xl">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-650 block">Action Checklist</span>
                            <p className="leading-relaxed text-indigo-950 font-extrabold pt-0.5 select-text">{r.recommendation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
