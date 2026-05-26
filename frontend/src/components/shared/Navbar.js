'use client';

import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Sun, 
  Moon, 
  History, 
  ChevronDown, 
  User, 
  LogOut,
  ChevronRight,
  Sparkles,
  Terminal,
  Grid
} from 'lucide-react';

export default function Navbar() {
  const {
    activeSection,
    theme,
    toggleTheme,
    searchHistory,
    triggerAuditScan,
    status,
    businessName
  } = useDashboard();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Map section key names to clean display text
  const sectionLabels = {
    home: 'Crawl Audit Cockpit',
    visibility: 'AI Visibility score',
    competitors: 'Competitor Gaps',
    recommendations: 'Strategic Optimization Playbook',
    analytics: 'History & Trends'
  };

  const handleRecallSearch = (coords) => {
    setIsHistoryOpen(false);
    triggerAuditScan(coords);
  };

  return (
    <header className="h-16 border-b border-gray-900 bg-gray-950 px-6 flex items-center justify-between shrink-0 select-none">
      
      {/* 1. Breadcrumbs Indicator */}
      <div className="flex items-center space-x-2 text-xs font-bold tracking-wide">
        <span className="text-gray-500">Dashboard</span>
        <ChevronRight className="h-3 w-3 text-gray-700" />
        <span className="text-indigo-400 capitalize">{sectionLabels[activeSection] || activeSection}</span>
        
        {status === 'success' && businessName && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-700" />
            <span className="px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-[10px] text-gray-300 font-extrabold max-w-[120px] truncate" title={businessName}>
              {businessName}
            </span>
          </>
        )}
      </div>

      {/* 2. Top-Right Utilities Grids */}
      <div className="flex items-center space-x-4">
        
        {/* Recents Searches recalls Dropdown */}
        {searchHistory && searchHistory.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="px-3 py-1.5 rounded-xl border border-gray-800 bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
            >
              <History className="h-3.5 w-3.5" />
              <span>Recent Scans</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
            </button>

            {isHistoryOpen && (
              <>
                {/* Overlay backdrop block */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsHistoryOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-64 bg-gray-950 border border-gray-850 rounded-2xl shadow-2xl py-3 px-2 z-20 space-y-1">
                  <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 border-b border-gray-900 mb-2 flex items-center justify-between">
                    <span>Recent Scans Recall</span>
                    <Sparkles className="h-3 w-3 text-indigo-400" />
                  </div>
                  
                  {searchHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRecallSearch(item)}
                      className="w-full text-left p-2 rounded-xl hover:bg-gray-900 transition-all flex items-start space-x-2.5 cursor-pointer group"
                    >
                      <div className="mt-0.5 h-6 w-6 rounded-lg bg-gray-900 border border-gray-800 text-gray-500 group-hover:text-indigo-400 group-hover:border-indigo-500/20 flex items-center justify-center transition-all shrink-0">
                        <Terminal className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-all truncate leading-tight">
                          {item.business}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-semibold mt-0.5 leading-none">
                          {item.category} • {item.city}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Light/Dark mode toggler */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl border border-gray-800 hover:border-gray-700 bg-gray-950 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-md"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-indigo-400" />
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-gray-900" />

        {/* User Account Mock profile card */}
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-850 flex items-center justify-center text-gray-300 shadow-inner select-none shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden sm:block text-left select-none">
            <div className="text-xs font-black text-white leading-none">Admin</div>
            <div className="text-[9px] text-gray-500 font-semibold leading-none mt-1">SaaS Pilot account</div>
          </div>
        </div>

      </div>

    </header>
  );
}
