'use client';

import React, { useEffect, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Loader2, 
  Star, 
  Globe, 
  Share2, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  Activity, 
  CheckCircle 
} from 'lucide-react';

export default function LoadingSkeleton() {
  const { 
    status, 
    enrichmentProgress, 
    enrichmentDetails, 
    enrichmentLogs 
  } = useDashboard();

  const terminalEndRef = useRef(null);

  // Auto-scroll the terminal to the bottom as new logs stream in
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [enrichmentLogs]);

  const getStatusLabel = (step) => {
    switch (step) {
      case 'starting':
        return 'Initializing Chromium Browser...';
      case 'extracting_google':
        return 'Scraping Google Maps Profiles...';
      case 'extracting_website':
        return 'Resolving Official Domain...';
      case 'extracting_socials':
        return 'Scanning Website Metadata & Socials...';
      case 'saving':
        return 'Validating & Persisting Intelligence...';
      case 'done':
        return 'Finished Enrichment!';
      default:
        return 'Analyzing Competitor Details...';
    }
  };

  const getPercentage = () => {
    if (!enrichmentProgress.total) return 0;
    return Math.round((enrichmentProgress.current / enrichmentProgress.total) * 100);
  };

  if (status === 'enriching') {
    const progressPercent = getPercentage();
    
    return (
      <div className="w-full space-y-8 animate-fade-in py-2">
        {/* 1. Header Progress Indicator */}
        <div className="glass-panel p-6 rounded-2xl border border-indigo-900/30 bg-gray-950/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center shrink-0">
              <Loader2 className="h-10 w-10 text-indigo-500 animate-spin absolute" />
              <div className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center font-black text-[10px] text-indigo-400">
                {progressPercent}%
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>Competitor Intelligence Enrichment</span>
              </h4>
              <p className="text-xs text-indigo-300 font-semibold leading-relaxed mt-0.5">
                Step: {getStatusLabel(enrichmentProgress.statusText)}
              </p>
            </div>
          </div>
          
          {/* Circular/Progress details */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="text-right hidden md:block">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Bulk Progress</div>
              <div className="text-lg font-black text-white">{enrichmentProgress.current} / {enrichmentProgress.total} <span className="text-xs text-gray-500 font-medium">Competitors</span></div>
            </div>
            
            <div className="h-2 flex-grow md:w-48 bg-gray-900 rounded-full overflow-hidden border border-gray-900 shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* 2. Current Competitor Scrape Status & Debug Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Active stats panel */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/40 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-1">
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400">Now Processing</div>
              <h3 className="text-base font-bold text-white leading-tight truncate">
                {enrichmentProgress.competitor || 'Warming up engine...'}
              </h3>
            </div>

            {/* Real-time scraped attributes */}
            <div className="space-y-4 flex-grow pt-2">
              {/* Rating */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-900 bg-gray-950/40">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                  <Star className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Google Rating</span>
                </div>
                <span className="text-xs font-black text-white">
                  {enrichmentDetails.rating !== null ? `${enrichmentDetails.rating} / 5.0` : 'Extracting...'}
                </span>
              </div>

              {/* Reviews */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-900 bg-gray-950/40">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                  <Activity className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Review Count</span>
                </div>
                <span className="text-xs font-black text-white">
                  {enrichmentDetails.reviewCount !== null ? `${enrichmentDetails.reviewCount.toLocaleString()} reviews` : 'Extracting...'}
                </span>
              </div>

              {/* Website */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-gray-900 bg-gray-950/40">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                  <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Website Resolved</span>
                </div>
                <span className="text-xs font-black">
                  {enrichmentDetails.websiteFound ? (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-gray-500 italic">Scanning...</span>
                  )}
                </span>
              </div>

              {/* Socials */}
              <div className="p-3 rounded-xl border border-gray-900 bg-gray-950/40 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                  <Share2 className="h-4 w-4 text-purple-400 shrink-0" />
                  <span>Social Media Found</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {enrichmentDetails.socialsFound && enrichmentDetails.socialsFound.length > 0 ? (
                    enrichmentDetails.socialsFound.map((platform, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-400 uppercase">
                        {platform}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-gray-600 italic">No social links located yet...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Failures Alert (if any) */}
            {enrichmentDetails.failures && enrichmentDetails.failures.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 flex items-start space-x-2 text-rose-400">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-[10px] leading-relaxed font-semibold">
                  {enrichmentDetails.failures[enrichmentDetails.failures.length - 1]}
                </div>
              </div>
            )}
          </div>

          {/* Right Debug Terminal Console */}
          <div className="lg:col-span-3 glass-panel border border-gray-900 bg-gray-950/45 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="px-5 py-4 bg-gray-950/70 border-b border-gray-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                <span className="text-xs font-black text-white uppercase tracking-wider">Playwright Enrichment Console</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="p-5 flex-grow font-mono text-[10px] leading-relaxed text-gray-400 overflow-y-auto h-80 scrollbar-thin select-text space-y-2">
              {enrichmentLogs.length > 0 ? (
                enrichmentLogs.map((log, index) => {
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
                <div className="text-gray-600 italic">Initializing Playwright Chromium threads...</div>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic Google search crawling skeleton (Phase 6 discovery layout)
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* 1. Header spinner indicator */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          <div>
            <h4 className="text-sm font-bold text-white">Automated Playwright Audits Active</h4>
            <p className="text-[11px] text-gray-500 font-medium">Navigating Google, submitting search queries, and extracting business details...</p>
          </div>
        </div>
        <div className="h-2 w-32 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-infinite-slide" style={{ width: '60%' }} />
        </div>
      </div>

      {/* 2. Main Overall meter vs breakdowns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-gray-900 flex flex-col items-center justify-center space-y-4">
          <div className="h-4.5 w-24 bg-gray-900 rounded-lg" />
          <div className="relative h-36 w-36 rounded-full border-8 border-gray-900 flex items-center justify-center">
            <div className="h-10 w-16 bg-gray-900 rounded-lg" />
          </div>
          <div className="h-3.5 w-36 bg-gray-900 rounded-lg" />
        </div>
        <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-gray-900 space-y-4 flex flex-col justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3.5 w-24 bg-gray-900 rounded" />
                <div className="h-3.5 w-10 bg-gray-900 rounded" />
              </div>
              <div className="h-2.5 w-full bg-gray-900 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Action cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-gray-900 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-900 rounded" />
              <div className="h-4 w-16 bg-gray-900 rounded" />
            </div>
            <div className="h-5 w-48 bg-gray-900 rounded" />
            <div className="h-px bg-gray-900 w-full" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-900 rounded" />
              <div className="h-3 w-5/6 bg-gray-900 rounded" />
            </div>
            <div className="h-px bg-gray-900 w-full" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-10 bg-gray-905 rounded-xl border border-gray-900/60" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
