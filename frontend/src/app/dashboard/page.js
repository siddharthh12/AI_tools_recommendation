'use client';

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import SearchCockpit from '../../components/dashboard/SearchCockpit';
import VisibilityView from '../../components/dashboard/VisibilityView';
import CompetitorView from '../../components/competitors/CompetitorView';
import RecommendationsView from '../../components/recommendations/RecommendationsView';
import AnalyticsView from '../../components/analytics/AnalyticsView';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyResults from '../../components/ui/EmptyResults';
import { ShieldAlert, RefreshCw, X } from 'lucide-react';

export default function Dashboard() {
  const { 
    activeSection, 
    status, 
    errorMsg, 
    clearAuditScan,
    triggerAuditScan
  } = useDashboard();

  // 1. Loading scanner active screen
  if (status === 'scanning') {
    return <LoadingSkeleton />;
  }

  // 2. Scan error fallback screen
  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[400px] py-8">
        <div className="glass-panel border border-rose-900 bg-rose-950/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-6 max-w-md shadow-2xl animate-fade-in select-none">
          <div className="rounded-full h-12 w-12 bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-6 w-6 text-rose-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white leading-none">Scraper Execution Fault</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              {errorMsg}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 w-full">
            <button
              onClick={clearAuditScan}
              className="flex-grow px-4 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
            >
              <X className="h-4 w-4 text-gray-400" />
              <span>Reset Search</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Dynamic Section Switcher
  switch (activeSection) {
    case 'home':
      return <SearchCockpit />;
      
    case 'visibility':
      if (status !== 'success') return <EmptyResults onQuickCtaClick={triggerAuditScan} />;
      return <VisibilityView />;
      
    case 'competitors':
      if (status !== 'success') return <EmptyResults onQuickCtaClick={triggerAuditScan} />;
      return <CompetitorView />;
      
    case 'recommendations':
      if (status !== 'success') return <EmptyResults onQuickCtaClick={triggerAuditScan} />;
      return <RecommendationsView />;
      
    case 'analytics':
      if (status !== 'success') return <EmptyResults onQuickCtaClick={triggerAuditScan} />;
      return <AnalyticsView />;
      
    default:
      return <SearchCockpit />;
  }
}
