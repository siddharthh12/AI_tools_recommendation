'use client';

import React from 'react';
import { getScoreColor } from '@/lib/utils';

export default function VisibilityMeter({ score }) {
  const scoreStyle = getScoreColor(score);

  // Circumference calculations for SVG circle animation (R=50 => C=314.16)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        AI Visibility Score
      </h3>

      <div className="relative h-40 w-40 flex items-center justify-center">
        {/* Animated Radial Arc SVG */}
        <svg className="h-full w-full transform -rotate-90">
          {/* Base track circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="rgba(31, 41, 55, 0.4)"
            strokeWidth="10"
            className="transition-all"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="url(#indigo-purple-grad)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="indigo-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center score readout */}
        <div className="absolute text-center">
          <div className="text-4xl font-black text-white tracking-tighter">
            {score}<span className="text-xs text-gray-500 font-normal">/100</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${scoreStyle.text}`}>
            {scoreStyle.label}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-900" />

      <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
        This score measures your discoverability on Perplexity AI search recommendations, Google directories, and site health algorithms.
      </p>
    </div>
  );
}
