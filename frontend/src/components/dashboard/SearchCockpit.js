'use client';

import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Building2, 
  Layers, 
  MapPin, 
  Sparkles, 
  Cpu, 
  Activity, 
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
    triggerAuditScan({ business: bName, category: cat, city: ct }, true);
  };

  const categoriesList = [
    'Gym', 'Café', 'Hotel', 'Clinic', 'Restaurant', 'Dentist', 'Boutique'
  ];

  return (
    <div className="space-y-10 py-4 animate-fade-in text-gray-900">
      
      {/* 1. Header Hero Area */}
      <div className="space-y-4 max-w-xl">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5 text-[#5939fc]" />
          <span>Real Competitor Discovery Engine</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
          Discover Your <span className="bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] bg-clip-text text-transparent">Real Competitors</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-semibold">
          Automate headful browser search crawls, extract live Google Local Map Pack and organic business recommendations, and monitor browser logs step-by-step.
        </p>
      </div>

      {/* 2. Grid: Scan Inputs Card vs Capabilities Pitch */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        
        {/* Left Audits Card */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-[2rem] border border-gray-100 bg-white shadow-xl flex flex-col justify-between h-full space-y-6 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
            
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-gray-950">Discovery Search Coordinates</h3>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold">Enter your business details to trigger the Playwright crawler.</p>
            </div>

            <form onSubmit={handleLocalSubmit} className="space-y-5 flex-grow">
              
              {/* Business Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span>Brand Name</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isScanning}
                  placeholder="e.g. Be Strong Gym"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#336ffc] focus:ring-2 focus:ring-[#336ffc]/15 text-sm sm:text-base font-bold transition-all disabled:opacity-40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                    <Layers className="h-4 w-4 text-gray-400" />
                    <span>Category</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isScanning}
                    placeholder="e.g. Gym"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#336ffc] focus:ring-2 focus:ring-[#336ffc]/15 text-sm sm:text-base font-bold transition-all disabled:opacity-40"
                  />
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center space-x-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isScanning}
                    placeholder="e.g. Vikhroli, Mumbai"
                    value={ct}
                    onChange={(e) => setCt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#336ffc] focus:ring-2 focus:ring-[#336ffc]/15 text-sm sm:text-base font-bold transition-all disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Quick tags presets helper */}
              <div className="space-y-2 pt-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400 block">Quick Category Presets</span>
                <div className="flex flex-wrap gap-2">
                  {categoriesList.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      disabled={isScanning}
                      onClick={() => setCat(tag)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#336ffc]/30 hover:bg-[#336ffc]/5 bg-white text-xs font-bold text-gray-655 hover:text-[#336ffc] cursor-pointer transition-all disabled:opacity-30"
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
                className="w-full px-5 py-4 rounded-xl bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] hover:opacity-95 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-45 disabled:cursor-not-allowed hover:shadow-indigo-500/10 border border-indigo-400/10"
              >
                <Search className="h-5 w-5" />
                <span>{isScanning ? 'Running Automated Playwright Scrapes...' : 'Execute Competitor Discovery'}</span>
                {!isScanning && <ArrowRight className="h-5 w-5" />}
              </button>

            </form>

          </div>
        </div>

        {/* Right Product Pitch cards */}
        <div className="lg:col-span-2 flex flex-col justify-between h-full space-y-4">
          
          <div className="p-6 rounded-2xl border border-gray-100 bg-white flex gap-4 items-start flex-grow shadow-md hover:shadow-lg hover:border-gray-200/80 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-[#5939fc] border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-950">1. Headful Playwright Scraper</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold mt-1">
                Launches a visible Chromium instance on-screen, queries Google, waits for nodes dynamically, and avoids anti-bot firewalls with human slowMo inputs.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 bg-white flex gap-4 items-start flex-grow shadow-md hover:shadow-lg hover:border-gray-200/80 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-950">2. Real-Time Console Panel</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold mt-1">
                Gives complete visibility into queries triggered, records extracted, crawl failures, and Playwright browser stages inside an interactive shell widget.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-100 bg-white flex gap-4 items-start flex-grow shadow-md hover:shadow-lg hover:border-gray-200/80 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/5 blur-xl pointer-events-none rounded-full" />
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-sm">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-gray-955">3. Local Map Pack Extraction</h4>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold mt-1">
                Pulls real local map listing cards, identifies corresponding competitor websites, handles locations, and strips duplicate registry entries.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
