'use client';

import React from 'react';
import { getScoreColor } from '@/lib/utils';
import { 
  RiFileList3Line, 
  RiMedalLine, 
  RiStarLine, 
  RiGlobalLine 
} from 'react-icons/ri';

export default function BreakdownChart({ breakdown }) {
  if (!breakdown) return null;

  const metrics = [
    {
      key: 'frequency',
      name: 'Mention Frequency',
      score: breakdown.frequency || 0,
      weight: '40%',
      desc: 'Citations rate in Perplexity search runs',
      icon: RiFileList3Line,
      colorClass: 'bg-indigo-500'
    },
    {
      key: 'ranking',
      name: 'Ranking Position',
      score: breakdown.ranking || 0,
      weight: '30%',
      desc: 'Average list position in recommend paths',
      icon: RiMedalLine,
      colorClass: 'bg-amber-500'
    },
    {
      key: 'reviews',
      name: 'Local Review Signals',
      score: breakdown.reviews || 0,
      weight: '15%',
      desc: 'Blends star rating quality & count volume',
      icon: RiStarLine,
      colorClass: 'bg-emerald-500'
    },
    {
      key: 'authority',
      name: 'Website SEO Authority',
      score: breakdown.authority || 0,
      weight: '15%',
      desc: 'Evaluates DA index, keywords, and SSL HTTPS',
      icon: RiGlobalLine,
      colorClass: 'bg-purple-500'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl space-y-6">
      
      {/* Header Description */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Score Breakdown &amp; Factors
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Heuristic weighting ratios explaining overall visibility indexes.
        </p>
      </div>

      <div className="space-y-5">
        {metrics.map((item) => {
          const Icon = item.icon;
          const scoreStyle = getScoreColor(item.score);

          return (
            <div key={item.key} className="space-y-2">
              
              {/* Row Stats Meta */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 border border-gray-800 text-gray-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase ml-1.5 bg-gray-900 px-1 py-0.5 rounded border border-gray-850">
                      Weight: {item.weight}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline space-x-0.5 font-mono">
                  <span className={`text-base font-black ${scoreStyle.text}`}>{item.score}</span>
                  <span className="text-xs text-gray-600">/100</span>
                </div>
              </div>

              {/* Progress track bar */}
              <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${item.colorClass}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              {/* Explainer tag description */}
              <div className="text-[10px] text-gray-500 pl-9">
                {item.desc}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
