'use client';

import React from 'react';
import { RiLightbulbFlashLine, RiCheckboxCircleLine, RiArrowRightLine } from 'react-icons/ri';

export default function RecommendationPanel({ recommendations }) {
  if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl space-y-5 bg-indigo-950/5">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <RiLightbulbFlashLine className="text-amber-400 h-5 w-5 animate-pulse" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Actionable Competitor Defeat Blueprint
        </h3>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        Based on gaps identified between your business and competitors, execute these structural tasks to increase citation share and rank position:
      </p>

      {/* Recommendations Checklists */}
      <div className="space-y-3.5">
        {recommendations.map((rec, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-xl border border-gray-850 bg-gray-950/40 hover:border-gray-850/80 transition-all flex gap-3.5 items-start group"
          >
            <div className="mt-0.5 shrink-0">
              <RiCheckboxCircleLine className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-all" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Action Task #{idx + 1}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed select-text">
                {rec}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
