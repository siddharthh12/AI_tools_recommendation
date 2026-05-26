'use client';

import React from 'react';
import { RiBuilding4Line, RiFileList3Line, RiMedalLine, RiAlertLine } from 'react-icons/ri';

export default function CompetitorCard({ competitor }) {
  if (!competitor) return null;

  const { name, mentions, averagePosition, reasonsRankedHigher = [] } = competitor;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl bg-gray-950/40 hover:border-gray-700/40 transition-all flex flex-col justify-between">
      
      {/* Top Details Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400">
            <RiBuilding4Line className="h-5 w-5 animate-pulse" />
            <span className="text-sm font-black uppercase tracking-wider">Competitor Discovered</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
            Outperforming
          </span>
        </div>

        <div>
          <h4 className="text-xl font-black text-white truncate">{name}</h4>
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
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
