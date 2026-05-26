'use client';

import React from 'react';
import { Compass, Sparkles, Trophy, ListTodo, ShieldCheck } from 'lucide-react';

export default function EmptyResults({ onQuickCtaClick }) {
  return (
    <div className="w-full flex flex-col justify-center items-center py-6">
      
      {/* 1. Large Ambient Compass Illustration */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute -z-10 h-28 w-28 rounded-full bg-indigo-500/5 blur-[30px]" />
        <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center animate-pulse">
          <Compass className="h-8 w-8" />
        </div>
      </div>

      {/* 2. Text Prompts */}
      <div className="text-center space-y-2.5 max-w-md mx-auto mb-10">
        <h3 className="text-lg sm:text-xl font-black text-white">No Discoverability Reports Active</h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
          Configure your business coordinates inside the **Crawl Audit Cockpit** on the left, then trigger a search. We will scrape AI engines in real-time, compute visibility index metrics, analyze competitor signals, and render optimization playbooks.
        </p>
      </div>

      {/* 3. Dynamic Quick Recalls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <button
          onClick={() => onQuickCtaClick({ business: "Gold's Gym", category: "Gym", city: "Mumbai" })}
          className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/20 text-left hover:border-gray-800 hover:bg-indigo-950/5 transition-all cursor-pointer group flex items-start space-x-3"
        >
          <div className="mt-1 h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-105 transition-all">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-all">Recall: Gold's Gym Audit</h4>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Vertical: Gym | City: Mumbai</p>
          </div>
        </button>

        <button
          onClick={() => onQuickCtaClick({ business: "Initech Café", category: "Café", city: "Bangalore" })}
          className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/20 text-left hover:border-gray-800 hover:bg-indigo-950/5 transition-all cursor-pointer group flex items-start space-x-3"
        >
          <div className="mt-1 h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-all">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-all">Recall: Initech Café Audit</h4>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Vertical: Café | City: Bangalore</p>
          </div>
        </button>
      </div>

      {/* 4. Product Benefits List */}
      <div className="mt-12 w-full max-w-xl border-t border-gray-900 pt-8">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-6">AI Discoverability Capabilities</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-400">
          <div className="flex items-start space-x-2.5">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
            <p className="leading-relaxed font-semibold">
              <strong>Playwright Scrapers:</strong> Automates real Chromium search navigation across leading engines.
            </p>
          </div>

          <div className="flex items-start space-x-2.5">
            <Trophy className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <p className="leading-relaxed font-semibold">
              <strong>0–100 Scores:</strong> Dynamic weight allocations matching citations, positions, star reviews, and DA.
            </p>
          </div>

          <div className="flex items-start space-x-2.5">
            <Sparkles className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            <p className="leading-relaxed font-semibold">
              <strong>Competitor Benchmarks:</strong> Detailed comparisons showing strengths and citation index gaps.
            </p>
          </div>

          <div className="flex items-start space-x-2.5">
            <ListTodo className="h-4.5 w-4.5 text-amber-400 shrink-0" />
            <p className="leading-relaxed font-semibold">
              <strong>Action Checklists:</strong> Priority-ordered optimization templates mapped directly to signals.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
