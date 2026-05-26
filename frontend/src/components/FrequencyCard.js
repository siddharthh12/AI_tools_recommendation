'use client';

import React from 'react';
import { getScoreColor } from '@/lib/utils';
import { RiFileList3Line, RiMedalLine, RiAwardLine, RiAlertLine } from 'react-icons/ri';

export default function FrequencyCard({ businessName, frequencyData, totalQueries }) {
  // Normalize brand name key
  const searchKey = Object.keys(frequencyData || {}).find(
    (k) => k.toLowerCase() === businessName.toLowerCase()
  );

  const brandStats = searchKey ? frequencyData[searchKey] : null;

  // Calculate stats parameters
  const mentions = brandStats ? brandStats.mentions : 0;
  const avgPosition = brandStats ? brandStats.averagePosition : 0;
  
  // Calculate visibility percentage score (100% if appears in all queries, etc.)
  const visibilityPercentage = totalQueries > 0 
    ? Math.round((mentions / totalQueries) * 100) 
    : 0;

  // Determine standard colors and labels using utility
  const scoreStyle = getScoreColor(visibilityPercentage);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl space-y-6">
      
      {/* Casing Brand Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20">
            Platform Citations Summary
          </span>
        </div>
        <h3 className="text-2xl font-black text-white mt-1.5 truncate">
          {businessName}
        </h3>
      </div>

      {/* Grid Display Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Discoverability Share */}
        <div className="glass-panel p-4 rounded-xl border border-gray-800 hover:border-gray-700/40 transition-all flex items-center space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <RiAwardLine className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{visibilityPercentage}%</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">AI Search Share</div>
          </div>
        </div>

        {/* Metric 2: Citation Frequency */}
        <div className="glass-panel p-4 rounded-xl border border-gray-800 hover:border-gray-700/40 transition-all flex items-center space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <RiFileList3Line className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {mentions}<span className="text-xs text-gray-500 font-normal"> / {totalQueries}</span>
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Query Mentions</div>
          </div>
        </div>

        {/* Metric 3: Average Citation Position */}
        <div className="glass-panel p-4 rounded-xl border border-gray-800 hover:border-gray-700/40 transition-all flex items-center space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <RiMedalLine className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {mentions > 0 ? `#${avgPosition}` : 'N/A'}
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Avg Ranking Spot</div>
          </div>
        </div>

      </div>

      {/* Grade Status Panel */}
      <div className={`p-4 rounded-xl border flex items-center space-x-3.5 ${scoreStyle.bg}`}>
        {mentions > 0 ? (
          <>
            <RiAwardLine className={`h-6 w-6 shrink-0 ${scoreStyle.text}`} />
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${scoreStyle.text}`}>
                {scoreStyle.label}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Your business appears in **{visibilityPercentage}%** of search crawl cycles with an average rank of **#{avgPosition}**.
              </p>
            </div>
          </>
        ) : (
          <>
            <RiAlertLine className="h-6 w-6 shrink-0 text-rose-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Not Discovered
              </span>
              <p className="text-xs text-gray-400 mt-1">
                Perplexity AI did not recommend your business in any of the search queries. Optimize your local search schemas and back-links.
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
