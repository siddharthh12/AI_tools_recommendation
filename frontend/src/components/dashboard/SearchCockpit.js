'use client';

import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Building2, 
  Layers, 
  MapPin, 
  Sparkles, 
  Compass, 
  Cpu, 
  PieChart, 
  CheckSquare,
  Search,
  ArrowRight
} from 'lucide-react';

export default function SearchCockpit() {
  const {
    triggerAuditScan,
    status,
    searchHistory
  } = useDashboard();

  // Local form coordinates
  const [bName, setBName] = useState('');
  const [cat, setCat] = useState('');
  const [ct, setCt] = useState('');

  const isScanning = status === 'scanning';

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    if (!bName || !cat || !ct || isScanning) return;
    triggerAuditScan({ business: bName, category: cat, city: ct });
  };

  const categoriesList = [
    'Gym', 'Café', 'Hotel', 'SaaS', 'Clinic', 'Restaurant', 'Dentist', 'Boutique'
  ];

  return (
    <div className="space-y-10 py-2">
      
      {/* 1. Header Hero Area */}
      <div className="space-y-3.5 max-w-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5" />
          <span>GEO / AEO Discoverability Audits</span>
        </div>
        
        <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight sm:text-4xl">
          Is AI Recommending Your Brand?
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium">
          Automate search crawls in real-time, compute visibility index metrics, map competitive citation share, and extract prioritized optimization playbooks.
        </p>
      </div>

      {/* 2. Grid: Scan Inputs Card vs Capabilities Pitch */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        
        {/* Left Audits Card */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-900 bg-gray-950/40 shadow-2xl flex flex-col justify-between h-full space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Brand Scan Coordinates</h3>
              <p className="text-[11px] text-gray-500 font-semibold">Enter your business details to trigger playbooks crawls.</p>
            </div>

            <form onSubmit={handleLocalSubmit} className="space-y-4 flex-grow">
              {/* Business Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center space-x-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gray-500" />
                  <span>Business Brand Name</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isScanning}
                  placeholder="e.g. Gold's Gym"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-900 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 text-xs sm:text-sm font-semibold transition-all disabled:opacity-40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center space-x-1.5">
                    <Layers className="h-3.5 w-3.5 text-gray-500" />
                    <span>Vertical Category</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isScanning}
                    placeholder="e.g. Gym"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-900 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 text-xs sm:text-sm font-semibold transition-all disabled:opacity-40"
                  />
                </div>

                {/* City Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span>Geographical City</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isScanning}
                    placeholder="e.g. Mumbai"
                    value={ct}
                    onChange={(e) => setCt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-900 bg-gray-950 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 text-xs sm:text-sm font-semibold transition-all disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Quick tags presets helper */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-600">Quick Vertical Templates</span>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      disabled={isScanning}
                      onClick={() => setCat(tag)}
                      className="px-2.5 py-1 rounded-lg border border-gray-900 hover:border-gray-800 bg-gray-950 text-[10px] font-bold text-gray-400 hover:text-white cursor-pointer transition-all disabled:opacity-30"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!bName || !cat || !ct || isScanning}
                className="w-full glow-btn px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-45 disabled:cursor-not-allowed hover:shadow-indigo-500/15"
              >
                <Search className="h-4 w-4" />
                <span>{isScanning ? 'Running Automated Playwright Audits...' : 'Execute Discoverability Scan'}</span>
                {!isScanning && <ArrowRight className="h-4.5 w-4.5" />}
              </button>

            </form>

          </div>
        </div>

        {/* Right Product Pitch cards list */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full space-y-4">
          
          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex gap-4 items-start flex-grow">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">1. Playwright AI Scraper</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold mt-1">
                Launches lightweight Chromium instances, executes dynamic context submissions, navigates Perplexity AI pages, and extracts markdown-rich replies.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex gap-4 items-start flex-grow">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <PieChart className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">2. Heuristic Scoring (0–100)</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold mt-1">
                Calculates brand mention rates (40%), linear decay average position rank (30%), star reviews quality (15%), and technical domain SEO authority checks (15%).
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex gap-4 items-start flex-grow">
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">3. Actionable Checklist Playbook</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold mt-1">
                Sweeps metric gaps against strict thresholds and outputs organized checklists targeting SEO links, star reviews QR campaigns, and social discussions.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
