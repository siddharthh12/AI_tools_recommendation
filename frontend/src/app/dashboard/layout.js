'use client';

import React from 'react';
import { DashboardProvider } from '../../context/DashboardContext';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen w-screen bg-white overflow-hidden font-sans antialiased text-gray-900">
        
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Top Navbar + Scrolling Content Container */}
        <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Top Navigation Utilities bar */}
          <Navbar />

          {/* Scrolling Main Body Container */}
          <main className="flex-grow overflow-y-auto bg-slate-50/30 p-6 sm:p-8 select-text relative z-0">
            {/* Ambient glows matching homepage */}
            <div className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)] blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(4,203,230,0.06),transparent_70%)] blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(51,111,252,0.05),transparent_70%)] blur-[100px] pointer-events-none" />
            
            <div className="mx-auto max-w-6xl w-full relative z-10">
              {children}
            </div>
          </main>

        </div>

      </div>
    </DashboardProvider>
  );
}
