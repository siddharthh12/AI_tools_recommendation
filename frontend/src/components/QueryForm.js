'use client';

import React from 'react';
import { RiScan2Line, RiMapPinUserLine, RiBuilding4Line, RiPriceTag3Line } from 'react-icons/ri';

export default function QueryForm({ 
  businessName, 
  setBusinessName, 
  category, 
  setCategory, 
  city, 
  setCity, 
  onSubmit, 
  disabled 
}) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl bg-gray-950/40">
      <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-5">
        <RiScan2Line className="text-indigo-400 h-5 w-5 animate-pulse" />
        <span>Configure Query Engine</span>
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        
        {/* Business Name input */}
        <div>
          <label htmlFor="form-business" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <RiBuilding4Line className="h-3.5 w-3.5 text-gray-500" />
            <span>Target Business Name *</span>
          </label>
          <input
            id="form-business"
            type="text"
            required
            disabled={disabled}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Gold's Gym"
            className="w-full bg-gray-950/60 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* Category input */}
        <div>
          <label htmlFor="form-category" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <RiPriceTag3Line className="h-3.5 w-3.5 text-gray-500" />
            <span>Market Category *</span>
          </label>
          <input
            id="form-category"
            type="text"
            required
            disabled={disabled}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Gym, Cafe, Pizzeria"
            className="w-full bg-gray-950/60 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* City input */}
        <div>
          <label htmlFor="form-city" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <RiMapPinUserLine className="h-3.5 w-3.5 text-gray-500" />
            <span>City Location *</span>
          </label>
          <input
            id="form-city"
            type="text"
            required
            disabled={disabled}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Mumbai, Berlin, Seattle"
            className="w-full bg-gray-950/60 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* Submit Scan Button */}
        <button
          type="submit"
          disabled={disabled || !businessName || !category || !city}
          className="w-full glow-btn rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-850 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/20"
        >
          <RiScan2Line className="h-4 w-4" />
          <span>Execute Perplexity Crawl</span>
        </button>

      </form>
    </div>
  );
}
