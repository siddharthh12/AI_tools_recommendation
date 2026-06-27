'use client';

import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Sun, 
  Moon, 
  History, 
  ChevronDown, 
  User, 
  ChevronRight,
  Sparkles,
  Terminal
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
    visibility: 'AI Visibility Score',
    competitors: 'Competitor Gaps',
    recommendations: 'Strategic Optimization Playbook',
    analytics: 'History & Trends'
  };

  const handleRecallSearch = (coords) => {
    setIsHistoryOpen(false);
    triggerAuditScan(coords);
  };

  return (
    <header className="h-16 border-b border-gray-150 bg-white px-6 flex items-center justify-between shrink-0 select-none z-10">
      
      {/* 1. Breadcrumbs Indicator */}
      <div className="flex items-center space-x-2 text-sm font-extrabold tracking-wide">
        <span className="text-gray-400">Dashboard</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
        <span className="text-indigo-650 font-black">{sectionLabels[activeSection] || activeSection}</span>
        
        {status === 'success' && businessName && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-xs text-gray-600 font-extrabold max-w-[150px] truncate" title={businessName}>
              {businessName}
            </span>
          </>
        )}
      </div>

      {/* 2. Top-Right Utilities */}
      <div className="flex items-center space-x-4">
        
        {/* Recents Searches recalls Dropdown */}
        {searchHistory && searchHistory.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all"
            >
              <History className="h-4 w-4" />
              <span>Recent Scans</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {isHistoryOpen && (
              <>
                {/* Overlay backdrop block */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsHistoryOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-150 rounded-2xl shadow-2xl py-3 px-2 z-20 space-y-1">
                  <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 mb-2 flex items-center justify-between">
                    <span>Recent Scans Recall</span>
                    <Sparkles className="h-3 w-3 text-indigo-600" />
                  </div>
                  
                  {searchHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRecallSearch(item)}
                      className="w-full text-left p-2 rounded-xl hover:bg-gray-50 transition-all flex items-start space-x-2.5 cursor-pointer group"
                    >
                      <div className="mt-0.5 h-6.5 w-6.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-100 flex items-center justify-center transition-all shrink-0">
                        <Terminal className="h-3.5 w-3.5" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-extrabold text-gray-800 group-hover:text-indigo-600 transition-all truncate leading-tight">
                          {item.business}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 leading-none">
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
          className="h-9 w-9 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-400 hover:text-gray-900 flex items-center justify-center cursor-pointer transition-all shadow-md"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-indigo-605" />
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-gray-150" />

        {/* User Account profile card */}
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500 shadow-inner select-none shrink-0">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="hidden sm:block text-left select-none">
            <div className="text-xs font-black text-gray-900 leading-none">Admin</div>
            <div className="text-[10px] text-gray-400 font-extrabold leading-none mt-1">SaaS Pilot account</div>
          </div>
        </div>

      </div>

    </header>
  );
}
