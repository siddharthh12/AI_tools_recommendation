'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiRobot2Line, RiCompass3Line, RiDashboardLine } from 'react-icons/ri';

export default function Navbar() {
  const pathname = usePathname();

  // Hide the global navigation bar when inside the SaaS dashboard view frame
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-white">
              <RiRobot2Line className="h-8 w-8 text-indigo-400 animate-pulse" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                AIdiscover
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1 sm:space-x-4">
            <Link
              href="/"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/'
                  ? 'bg-gray-900 text-white border border-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              <RiCompass3Line className="h-4 w-4" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'bg-gray-900 text-white border border-gray-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              <RiDashboardLine className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Platform Status */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Scraper Active
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
