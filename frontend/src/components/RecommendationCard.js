'use client';

import React, { useState } from 'react';
import PriorityBadge from './PriorityBadge';
import { RiFileList3Line, RiCheckLine, RiBrainLine } from 'react-icons/ri';

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  const { 
    category, 
    problem, 
    recommendation: solution, 
    priority, 
    impact, 
    insight, 
    actions = [],
    isAiGenerated = false
  } = recommendation;

  // Track checked actions to provide interactive checklist toggles
  const [checkedStates, setCheckedStates] = useState(
    new Array(actions.length).fill(false)
  );

  const toggleCheck = (idx) => {
    const nextStates = [...checkedStates];
    nextStates[idx] = !nextStates[idx];
    setCheckedStates(nextStates);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl bg-gray-950/40 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-5">
      
      {/* Top Header Row */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 uppercase tracking-widest text-[9px]">
              {category}
            </span>
            {isAiGenerated ? (
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[8px] font-bold border border-indigo-500/20 flex items-center space-x-0.5 animate-pulse">
                <RiBrainLine className="h-2.5 w-2.5" />
                <span>AI Enriched</span>
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full bg-gray-900 text-gray-500 text-[8px] font-bold border border-gray-800">
                Rule-Based
              </span>
            )}
          </div>
          <PriorityBadge priority={priority} />
        </div>

        <div className="space-y-1">
          <h4 className="text-lg font-black text-white leading-tight">
            {problem}
          </h4>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Fix: {solution}
          </div>
        </div>

        <div className="w-full h-px bg-gray-900" />

        {/* Explainability Insight */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium select-text">
            "{insight}"
          </p>
          <div className="text-[10px] text-gray-500 font-medium italic mt-1.5">
            <strong>Impact:</strong> {impact}
          </div>
        </div>

        <div className="w-full h-px bg-gray-900" />

        {/* Action checklist */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
            <RiFileList3Line className="h-4 w-4 text-indigo-400" />
            <span>Recommended Actions Blueprint:</span>
          </h5>

          <div className="space-y-2">
            {actions.map((act, idx) => {
              const isChecked = checkedStates[idx];
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className="w-full text-left p-3 rounded-xl border border-gray-900 bg-gray-950/20 hover:border-gray-850 hover:bg-gray-950/40 transition-all flex gap-3 items-start cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                >
                  <div className={`mt-0.5 h-4.5 w-4.5 shrink-0 rounded border flex items-center justify-center transition-all ${
                    isChecked 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'border-gray-800 hover:border-gray-700 bg-gray-950'
                  }`}>
                    {isChecked && <RiCheckLine className="h-3 w-3 font-bold" />}
                  </div>
                  <span className={`text-xs sm:text-sm leading-relaxed transition-all select-text ${
                    isChecked 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-300'
                  }`}>
                    {act}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
