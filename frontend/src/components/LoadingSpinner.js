'use client';

import React, { useState, useEffect } from 'react';
import { RiScan2Line } from 'react-icons/ri';

export default function LoadingSpinner() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Generating 3 targeted search query variations...",
    "Launching Playwright Chromium browser sandbox...",
    "Navigating to Perplexity AI and bypassing Cloudflare check...",
    "Simulating real human typing and submitting queries...",
    "Extracting brand mentions and competitor rankings...",
    "Compiling discoverability indexes and gap stats..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4500); // Transitions to next step every 4.5 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="glass-panel border border-indigo-900/50 bg-indigo-950/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto shadow-2xl">
      <div className="relative flex items-center justify-center h-24 w-24">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/20 opacity-75"></span>
        <div className="relative rounded-full h-16 w-16 bg-indigo-950 flex items-center justify-center border border-indigo-500/40 shadow-inner">
          <RiScan2Line className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-wide">AI Query Engine Active</h3>
        <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full animate-pulse" />
      </div>

      <div className="space-y-4 w-full">
        {/* Step-by-step progress checklist */}
        <div className="text-sm font-medium text-indigo-300 min-h-[40px] flex items-center justify-center transition-all duration-500 px-4">
          "{steps[currentStep]}"
        </div>

        {/* Dynamic progress bar */}
        <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-gray-800">
          <div 
            className="h-2 bg-gradient-to-r from-indigo-500 via-indigo-400 to-purple-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
        Because Playwright runs real browser instances sequentially in the background, analysis can take 15–20 seconds to compile. Thank you for your patience!
      </p>
    </div>
  );
}
