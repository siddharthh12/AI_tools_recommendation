'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiRobot2Line, RiMenuLine, RiCloseLine } from 'react-icons/ri';

const WhatsAppIcon = ({ className = "h-4.5 w-4.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.46 3.473 1.334 4.982L2 22l5.209-1.365a9.92 9.92 0 004.8 1.233h.005c5.506 0 9.99-4.482 9.99-9.988C22.004 6.482 17.518 2 12.012 2zm6.208 14.153c-.27.761-1.562 1.393-2.146 1.474-.509.071-1.17.135-3.342-.766-2.779-1.153-4.576-3.978-4.716-4.162-.135-.185-1.135-1.507-1.135-2.876 0-1.369.72-2.043.977-2.313.256-.27.562-.338.751-.338h.54c.162 0 .378.063.535.438.162.388.558 1.36.608 1.464.05.104.085.225.014.36-.071.135-.108.225-.216.351-.108.126-.229.283-.328.383-.108.108-.22.225-.094.438.126.212.562.923 1.206 1.498.832.743 1.53.972 1.746 1.08.216.108.342.09.468-.054.126-.144.54-.63.684-.846.144-.216.288-.18.486-.108.198.072 1.256.594 1.472.702.216.108.36.162.414.252.054.09.054.522-.216 1.283z" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide global navbar inside SaaS dashboard audit page
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  const isLanding = pathname === '/';

  // Always apply light-themed navbar styles across the entire website
  const navClass = "sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-colors duration-300";

  const brandClass = "text-gray-900 font-extrabold bg-gradient-to-r from-gray-900 to-gray-650 bg-clip-text text-transparent";

  const logoColor = "text-indigo-605";

  // Enlarged font size to text-sm/text-base with bold weight
  const linkClass = "text-gray-750 hover:text-indigo-650 font-black transition-all text-sm uppercase tracking-wider";

  return (
    <nav className={navClass}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <RiRobot2Line className={`h-8 w-8 ${logoColor} animate-pulse`} />
              <span className={`text-xl tracking-tight ${brandClass}`}>
                AIdiscover
              </span>
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {isLanding ? (
              <>
                <a href="#how-it-works" className={linkClass}>How it Works</a>
                <a href="#about-us" className={linkClass}>About Us</a>
                <Link href="/dashboard" className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-all">
                  Launch Scanner
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className={linkClass}>Overview</Link>
                <Link href="/dashboard" className={linkClass}>Dashboard</Link>
              </>
            )}
          </div>

          {/* Book Free Demo Button (Desktop) */}
          <div className="hidden md:flex items-center">
            <a 
              href="https://wa.me/#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#4d6bfe] hover:bg-[#3d5be4] text-sm font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
            >
              <WhatsAppIcon className="h-4.5 w-4.5" />
              <span>Book Free Demo</span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-650 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <RiCloseLine className="h-7 w-7" /> : <RiMenuLine className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-white border-gray-100 text-gray-750 px-4 pt-2 pb-4 space-y-3">
          {isLanding ? (
            <>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-black tracking-wide">How it Works</a>
              <a href="#about-us" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-black tracking-wide">About Us</a>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-black text-indigo-605">
                Launch Scanner
              </Link>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-black">Overview</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-black">Dashboard</Link>
            </>
          )}
          
          <a 
            href="https://wa.me/#"
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full justify-center px-5 py-3 rounded-xl bg-[#4d6bfe] hover:bg-[#3d5be4] text-white text-sm font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
          >
            <WhatsAppIcon className="h-4.5 w-4.5" />
            <span>Book Free Demo</span>
          </a>
        </div>
      )}
    </nav>
  );
}
