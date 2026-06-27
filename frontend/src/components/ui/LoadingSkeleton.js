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
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center shrink-0">
              <Loader2 className="h-10 w-10 text-[#5939fc] animate-spin absolute" />
              <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center font-black text-xs text-[#5939fc]">
                {progressPercent}%
              </div>
            </div>
            <div>
              <h4 className="text-base font-black text-gray-950 uppercase tracking-wider flex items-center space-x-1.5">
                <Cpu className="h-4.5 w-4.5 text-[#5939fc]" />
                <span>Competitor Intelligence Enrichment</span>
              </h4>
              <p className="text-sm text-[#5939fc] font-bold leading-relaxed mt-0.5">
                Step: {getStatusLabel(enrichmentProgress.statusText)}
              </p>
            </div>
          </div>
          
          {/* Circular/Progress details */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="text-right hidden md:block">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Bulk Progress</div>
              <div className="text-lg font-black text-gray-900">{enrichmentProgress.current} / {enrichmentProgress.total} <span className="text-xs text-gray-500 font-medium">Competitors</span></div>
            </div>
            
            <div className="h-2.5 flex-grow md:w-48 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* 2. Current Competitor Scrape Status & Debug Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Active stats panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-md flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="space-y-1">
              <div className="text-xs font-black uppercase tracking-widest text-[#5939fc]">Now Processing</div>
              <h3 className="text-lg font-black text-gray-955 leading-tight truncate">
                {enrichmentProgress.competitor || 'Warming up engine...'}
              </h3>
            </div>

            {/* Real-time scraped attributes */}
            <div className="space-y-4 flex-grow pt-2">
              {/* Rating */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/70">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                  <Star className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                  <span>Google Rating</span>
                </div>
                <span className="text-sm font-black text-gray-900">
                  {enrichmentDetails.rating !== null ? `${enrichmentDetails.rating} / 5.0` : 'Extracting...'}
                </span>
              </div>

              {/* Reviews */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/70">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                  <Activity className="h-4.5 w-4.5 text-[#5939fc] shrink-0" />
                  <span>Review Count</span>
                </div>
                <span className="text-sm font-black text-gray-900">
                  {enrichmentDetails.reviewCount !== null ? `${enrichmentDetails.reviewCount.toLocaleString()} reviews` : 'Extracting...'}
                </span>
              </div>

              {/* Website */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/70">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                  <Globe className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Website Resolved</span>
                </div>
                <span className="text-sm font-black">
                  {enrichmentDetails.websiteFound ? (
                    <span className="text-emerald-600 flex items-center space-x-1">
                      <CheckCircle className="h-4.5 w-4.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Scanning...</span>
                  )}
                </span>
              </div>

              {/* Socials */}
              <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-2.5">
                <div className="flex items-center space-x-2 text-sm font-bold text-gray-500">
                  <Share2 className="h-4.5 w-4.5 text-purple-500 shrink-0" />
                  <span>Social Media Found</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {enrichmentDetails.socialsFound && enrichmentDetails.socialsFound.length > 0 ? (
                    enrichmentDetails.socialsFound.map((platform, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded bg-purple-55/20 border border-purple-100 text-xs font-bold text-purple-650 uppercase">
                        {platform}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic font-bold">No social links located yet...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Failures Alert (if any) */}
            {enrichmentDetails.failures && enrichmentDetails.failures.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-2 text-rose-600">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed font-bold">
                  {enrichmentDetails.failures[enrichmentDetails.failures.length - 1]}
                </div>
              </div>
            )}
          </div>

          {/* Right Debug Terminal Console */}
          <div className="lg:col-span-3 border border-gray-100 bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col justify-between relative">
            <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="px-5 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="h-5 w-5 text-[#5939fc]" />
                <span className="text-sm font-black text-gray-950 uppercase tracking-wider">Playwright Enrichment Console</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="p-5 flex-grow font-mono text-xs leading-relaxed text-gray-600 bg-gray-50/50 overflow-y-auto h-80 scrollbar-thin select-text space-y-2">
              {enrichmentLogs.length > 0 ? (
                enrichmentLogs.map((log, index) => {
                  let typeColor = 'text-gray-500';
                  if (log.type === 'error') typeColor = 'text-rose-600 font-extrabold';
                  if (log.type === 'warn') typeColor = 'text-amber-600';
                  
                  return (
                    <div key={index} className="flex items-start space-x-2 select-text">
                      <span className="text-gray-400 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-indigo-600 shrink-0 select-none font-bold">[{log.component}]</span>
                      <span className={`${typeColor} select-text`}>{log.message}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-400 italic">Initializing Playwright Chromium threads...</div>
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
      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 text-[#5939fc] animate-spin" />
          <div>
            <h4 className="text-sm font-bold text-gray-950">Automated Playwright Audits Active</h4>
            <p className="text-xs text-gray-500 font-semibold">Navigating Google, submitting search queries, and extracting business details...</p>
          </div>
        </div>
        <div className="h-2.5 w-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <div className="h-full bg-indigo-600 rounded-full animate-infinite-slide" style={{ width: '60%' }} />
        </div>
      </div>

      {/* 2. Main Overall meter vs breakdowns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <div className="md:col-span-2 bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="h-5 w-24 bg-gray-100 rounded-lg" />
          <div className="relative h-36 w-36 rounded-full border-[10px] border-gray-100 flex items-center justify-center">
            <div className="h-10 w-16 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-4 w-36 bg-gray-100 rounded-lg" />
        </div>
        <div className="md:col-span-3 bg-white p-6 rounded-[2rem] border border-gray-100 space-y-4 flex flex-col justify-center shadow-sm">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-4 w-10 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Action cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 space-y-4 shadow-sm">
            <div className="flex justify-between">
              <div className="h-4.5 w-20 bg-gray-100 rounded" />
              <div className="h-4.5 w-16 bg-gray-100 rounded" />
            </div>
            <div className="h-5 w-48 bg-gray-100 rounded" />
            <div className="h-px bg-gray-100 w-full" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-gray-100 rounded" />
              <div className="h-3.5 w-5/6 bg-gray-100 rounded" />
            </div>
            <div className="h-px bg-gray-100 w-full" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-11 bg-gray-50 rounded-xl border border-gray-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
