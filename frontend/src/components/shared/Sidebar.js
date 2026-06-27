'use client';

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Compass, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Radio,
  LayoutDashboard,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeSection,
    setActiveSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    status,
    businessName,
    user,
    logoutUser
  } = useDashboard();

  // Navigation Items Catalog
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'home', label: 'Crawl Cockpit', icon: Compass },
    { id: 'competitors', label: 'Real Competitors', icon: Users, requiresReport: true },
    { id: 'visibility', label: 'AI Visibility', icon: Radio, requiresReport: true },
    { id: 'suggestions', label: 'Suggestions', icon: Sparkles, requiresReport: true }
  ];

  const hasActiveReport = status === 'success';

  return (
    <aside 
      className={`relative border-r border-gray-150 bg-white flex flex-col justify-between transition-all duration-300 z-20 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      
      {/* 1. Header Branding */}
      <div>
        <div className={`p-5 flex items-center border-b border-gray-100 ${
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 shrink-0 text-sm">
              A
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold text-base text-gray-900 tracking-tight leading-none">
                AIdiscover<span className="text-indigo-650 font-bold">.</span>
              </span>
            )}
          </div>
          
          {/* Collapse trigger button (desktop only) */}
          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="hidden lg:flex h-5 w-5 rounded-md border border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-900 hover:border-gray-300 items-center justify-center cursor-pointer transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* 2. Navigation Items */}
        <nav className="p-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isDisabled = item.requiresReport && !hasActiveReport;

            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center rounded-xl px-3.5 py-3 text-sm font-black tracking-wide transition-all border ${
                  isSidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'
                } ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm'
                    : isDisabled
                      ? 'text-gray-350 border-transparent cursor-not-allowed opacity-40'
                      : 'text-gray-500 border-transparent hover:text-indigo-600 hover:bg-indigo-50/50 cursor-pointer'
                }`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                {!isSidebarCollapsed && (
                  <span className="truncate leading-none">{item.label}</span>
                )}
                {/* Active scanner indicator */}
                {isActive && !isSidebarCollapsed && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600 animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Footer Status */}
      <div className="p-3 border-t border-gray-100">
        {isSidebarCollapsed ? (
          <div className="flex justify-center py-2.5" title={hasActiveReport ? `Audited: ${businessName}` : 'System Ready'}>
            <span className={`h-3 w-3 rounded-full ${hasActiveReport ? 'bg-emerald-500 animate-pulse' : 'bg-gray-350'}`} />
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-gray-150 bg-gray-50/70 flex flex-col space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${hasActiveReport ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Platform Status</span>
            </div>
            
            {hasActiveReport ? (
              <div className="space-y-1">
                <div className="text-xs text-gray-700 font-extrabold truncate max-w-[170px]" title={businessName}>
                  {businessName}
                </div>
                <div className="text-[10px] text-emerald-600 font-black tracking-wide flex items-center space-x-1 uppercase">
                  <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
                  <span>Crawl Complete</span>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-gray-400 font-black tracking-wide flex items-center space-x-1 uppercase">
                <Database className="h-3 w-3" />
                <span>Ready for Crawls</span>
              </div>
            )}
          </div>
        )}
        
        {/* Log Out Action */}
        {user && (
          <button
            onClick={logoutUser}
            className={`w-full flex items-center rounded-xl px-3.5 py-2.5 mt-2 text-xs font-black uppercase tracking-wider text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent ${
              isSidebarCollapsed ? 'justify-center' : 'justify-start space-x-3'
            }`}
            title="Log Out"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        )}
        
        {/* Expand trigger button when collapsed (desktop only) */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="hidden lg:flex h-5 w-5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-900 mx-auto mt-3 items-center justify-center cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

    </aside>
  );
}
