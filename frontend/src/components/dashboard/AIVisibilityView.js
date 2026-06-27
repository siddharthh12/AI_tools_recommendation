'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Radio, 
  Terminal, 
  Search, 
  Play, 
  Award, 
  TrendingUp, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Globe, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Activity,
  Layers,
  Server,
  Filter
} from 'lucide-react';

export default function AIVisibilityView() {
  const { 
    businessName, 
    category, 
    city, 
    competitors,
    visibilityStatus,
    visibilityData,
    visibilityLogs,
    triggerVisibilityCheck
  } = useDashboard();

  const [isDebugExpanded, setIsDebugExpanded] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('perplexity'); // perplexity | chatgpt | gemini
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [comparisonMode, setComparisonMode] = useState('overall'); // 'overall' or query index (0, 1, 2, 3, 4)
  const [logFilter, setLogFilter] = useState('all'); // all | perplexity | chatgpt | gemini | engine
  
  const consoleEndRef = useRef(null);

  // Auto-scroll the debug console logs
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibilityLogs]);

  // Trigger scan helper
  const handleStartScan = () => {
    triggerVisibilityCheck();
  };

  // Helper to filter logs
  const getFilteredLogs = () => {
    if (!visibilityLogs || visibilityLogs.length === 0) return [];
    if (logFilter === 'all') return visibilityLogs;
    
    return visibilityLogs.filter(log => {
      const comp = (log.component || '').toLowerCase();
      if (logFilter === 'perplexity') return comp.includes('perplexity');
      if (logFilter === 'chatgpt') return comp.includes('chatgpt');
      if (logFilter === 'gemini') return comp.includes('gemini');
      if (logFilter === 'engine') return comp.includes('engine');
      return true;
    });
  };

  // Helper to check if a business was mentioned on a platform for a specific query
  const checkMention = (bizName, platformKey, queryIdx) => {
    if (!visibilityData || !visibilityData.platforms) return false;
    const queryItem = visibilityData.platforms[queryIdx];
    if (!queryItem || !queryItem.platforms) return false;
    const platData = queryItem.platforms[platformKey];
    if (!platData || !platData.detections) return false;
    
    const det = platData.detections.find(d => d.name.toLowerCase() === bizName.toLowerCase());
    return det ? det.mentioned : false;
  };

  // Standard styling scores
  const getScoreBadgeClass = (score) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-600 border-emerald-150';
    if (score >= 40) return 'bg-indigo-50 text-indigo-600 border-indigo-150';
    return 'bg-rose-50 text-rose-600 border-rose-100';
  };

  // 1. IDLE / NOT STARTED STATE
  if (visibilityStatus === 'idle') {
    return (
      <div className="space-y-8 py-4 animate-fade-in text-gray-900">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
            <Radio className="h-3.5 w-3.5 animate-pulse text-[#5939fc]" />
            <span>Multi-Platform AI Engine</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-tight sm:text-4xl">
            Generative Engine <span className="bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] bg-clip-text text-transparent">Optimization</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-semibold">
            Analyze whether AI search engines recommend your business when answering user queries. Check discoverability share across Perplexity, ChatGPT, and Gemini.
          </p>
        </div>

        <div className="border border-gray-100 bg-white rounded-[2rem] p-8 max-w-3xl shadow-xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
          
          <div className="rounded-full h-16 w-16 bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-md">
            <Layers className="h-8 w-8 text-indigo-600 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-black text-gray-950 leading-tight">Run Multi-Platform AI Visibility Audit</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
              We will generate 5 location-aware prompts and run Playwright browser automated crawls sequentially across Perplexity, ChatGPT, and Gemini to compare your brand's share of recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-gray-450 uppercase font-black">Platform 1</div>
                <div className="text-sm font-bold text-gray-900">Perplexity AI</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-gray-450 uppercase font-black">Platform 2</div>
                <div className="text-sm font-bold text-gray-900">ChatGPT (OpenAI)</div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-gray-450 uppercase font-black">Platform 3</div>
                <div className="text-sm font-bold text-gray-900">Gemini (Google)</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full text-left max-w-lg space-y-2 select-none">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Scan parameters</div>
            <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm font-bold">
              <div className="text-gray-500">Target: <span className="text-gray-900 font-extrabold">{businessName || 'Be Strong Gym'}</span></div>
              <div className="text-gray-500">Category: <span className="text-gray-900 font-extrabold">{category || 'Gym'}</span></div>
              <div className="text-gray-500">Location: <span className="text-gray-900 font-extrabold">{city || 'Vikhroli, Mumbai'}</span></div>
            </div>
          </div>

          <button
            onClick={handleStartScan}
            className="px-6 py-3.5 bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] text-white font-extrabold text-sm tracking-wide rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all hover:opacity-95 border border-indigo-400/20"
          >
            <Play className="h-4.5 w-4.5 fill-current" />
            <span>Launch Multi-Platform Scan</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. RUNNING / SCANNING STATE
  if (visibilityStatus === 'running') {
    const lastLog = visibilityLogs[visibilityLogs.length - 1]?.message || '';
    let currentTask = 'Perplexity AI';
    if (lastLog.toLowerCase().includes('chatgpt')) currentTask = 'ChatGPT';
    else if (lastLog.toLowerCase().includes('gemini')) currentTask = 'Gemini AI';
    
    return (
      <div className="space-y-8 py-4 animate-fade-in text-gray-900">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-indigo-650">
            <Radio className="h-5.5 w-5.5 animate-pulse" />
            <h3 className="text-base font-black uppercase tracking-wider font-extrabold">Scraping AI Search Engines...</h3>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">Active Visibility Audit</h2>
          <p className="text-sm sm:text-base text-gray-500 font-bold leading-none">
            Querying engines sequentially using headed Playwright automation. This takes about 60-90 seconds.
          </p>
        </div>

        {/* Loading progress bar */}
        <div className="border border-gray-150 bg-white rounded-2xl p-6 max-w-3xl space-y-5 shadow-lg">
          <div className="flex items-center justify-between text-sm sm:text-base font-black uppercase tracking-wider">
            <span className="text-indigo-600 animate-pulse flex items-center space-x-1.5">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Automating: <strong className="text-gray-900 ml-1">{currentTask}</strong></span>
            </span>
            <span className="text-xs sm:text-sm text-gray-400 font-extrabold">Headless: false (Headed debug active)</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full" style={{ width: '45%' }} />
          </div>

          {/* Sequential step timeline */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 text-sm font-black uppercase tracking-widest text-center">
            <div className={`p-2.5 rounded-lg border ${lastLog.toLowerCase().includes('chatgpt') || lastLog.toLowerCase().includes('gemini') ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-indigo-200 text-indigo-600 bg-indigo-50 animate-pulse'}`}>
              1. Perplexity AI
            </div>
            <div className={`p-2.5 rounded-lg border ${lastLog.toLowerCase().includes('gemini') ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : lastLog.toLowerCase().includes('chatgpt') ? 'border-indigo-200 text-indigo-600 bg-indigo-50 animate-pulse' : 'border-gray-200 text-gray-405 bg-gray-50'}`}>
              2. ChatGPT
            </div>
            <div className={`p-2.5 rounded-lg border ${lastLog.toLowerCase().includes('gemini') ? 'border-indigo-200 text-indigo-600 bg-indigo-50 animate-pulse' : 'border-gray-200 text-gray-405 bg-gray-50'}`}>
              3. Gemini AI
            </div>
          </div>
        </div>

        {/* Real-time console logger */}
        <div className="border border-gray-150 bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-150 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Terminal className="h-5 w-5 text-indigo-600" />
              <span className="text-sm sm:text-base font-black text-gray-950 uppercase tracking-wider">Multi-Platform Playwright Crawler Terminal</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-sm font-bold text-gray-500 shadow-sm">
              <Activity className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
              <span>RUNNING</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 font-mono text-xs leading-relaxed text-gray-600 h-64 overflow-y-auto space-y-1.5 select-text">
            {visibilityLogs.length > 0 ? (
              visibilityLogs.map((log, index) => {
                let typeColor = 'text-gray-500';
                if (log.type === 'error') typeColor = 'text-rose-650 font-extrabold';
                if (log.type === 'warn') typeColor = 'text-amber-600';
                return (
                  <div key={index} className="flex items-start space-x-2 select-text">
                    <span className="text-gray-400 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-indigo-600 shrink-0 select-none font-black">[{log.component}]</span>
                    <span className={`${typeColor} select-text`}>{log.message}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 italic">Initializing browser engine session, please wait...</div>
            )}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </div>
    );
  }

  // 3. ERROR STATE
  if (visibilityStatus === 'error') {
    return (
      <div className="space-y-8 py-4 animate-fade-in text-gray-900">
        <div className="border border-rose-100 bg-rose-50/50 rounded-3xl p-8 max-w-lg mx-auto text-center flex flex-col items-center justify-center space-y-6 shadow-xl">
          <div className="rounded-full h-14 w-14 bg-rose-100 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-950">AI Visibility Audit Failed</h3>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-semibold">
              The automated crawler failed to query the AI engines or complete response extraction.
            </p>
          </div>
          <button
            onClick={handleStartScan}
            className="px-5 py-3 bg-white border border-gray-200 hover:border-gray-300 text-sm sm:text-base font-bold text-gray-700 rounded-xl transition-all flex items-center space-x-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <span>Retry Audit Scan</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. SUCCESS STATE / AUDIT DASHBOARD VIEW
  if (visibilityStatus === 'success' && visibilityData) {
    const overallVisibility = visibilityData.visibility || [];
    const platformStats = visibilityData.platformStats || {};
    
    const getPlatformBrandStats = (plat) => {
      const stats = platformStats[plat] || [];
      return stats.find(v => v.name.toLowerCase() === businessName.toLowerCase()) || { mentioned: false, mentions: 0, visibility: 0, averagePosition: 0 };
    };

    const targetOverall = overallVisibility.find(v => v.name.toLowerCase() === businessName.toLowerCase()) || { visibility: 0, mentions: 0, averagePosition: 0 };
    const targetPerplexity = getPlatformBrandStats('perplexity');
    const targetChatGPT = getPlatformBrandStats('chatgpt');
    const targetGemini = getPlatformBrandStats('gemini');

    return (
      <div className="space-y-8 py-4 animate-fade-in text-gray-900">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-[#5939fc]">
              <Radio className="h-4 w-4 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider">Multi-Platform Recommendations</h3>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight leading-none">AI Visibility Comparison Dashboard</h2>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              Discoverability metrics across 3 platforms. Location: <span className="text-gray-800 font-extrabold">{city}</span>.
            </p>
          </div>

          <div className="flex space-x-3 self-start md:self-center">
            <button
              onClick={handleStartScan}
              className="px-4 py-2.5 border border-gray-200 hover:border-[#336ffc]/30 hover:bg-[#336ffc]/5 bg-white rounded-xl text-xs font-bold text-gray-655 hover:text-[#336ffc] transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-Run Audit</span>
            </button>
          </div>
        </div>

        {/* Platform Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Overall Card */}
          <div className="bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl border-0 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-white/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white/95">Overall Visibility</span>
              <Award className="h-5.5 w-5.5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black">{targetOverall.visibility}%</div>
              <div className="text-xs text-white/80 font-semibold leading-relaxed">
                Avg citation share across all active engines.
              </div>
            </div>
          </div>

          {/* Perplexity Card */}
          <div className="border border-cyan-100 bg-cyan-55/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-20 w-20 bg-cyan-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-600">Perplexity AI</span>
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-md shadow-cyan-500/30 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black text-gray-950">{targetPerplexity.visibility}%</div>
              <div className="text-xs text-gray-500 font-extrabold mt-1">
                Mentions: <span className="text-gray-900 font-black">{targetPerplexity.mentions}</span> | Avg Pos: <span className="text-gray-900 font-black">#{targetPerplexity.averagePosition || '-'}</span>
              </div>
            </div>
          </div>

          {/* ChatGPT Card */}
          <div className="border border-emerald-100 bg-emerald-55/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600">ChatGPT</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black text-gray-950">{targetChatGPT.visibility}%</div>
              <div className="text-xs text-gray-500 font-extrabold mt-1">
                Mentions: <span className="text-gray-900 font-black">{targetChatGPT.mentions}</span> | Avg Pos: <span className="text-gray-900 font-black">#{targetChatGPT.averagePosition || '-'}</span>
              </div>
            </div>
          </div>

          {/* Gemini Card */}
          <div className="border border-blue-100 bg-blue-55/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-605">Gemini AI</span>
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/30 shrink-0" />
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-black text-gray-955">{targetGemini.visibility}%</div>
              <div className="text-xs text-gray-500 font-extrabold mt-1">
                Mentions: <span className="text-gray-900 font-black">{targetGemini.mentions}</span> | Avg Pos: <span className="text-gray-900 font-black">#{targetGemini.averagePosition || '-'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Platform Comparison Matrix Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-black uppercase tracking-wider text-gray-950">Platform Recommendation Share</h3>
            
            {/* Mode Selector pills */}
            <div className="flex items-center space-x-1.5 p-1 bg-gray-50 border border-gray-200 rounded-xl max-w-fit select-none">
              <button
                onClick={() => setComparisonMode('overall')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${comparisonMode === 'overall' ? 'bg-indigo-50 border-indigo-100 text-indigo-650 shadow-sm' : 'text-gray-500 hover:text-gray-850 border-transparent'}`}
              >
                Overall Score %
              </button>
              
              {visibilityData.queries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setComparisonMode(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${comparisonMode === idx ? 'bg-indigo-50 border-indigo-100 text-indigo-650 shadow-sm' : 'text-gray-500 hover:text-gray-850 border-transparent'}`}
                >
                  Query {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 bg-white rounded-[2rem] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-xs font-black uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4">Business Name</th>
                    <th className="px-6 py-4 text-center">Perplexity</th>
                    <th className="px-6 py-4 text-center">ChatGPT</th>
                    <th className="px-6 py-4 text-center">Gemini AI</th>
                    <th className="px-6 py-4 text-center">{comparisonMode === 'overall' ? 'Average Visibility' : 'Query Result'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {overallVisibility.map((business, index) => {
                    const isTarget = business.name.toLowerCase() === businessName.toLowerCase();
                    
                    const getStat = (plat) => {
                      const stats = platformStats[plat] || [];
                      return stats.find(s => s.name.toLowerCase() === business.name.toLowerCase()) || { visibility: 0 };
                    };

                    const perplexityStat = getStat('perplexity');
                    const chatgptStat = getStat('chatgpt');
                    const geminiStat = getStat('gemini');

                    return (
                      <tr key={index} className={`hover:bg-gray-50/30 transition-all ${isTarget ? 'bg-[#5939fc]/5' : ''}`}>
                        
                        {/* Business Name */}
                        <td className="px-6 py-4">
                          <span className={`text-sm sm:text-base ${isTarget ? 'font-black text-[#5939fc]' : 'text-gray-900'}`}>
                            {business.name} {isTarget && <span className="ml-1.5 px-2 py-0.5 text-[9px] uppercase tracking-wider font-black bg-indigo-50 border border-indigo-100 text-[#5939fc] rounded">Target</span>}
                          </span>
                        </td>

                        {/* Perplexity column */}
                        <td className="px-6 py-4 text-center">
                          {comparisonMode === 'overall' ? (
                            <span className="font-extrabold text-gray-900">{perplexityStat.visibility}%</span>
                          ) : checkMention(business.name, 'perplexity', comparisonMode) ? (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs shadow-sm">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-black text-xs shadow-sm">
                              ✗
                            </span>
                          )}
                        </td>

                        {/* ChatGPT column */}
                        <td className="px-6 py-4 text-center">
                          {comparisonMode === 'overall' ? (
                            <span className="font-extrabold text-gray-900">{chatgptStat.visibility}%</span>
                          ) : checkMention(business.name, 'chatgpt', comparisonMode) ? (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs shadow-sm">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-black text-xs shadow-sm">
                              ✗
                            </span>
                          )}
                        </td>

                        {/* Gemini column */}
                        <td className="px-6 py-4 text-center">
                          {comparisonMode === 'overall' ? (
                            <span className="font-extrabold text-gray-900">{geminiStat.visibility}%</span>
                          ) : checkMention(business.name, 'gemini', comparisonMode) ? (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs shadow-sm">
                              ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-black text-xs shadow-sm">
                              ✗
                            </span>
                          )}
                        </td>

                        {/* Overall summary column */}
                        <td className="px-6 py-4 text-center">
                          {comparisonMode === 'overall' ? (
                            <div className="flex items-center justify-center space-x-2">
                              <span className="font-black text-gray-950">{business.visibility}%</span>
                              <div className="hidden sm:block w-14 bg-gray-100 border border-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-full ${business.visibility > 60 ? 'bg-emerald-500' : 'bg-[#336ffc]'}`} style={{ width: `${business.visibility}%` }} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-lg">
                              {[
                                checkMention(business.name, 'perplexity', comparisonMode),
                                checkMention(business.name, 'chatgpt', comparisonMode),
                                checkMention(business.name, 'gemini', comparisonMode)
                              ].filter(Boolean).length} / 3 recommended
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Platform Details Explorer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-lg font-black uppercase tracking-wider text-gray-950">Platform Content Explorer</h3>
            
            {/* Platform Selector Tabs */}
            <div className="flex items-center space-x-1.5 p-1 bg-gray-50 border border-gray-200 rounded-xl select-none">
              <button
                onClick={() => { setSelectedPlatform('perplexity'); setSelectedQueryIndex(0); }}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border ${selectedPlatform === 'perplexity' ? 'bg-cyan-50 border-cyan-100 text-cyan-605 shadow-sm' : 'text-gray-400 hover:text-gray-700 border-transparent'}`}
              >
                Perplexity
              </button>
              <button
                onClick={() => { setSelectedPlatform('chatgpt'); setSelectedQueryIndex(0); }}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border ${selectedPlatform === 'chatgpt' ? 'bg-emerald-50 border-emerald-100 text-emerald-605 shadow-sm' : 'text-gray-400 hover:text-gray-700 border-transparent'}`}
              >
                ChatGPT
              </button>
              <button
                onClick={() => { setSelectedPlatform('gemini'); setSelectedQueryIndex(0); }}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer border ${selectedPlatform === 'gemini' ? 'bg-blue-50 border-blue-100 text-blue-605 shadow-sm' : 'text-gray-400 hover:text-gray-700 border-transparent'}`}
              >
                Gemini
              </button>
            </div>
          </div>

          <div className="border border-gray-100 bg-white rounded-[2rem] p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
            
            {/* Queries selection pills */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Queries executed on {selectedPlatform.toUpperCase()}</span>
              <div className="flex flex-wrap gap-2">
                {visibilityData.queries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedQueryIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      selectedQueryIndex === idx
                        ? 'bg-indigo-50 text-[#5939fc] border-[#5939fc]/30 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {idx + 1}. {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Response Detail Pane */}
            {renderPlatformQueryDetail(visibilityData, selectedQueryIndex, selectedPlatform, businessName)}

          </div>
        </div>

        {/* 3. Debug & Scraper Log Accordion */}
        <div className="border border-gray-100 bg-white rounded-[2rem] overflow-hidden shadow-xl">
          <button
            onClick={() => setIsDebugExpanded(!isDebugExpanded)}
            className="w-full px-5 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-all focus:outline-none"
          >
            <div className="flex items-center space-x-2.5">
              <Terminal className="h-5 w-5 text-[#5939fc]" />
              <span className="text-base font-black text-gray-955 uppercase tracking-wider">Playwright Runner Debug Engine</span>
            </div>
            {isDebugExpanded ? <ChevronUp className="h-4.5 w-4.5 text-gray-500" /> : <ChevronDown className="h-4.5 w-4.5 text-gray-500" />}
          </button>

          {isDebugExpanded && (
            <div className="p-5 space-y-5">
              
              {/* Debug controls & filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-indigo-605" />
                  <span className="text-sm sm:text-base font-bold text-gray-800">Browser status:</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-wide">
                    SUCCESS (Session Closed)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-black uppercase text-gray-405">Filter logs:</span>
                  <div className="flex bg-white p-0.5 rounded-lg border border-gray-200 text-xs font-black uppercase tracking-wider">
                    {['all', 'perplexity', 'chatgpt', 'gemini', 'engine'].map(filterVal => (
                      <button
                        key={filterVal}
                        onClick={() => setLogFilter(filterVal)}
                        className={`px-2.5 py-1 rounded transition-all cursor-pointer ${logFilter === filterVal ? 'bg-indigo-50 text-indigo-605 font-black' : 'text-gray-400 hover:text-gray-650'}`}
                      >
                        {filterVal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Console Logs Terminal */}
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-gray-405 block">Orchestrator Execution Logs ({getFilteredLogs().length} entries)</span>
                <div className="h-44 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-600 overflow-y-auto space-y-1.5 select-text scrollbar-thin">
                  {getFilteredLogs().map((log, index) => {
                    let typeColor = 'text-gray-500';
                    if (log.type === 'error') typeColor = 'text-rose-650 font-extrabold';
                    if (log.type === 'warn') typeColor = 'text-amber-600';
                    return (
                      <div key={index} className="flex items-start space-x-2 select-text">
                        <span className="text-gray-400 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-indigo-655 shrink-0 select-none font-black">[{log.component}]</span>
                        <span className={`${typeColor} select-text`}>{log.message}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    );
  }

  return null;
}

function renderPlatformQueryDetail(visibilityData, index, platformKey, businessName) {
  const queryItem = visibilityData.platforms && visibilityData.platforms[index];
  const platformData = queryItem && queryItem.platforms[platformKey];

  if (!platformData) {
    return (
      <div className="p-8 border border-gray-200 bg-gray-50 rounded-xl text-center text-sm sm:text-base font-semibold text-gray-400 italic">
        No execution data recorded for this query on platform: "{platformKey}"
      </div>
    );
  }

  const responseText = platformData.response || '';
  const detections = platformData.detections || [];
  const sources = platformData.sources || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch border-t border-gray-150 pt-5">
      
      {/* Prose Response */}
      <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-605 flex items-center space-x-1">
          <FileText className="h-4 w-4" />
          <span>Extracted Prose Response</span>
        </span>
        <div className="flex-grow p-4 rounded-xl border border-gray-200 bg-[#fafbfc] text-base leading-relaxed text-gray-700 select-text whitespace-pre-wrap">
          {responseText}
        </div>
        
        {/* Cited Sources */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-black uppercase tracking-widest text-gray-405 flex items-center space-x-1">
            <Globe className="h-4 w-4" />
            <span>Citation Sources</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {sources.length > 0 ? (
              sources.map((url, uIdx) => (
                <a
                  key={uIdx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-sm font-bold text-indigo-600 rounded-lg flex items-center space-x-1"
                >
                  <span className="truncate max-w-[150px]">{url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  <ExternalLink className="h-3 w-3 text-gray-405" />
                </a>
              ))
            ) : (
              <span className="text-sm text-gray-400 italic font-semibold">No citation domains detected in the response text.</span>
            )}
          </div>
        </div>
      </div>

      {/* Mention detection math */}
      <div className="lg:col-span-2 space-y-2 flex flex-col justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-indigo-605 flex items-center space-x-1">
          <Search className="h-4 w-4" />
          <span>Mention Detections Mapping</span>
        </span>
        <div className="flex-grow p-4 rounded-xl border border-gray-200 bg-[#fafbfc] flex flex-col justify-center divide-y divide-gray-150 space-y-2.5">
          {detections.map((det, idx) => (
            <div key={idx} className="flex items-center justify-between text-base pt-2.5 first:pt-0">
              <span className={`font-black ${det.name.toLowerCase() === businessName.toLowerCase() ? 'text-indigo-655' : 'text-gray-800'}`}>
                {det.name}
              </span>
              {det.mentioned ? (
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-600 text-sm font-black uppercase tracking-wider">Mentioned</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-sm font-black text-gray-600">
                    Pos #{det.position}
                  </span>
                </div>
              ) : (
                <span className="text-rose-600 text-sm font-black uppercase tracking-wider">Not Mentioned</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
