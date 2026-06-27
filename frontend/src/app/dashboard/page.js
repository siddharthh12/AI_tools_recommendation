'use client';

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import SearchCockpit from '../../components/dashboard/SearchCockpit';
import CompetitorView from '../../components/competitors/CompetitorView';
import AIVisibilityView from '../../components/dashboard/AIVisibilityView';
import SassDashboardView from '../../components/dashboard/SassDashboardView';
import SuggestionsView from '../../components/dashboard/SuggestionsView';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { ShieldAlert, X } from 'lucide-react';

export default function Dashboard() {
  const { 
    activeSection, 
    status, 
    errorMsg, 
    clearAuditScan
  } = useDashboard();

  // 1. Loading scanner active screen
  if (status === 'scanning' || status === 'enriching') {
    return <LoadingSkeleton />;
  }

  // 2. Scan error fallback screen
  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[400px] py-8">
        <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-6 max-w-md shadow-xl animate-fade-in select-none">
          <div className="rounded-full h-12 w-12 bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-6 w-6 text-rose-600 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-black text-gray-950 leading-none">Scraper Execution Fault</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-bold">
              {errorMsg}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 w-full">
            <button
              onClick={clearAuditScan}
              className="flex-grow px-5 py-3 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 text-sm font-black text-gray-700 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <X className="h-4.5 w-4.5 text-gray-500" />
              <span>Reset Search</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Dynamic Section Switcher
  switch (activeSection) {
    case 'dashboard':
      return <SassDashboardView />;

    case 'home':
      return <SearchCockpit />;
      
    case 'competitors':
      if (status !== 'success') return <SearchCockpit />;
      return <CompetitorView />;

    case 'visibility':
      if (status !== 'success') return <SearchCockpit />;
      return <AIVisibilityView />;

    case 'suggestions':
      if (status !== 'success') return <SearchCockpit />;
      return <SuggestionsView />;
      
    default:
      return <SassDashboardView />;
  }
}
