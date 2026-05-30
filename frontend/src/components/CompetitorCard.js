'use client';

import React from 'react';
import { 
  RiBuilding4Line, 
  RiFileList3Line, 
  RiMedalLine, 
  RiAlertLine, 
  RiBrainLine, 
  RiSparklingLine,
  RiThumbUpLine,
  RiThumbDownLine
} from 'react-icons/ri';

export default function CompetitorCard({ competitor }) {
  if (!competitor) return null;

  const { 
    name, 
    mentions, 
    averagePosition, 
    reasonsRankedHigher = [],
    competitorStrengths = [],
    targetWeaknesses = [],
    businessSummary = '',
    isAiGenerated = false,
    website = ''
  } = competitor;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl bg-gray-950/40 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4">
      
      {/* Top Details Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400">
            <RiBuilding4Line className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-black uppercase tracking-wider">Competitor Discovered</span>
          </div>
          
          {isAiGenerated ? (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/30 flex items-center space-x-1 animate-pulse">
              <RiBrainLine className="h-3 w-3" />
              <span>AI Reasoning Active</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px] font-bold border border-gray-700">
              Deterministic Rules
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-xl font-black text-white truncate max-w-[60%]">{name}</h4>
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] sm:text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline truncate"
              >
                {website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <RiFileList3Line className="h-3.5 w-3.5 text-gray-400" />
              <span>Citations: <strong>{mentions} runs</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <RiMedalLine className="h-3.5 w-3.5 text-gray-400" />
              <span>Avg Spot: <strong>#{averagePosition}</strong></span>
            </span>
          </div>
        </div>

        {/* AI-Generated Business Summary */}
        {businessSummary && (
          <div className="p-3.5 rounded-xl border border-indigo-900/30 bg-indigo-950/15 text-xs text-indigo-200 leading-relaxed shadow-inner font-medium select-text relative">
            <span className="absolute top-1 right-2 text-[9px] font-black text-indigo-400/50 uppercase tracking-widest flex items-center gap-0.5">
              <RiSparklingLine className="h-2.5 w-2.5" /> Summary
            </span>
            <p className="pr-12">"{businessSummary}"</p>
          </div>
        )}

        <div className="w-full h-px bg-gray-900" />

        {/* Reasons Ranked Higher section */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
            <RiAlertLine className="h-4 w-4 text-rose-500 shrink-0" />
            <span>Why they perform better:</span>
          </h5>
          <ul className="space-y-2 pl-1">
            {reasonsRankedHigher.map((reason, idx) => (
              <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2 leading-relaxed">
                <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                <span className="select-text">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Strengths & Weaknesses (AI Enriched) */}
        {isAiGenerated && (competitorStrengths.length > 0 || targetWeaknesses.length > 0) && (
          <>
            <div className="w-full h-px bg-gray-900" />
            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {competitorStrengths.length > 0 && (
                <div className="space-y-1.5">
                  <h6 className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <RiThumbUpLine className="h-3.5 w-3.5" /> Competitor Strengths
                  </h6>
                  <ul className="space-y-1 pl-1">
                    {competitorStrengths.slice(0, 2).map((str, idx) => (
                      <li key={idx} className="text-[11px] text-gray-400 flex items-start gap-1 leading-relaxed select-text">
                        <span className="text-emerald-500/70">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {targetWeaknesses.length > 0 && (
                <div className="space-y-1.5">
                  <h6 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <RiThumbDownLine className="h-3.5 w-3.5" /> Your Gaps vs Them
                  </h6>
                  <ul className="space-y-1 pl-1">
                    {targetWeaknesses.slice(0, 2).map((weak, idx) => (
                      <li key={idx} className="text-[11px] text-gray-400 flex items-start gap-1 leading-relaxed select-text">
                        <span className="text-amber-500/70">•</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
