'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* 1. Header spinner indicator */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-900 bg-gray-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          <div>
            <h4 className="text-sm font-bold text-white">Automated Playwright Audits Active</h4>
            <p className="text-[11px] text-gray-500 font-medium">Navigating Perplexity AI, submitting search queries, and extracting brand citations...</p>
          </div>
        </div>
        <div className="h-2 w-32 bg-gray-900 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-infinite-slide" style={{ width: '60%' }} />
        </div>
      </div>

      {/* 2. Main Overall meter vs breakdowns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-gray-900 flex flex-col items-center justify-center space-y-4">
          <div className="h-4.5 w-24 bg-gray-900 rounded-lg" />
          <div className="relative h-36 w-36 rounded-full border-8 border-gray-900 flex items-center justify-center">
            <div className="h-10 w-16 bg-gray-900 rounded-lg" />
          </div>
          <div className="h-3.5 w-36 bg-gray-900 rounded-lg" />
        </div>
        <div className="md:col-span-3 glass-panel p-6 rounded-2xl border border-gray-900 space-y-4 flex flex-col justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3.5 w-24 bg-gray-900 rounded" />
                <div className="h-3.5 w-10 bg-gray-900 rounded" />
              </div>
              <div className="h-2.5 w-full bg-gray-900 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Action cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-gray-900 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-900 rounded" />
              <div className="h-4 w-16 bg-gray-900 rounded" />
            </div>
            <div className="h-5 w-48 bg-gray-900 rounded" />
            <div className="h-px bg-gray-900 w-full" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-900 rounded" />
              <div className="h-3 w-5/6 bg-gray-900 rounded" />
            </div>
            <div className="h-px bg-gray-900 w-full" />
            <div className="space-y-2.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-10 bg-gray-905 rounded-xl border border-gray-900/60" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
