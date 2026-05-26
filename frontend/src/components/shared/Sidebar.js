'use client';

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Compass, 
  BarChart3, 
  Users, 
  Lightbulb, 
  LineChart, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Radio
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeSection,
    setActiveSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    status,
    businessName
  } = useDashboard();

  // Navigation Items Catalog
  const navItems = [
    { id: 'home', label: 'Crawl Cockpit', icon: Compass },
    { id: 'visibility', label: 'AI Visibility', icon: BarChart3, requiresReport: true },
    { id: 'competitors', label: 'Competitor Gaps', icon: Users, requiresReport: true },
    { id: 'recommendations', label: 'Optimization Playbook', icon: Lightbulb, requiresReport: true },
    { id: 'analytics', label: 'History & Trends', icon: LineChart, requiresReport: true }
  ];

  const hasActiveReport = status === 'success';

  return (
    <aside 
      className={`relative border-r border-gray-900 bg-gray-950 flex flex-col justify-between transition-all duration-300 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      
      {/* 1. Header Branding accent */}
      <div>
        <div className={`p-5 flex items-center border-b border-gray-900 ${
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 shrink-0">
              A
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold text-sm text-white tracking-tight leading-none">
                AIdiscover<span className="text-indigo-400 font-bold">.</span>
              </span>
            )}
          </div>
          
          {/* Collapse trigger button (desktop only) */}
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="hidden lg:flex h-5 w-5 rounded-md border border-gray-800 bg-gray-900 text-gray-500 hover:text-white hover:border-gray-700 items-center justify-center cursor-pointer transition-all"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* 2. Navigation items grid */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isDisabled = item.requiresReport && !hasActiveReport;

            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs font-bold tracking-wide transition-all border ${
                  isSidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'
                } ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-sm'
                    : isDisabled
                      ? 'text-gray-700 border-transparent cursor-not-allowed opacity-40'
                      : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/60 cursor-pointer'
                }`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                {!isSidebarCollapsed && (
                  <span className="truncate leading-none">{item.label}</span>
                )}
                {/* Active scanner small green radar ping */}
                {isActive && !isSidebarCollapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer system active states */}
      <div className="p-3 border-t border-gray-900">
        {isSidebarCollapsed ? (
          <div className="flex justify-center py-2" title={hasActiveReport ? `Audited: ${businessName}` : 'System Ready'}>
            <span className={`h-2.5 w-2.5 rounded-full ${hasActiveReport ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`} />
          </div>
        ) : (
          <div className="glass-panel p-3.5 rounded-xl border border-gray-900 bg-gray-950/20 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`h-2 w-2 rounded-full shrink-0 ${hasActiveReport ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Platform Status</span>
            </div>
            
            {hasActiveReport ? (
              <div className="space-y-1">
                <div className="text-[10px] text-gray-300 font-bold truncate max-w-[170px]" title={businessName}>
                  {businessName}
                </div>
                <div className="text-[9px] text-emerald-400 font-semibold tracking-wide flex items-center space-x-1">
                  <Radio className="h-2.5 w-2.5 animate-pulse" />
                  <span>Report Loaded</span>
                </div>
              </div>
            ) : (
              <div className="text-[9px] text-gray-500 font-semibold tracking-wide flex items-center space-x-1">
                <Database className="h-2.5 w-2.5" />
                <span>Ready for Audits</span>
              </div>
            )}
          </div>
        )}
        
        {/* Expand trigger button when collapsed (desktop only) */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="hidden lg:flex h-5 w-5 rounded-md border border-gray-800 bg-gray-950 text-gray-500 hover:text-white mx-auto mt-3 items-center justify-center cursor-pointer"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

    </aside>
  );
}
