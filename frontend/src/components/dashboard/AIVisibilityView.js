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
  AlertTriangle
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
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
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

  // 1. IDLE / NOT STARTED STATE
  if (visibilityStatus === 'idle') {
    return (
      <div className="space-y-8 py-4 animate-fade-in">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Discoverability Engine</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight sm:text-4xl">
            Generative Engine Optimization
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
            Analyze whether AI search engines recommend your business when answering user queries. Check discoverability share against key local competitors.
          </p>
        </div>

        <div className="glass-panel border border-gray-900 bg-gray-950/40 rounded-2xl p-8 max-w-3xl shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="rounded-full h-16 w-16 bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg">
            <Radio className="h-8 w-8 text-indigo-400" />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-bold text-white leading-tight">Run Perplexity AI Visibility Audit</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              We will generate 5 realistic category and location-aware prompts, execute Playwright browser automated crawls on Perplexity AI, and calculate your search citation share.
            </p>
          </div>

          <div className="bg-gray-950 border border-gray-900/60 rounded-xl p-4 w-full text-left max-w-lg space-y-2 select-none">
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500">Scan parameters</div>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              <div className="text-gray-500">Target: <span className="text-gray-200">{businessName}</span></div>
              <div className="text-gray-500">Category: <span className="text-gray-200">{category}</span></div>
              <div className="text-gray-500">Location: <span className="text-gray-200">{city}</span></div>
            </div>
          </div>

          <button
            onClick={handleStartScan}
            className="glow-btn px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-lg flex items-center space-x-2 cursor-pointer transition-all border border-indigo-400/20"
          >
            <Play className="h-4.5 w-4.5 fill-current" />
            <span>Launch Perplexity Scan</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. RUNNING / SCANNING STATE
  if (visibilityStatus === 'running') {
    return (
      <div className="space-y-8 py-4 animate-fade-in">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-indigo-400">
            <Radio className="h-5 w-5 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Scraping Perplexity AI...</h3>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Active Visibility Audit</h2>
          <p className="text-xs text-gray-500 font-semibold leading-none">
            Querying prompts sequentially using headed Playwright automation. This takes about 30-45 seconds.
          </p>
        </div>

        {/* Loading progress bar */}
        <div className="glass-panel border border-gray-900 bg-gray-950/20 rounded-2xl p-6 max-w-3xl space-y-4">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
            <span className="text-indigo-400 animate-pulse flex items-center space-x-1.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Automating Chromium...</span>
            </span>
            <span className="text-gray-500">Headless: false (Headed debug active)</span>
          </div>

          <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-900">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full animate-loader-run" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Real-time console logger */}
        <div className="glass-panel border border-gray-900 bg-gray-950/45 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-4 bg-gray-950 border-b border-gray-900 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Playwright Perplexity Crawler Terminal</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800 text-[10px] font-bold text-gray-400">
              <Activity className="h-3 w-3 text-indigo-400 animate-pulse" />
              <span>RUNNING</span>
            </div>
          </div>
          
          <div className="p-4 bg-gray-950 font-mono text-[10px] leading-relaxed text-gray-400 h-64 overflow-y-auto space-y-1.5 select-text">
            {visibilityLogs.length > 0 ? (
              visibilityLogs.map((log, index) => {
                let typeColor = 'text-gray-400';
                if (log.type === 'error') typeColor = 'text-rose-500';
                if (log.type === 'warn') typeColor = 'text-amber-500';
                return (
                  <div key={index} className="flex items-start space-x-2 select-text">
                    <span className="text-gray-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-indigo-500 shrink-0 select-none font-bold">[{log.component}]</span>
                    <span className={`${typeColor} select-text`}>{log.message}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-600 italic">Initializing browser engine session, please wait...</div>
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
      <div className="space-y-8 py-4 animate-fade-in">
        <div className="glass-panel border border-rose-950 bg-rose-950/10 rounded-2xl p-8 max-w-lg mx-auto text-center flex flex-col items-center justify-center space-y-6 shadow-2xl">
          <div className="rounded-full h-14 w-14 bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">AI Visibility Audit Failed</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              The automated crawler failed to query Perplexity or complete response extraction.
            </p>
          </div>
          <button
            onClick={handleStartScan}
            className="px-5 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs font-bold text-white rounded-xl transition-all flex items-center space-x-2 shadow-md cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-gray-400" />
            <span>Retry Perplexity Scan</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. SUCCESS STATE / AUDIT DASHBOARD VIEW
  if (visibilityStatus === 'success' && visibilityData) {
    const visibilityArray = visibilityData.visibility || [];
    const targetBrandData = visibilityArray.find(v => v.name.toLowerCase() === businessName.toLowerCase()) || { mentioned: false, mentions: 0, visibility: 0, averagePosition: 0 };
    const competitorList = visibilityArray.filter(v => v.name.toLowerCase() !== businessName.toLowerCase());

    // Compute min/max competitor visibility to feed Insights
    const compVisibilities = competitorList.map(c => c.visibility);
    const minCompVis = compVisibilities.length > 0 ? Math.min(...compVisibilities) : 60;
    const maxCompVis = compVisibilities.length > 0 ? Math.max(...compVisibilities) : 80;
    const mentionedCompetitorsCount = competitorList.filter(c => c.mentions > 0).length;

    // Standard styling scores
    const getScoreBorderColor = (score) => {
      if (score >= 70) return 'border-emerald-500/35';
      if (score >= 40) return 'border-indigo-500/35';
      return 'border-rose-500/35';
    };

    const getScoreBadgeClass = (score) => {
      if (score >= 70) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      if (score >= 40) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    };

    return (
      <div className="space-y-8 py-4 animate-fade-in">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-indigo-400">
              <Radio className="h-4.5 w-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Perplexity AI Recommendations</h3>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Visibility Dashboard</h2>
            <p className="text-[11px] text-gray-500 font-semibold">
              Discoverability metrics computed from 5 live search scrapes. Location: <span className="text-gray-300">{city}</span>.
            </p>
          </div>

          <div className="flex space-x-3 self-start md:self-center">
            <button
              onClick={handleStartScan}
              className="px-4 py-2 border border-gray-800 hover:border-gray-700 bg-gray-950 hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Re-Run Audit</span>
            </button>
          </div>
        </div>

        {/* 1. Dashboard Insights Block (Step 10) */}
        <div className="glass-panel border border-indigo-950/40 bg-indigo-950/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          {/* Circular Score display */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center space-y-3 md:border-r md:border-gray-900/60 md:pr-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Your Visibility Score</span>
            
            <div className="relative h-28 w-28 flex items-center justify-center select-none">
              <svg className="h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" fill="transparent" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="6" />
                <circle cx="56" cy="56" r="46" fill="transparent" stroke={targetBrandData.visibility > 0 ? '#6366f1' : '#f43f5e'} strokeWidth="6" strokeDasharray="289" strokeDashoffset={289 - (targetBrandData.visibility / 100) * 289} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">{targetBrandData.visibility}%</span>
              </div>
            </div>
            
            <span className={`px-2.5 py-0.5 border text-[9px] font-extrabold uppercase tracking-wider rounded ${getScoreBadgeClass(targetBrandData.visibility)}`}>
              {targetBrandData.visibility > 70 ? 'High Discoverability' : targetBrandData.visibility > 0 ? 'Low Citations' : 'Not Recommended'}
            </span>
          </div>

          {/* Insights bullets list */}
          <div className="md:col-span-3 flex flex-col justify-center space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">GEO Audit Insights</h4>
            
            <ul className="space-y-2.5 text-xs font-semibold text-gray-300">
              <li className="flex items-start space-x-2">
                {targetBrandData.visibility > 0 ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4.5 w-4.5 text-rose-500 mt-0.5 shrink-0" />
                )}
                <span>You are {targetBrandData.visibility > 0 ? 'occasionally recommended' : 'not recommended'} by Perplexity.</span>
              </li>

              <li className="flex items-start space-x-2">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{mentionedCompetitorsCount} competitor{mentionedCompetitorsCount !== 1 ? 's are' : ' is'} consistently recommended.</span>
              </li>

              <li className="flex items-start space-x-2">
                <AlertCircle className={`h-4.5 w-4.5 ${targetBrandData.visibility > 0 ? 'text-amber-500' : 'text-rose-500'} mt-0.5 shrink-0`} />
                <span>Your visibility is {targetBrandData.visibility}%.</span>
              </li>

              <li className="flex items-start space-x-2">
                <Award className="h-4.5 w-4.5 text-indigo-400 mt-0.5 shrink-0" />
                <span>Competitor visibility ranges between {minCompVis}%-{maxCompVis}%.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Brand Comparisons Table (Step 9) */}
        <div className="space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">Share of AI Recommendations</h3>
          <div className="glass-panel border border-gray-900 bg-gray-950/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-900 bg-gray-950/60 text-[9px] font-extrabold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Business Name</th>
                    <th className="px-6 py-4">Mentioned by AI?</th>
                    <th className="px-6 py-4 text-center">Visibility %</th>
                    <th className="px-6 py-4 text-center">Mention Count</th>
                    <th className="px-6 py-4 text-center">Average Position</th>
                    <th className="px-6 py-4">Cited Sources</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 font-semibold text-gray-300">
                  {visibilityArray.map((business, index) => {
                    const isTarget = business.name.toLowerCase() === businessName.toLowerCase();
                    const hasSources = business.mentions > 0;
                    
                    // Match domain names
                    const compMatch = competitors.find(c => c.name.toLowerCase() === business.name.toLowerCase());
                    const website = isTarget ? '' : (compMatch ? compMatch.website : '');

                    return (
                      <tr key={index} className={`hover:bg-gray-900/20 transition-all ${isTarget ? 'bg-indigo-500/5' : ''}`}>
                        {/* Name */}
                        <td className="px-6 py-4">
                          <span className={`text-xs ${isTarget ? 'font-black text-indigo-400' : 'text-white'}`}>
                            {business.name} {isTarget && <span className="ml-1 px-1.5 py-0.5 text-[8px] uppercase tracking-wider font-extrabold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded">Target</span>}
                          </span>
                        </td>
                        
                        {/* Mentioned */}
                        <td className="px-6 py-4">
                          {business.mentioned ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>YES</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-rose-500 text-[10px] font-extrabold uppercase tracking-wide">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              <span>NO</span>
                            </span>
                          )}
                        </td>
                        
                        {/* Visibility % */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span className="font-bold text-white">{business.visibility}%</span>
                            <div className="hidden sm:block w-12 bg-gray-950 rounded-full h-1 overflow-hidden border border-gray-900">
                              <div className={`h-full ${business.visibility > 60 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${business.visibility}%` }} />
                            </div>
                          </div>
                        </td>
                        
                        {/* Mentions */}
                        <td className="px-6 py-4 text-center font-bold text-white">
                          {business.mentions}
                        </td>
                        
                        {/* Avg Position */}
                        <td className="px-6 py-4 text-center">
                          {business.mentions > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-300 font-bold">
                              #{business.averagePosition}
                            </span>
                          ) : (
                            <span className="text-gray-650 italic">-</span>
                          )}
                        </td>
                        
                        {/* Cited Sources */}
                        <td className="px-6 py-4">
                          {hasSources && website ? (
                            <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300">
                              <Globe className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[150px]">{website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : hasSources ? (
                            <span className="text-[10px] text-gray-500 italic">Citation directory</span>
                          ) : (
                            <span className="text-gray-650 italic">None resolved</span>
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

        {/* 3. Debug & Scraper Log Accordion (Step 11) */}
        <div className="glass-panel border border-gray-900 bg-gray-950/45 rounded-2xl overflow-hidden shadow-2xl">
          <button
            onClick={() => setIsDebugExpanded(!isDebugExpanded)}
            className="w-full px-5 py-4 bg-gray-950/70 border-b border-gray-900 flex items-center justify-between hover:bg-gray-950/90 transition-all focus:outline-none"
          >
            <div className="flex items-center space-x-2.5">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Perplexity Engine Debug Panel</span>
            </div>
            {isDebugExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {isDebugExpanded && (
            <div className="p-5 space-y-6">
              
              {/* Queries navigation row */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 block">Queries Run & Extracted Prose Answers</span>
                <div className="flex flex-wrap gap-2">
                  {visibilityData.queries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQueryIndex(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedQueryIndex === idx
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25 shadow-sm'
                          : 'bg-gray-950 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                      }`}
                    >
                      {idx + 1}. {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Query Details view */}
              {individualQueryData(visibilityData, selectedQueryIndex, businessName)}

              {/* Console Logs */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 block">Orchestrator Execution Logs</span>
                <div className="h-44 rounded-xl border border-gray-900 bg-gray-950 p-4 font-mono text-[10px] leading-relaxed text-gray-400 overflow-y-auto space-y-1.5 select-text scrollbar-thin">
                  {visibilityLogs.map((log, index) => {
                    let typeColor = 'text-gray-400';
                    if (log.type === 'error') typeColor = 'text-rose-500';
                    if (log.type === 'warn') typeColor = 'text-amber-500';
                    return (
                      <div key={index} className="flex items-start space-x-2 select-text">
                        <span className="text-gray-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-indigo-500 shrink-0 select-none font-bold">[{log.component}]</span>
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

/**
 * Helper to display individual query extracted answers & mentions mapping
 */
function individualQueryData(visibilityData, index, businessName) {
  const queryData = visibilityData.queriesData && visibilityData.queriesData[index];
  
  let simulatedAnswer = '';
  let detections = [];

  if (queryData) {
    simulatedAnswer = queryData.response_text || '';
    detections = queryData.detections || [];
  } else {
    // Fallback for legacy items or unexpected empty payloads
    const query = visibilityData.queries[index] || '';
    simulatedAnswer = `Search results audit response for prompt: "${query}"`;
    detections = (visibilityData.visibility || []).map(v => ({
      name: v.name,
      mentioned: v.visibility > 0,
      position: v.averagePosition > 0 ? Math.round(v.averagePosition) : null
    }));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch border-y border-gray-900 py-5">
      {/* Extracted Markdown Answer */}
      <div className="lg:col-span-3 space-y-1.5 flex flex-col justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center space-x-1">
          <FileText className="h-3 w-3" />
          <span>Extracted Prose Response</span>
        </span>
        <div className="flex-grow p-4 rounded-xl border border-gray-900 bg-gray-950/80 text-xs leading-relaxed text-gray-300 select-text whitespace-pre-wrap">
          {simulatedAnswer}
        </div>
      </div>

      {/* Mention detection math */}
      <div className="lg:col-span-2 space-y-1.5 flex flex-col justify-between">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center space-x-1">
          <Search className="h-3 w-3" />
          <span>Mention Detections Mapping</span>
        </span>
        <div className="flex-grow p-4 rounded-xl border border-gray-900 bg-gray-950/40 flex flex-col justify-center divide-y divide-gray-900/60 space-y-2.5">
          {detections.map((det, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs pt-2.5 first:pt-0">
              <span className={`font-semibold ${det.name.toLowerCase() === businessName.toLowerCase() ? 'text-indigo-400' : 'text-gray-300'}`}>
                {det.name}
              </span>
              {det.mentioned ? (
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">Mentioned</span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-950 border border-gray-900 text-[10px] font-bold text-gray-300">
                    Pos #{det.position}
                  </span>
                </div>
              ) : (
                <span className="text-rose-500 text-[10px] font-extrabold uppercase tracking-wider">Not Mentioned</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
