'use client';

import React from 'react';
import { DashboardProvider } from '../../context/DashboardContext';
import Sidebar from '../../components/shared/Sidebar';
import Navbar from '../../components/shared/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen w-screen bg-gray-950 overflow-hidden font-sans antialiased text-gray-100 dark:bg-gray-950 dark:text-gray-100">
        
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Top Navbar + Scrolling Content Container */}
        <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Top Navigation Utilities bar */}
          <Navbar />

          {/* Scrolling Main Body Container */}
          <main className="flex-grow overflow-y-auto bg-gray-950/20 p-6 sm:p-8 select-text">
            <div className="mx-auto max-w-6xl w-full">
              {children}
            </div>
          </main>

        </div>

      </div>
    </DashboardProvider>
  );
}
