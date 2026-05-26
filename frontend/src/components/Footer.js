import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-gray-950 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AIdiscover Platform. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Phase 1 Setup &amp; MVP Base Architecture Demo.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex justify-center space-x-6">
          <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer">Terms of Service</span>
          <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer">Privacy Policy</span>
          <span className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer">Supabase Integration</span>
        </div>
      </div>
    </footer>
  );
}
