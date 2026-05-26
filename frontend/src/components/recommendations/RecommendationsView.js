'use client';

import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import RecommendationCard from '../RecommendationCard';
import { Lightbulb, Layers, Search, Star, FileJson, Share2 } from 'lucide-react';

export default function RecommendationsView() {
  const { recReport, businessName } = useDashboard();
  const [activeTab, setActiveTab] = useState('ALL');

  if (!recReport || !recReport.recommendations) return null;

  const recommendations = recReport.recommendations || [];

  // Group tab filters catalogs
  const tabs = [
    { id: 'ALL', label: 'All Actions', icon: Layers },
    { id: 'VISIBILITY', label: 'AI Visibility', icon: Search, categories: ['AI Citations', 'AI Visibility', 'Visibility'] },
    { id: 'REVIEWS', label: 'Star Reviews', icon: Star, categories: ['Reviews', 'Ratings'] },
    { id: 'SEO', label: 'SEO Authority', icon: Lightbulb, categories: ['SEO', 'Domain Authority', 'Authority'] },
    { id: 'FAQS', label: 'FAQs schemas', icon: FileJson, categories: ['FAQs', 'FAQ Page', 'Schema'] },
    { id: 'COMMUNITY', label: 'Social Signals', icon: Share2, categories: ['Community Signals', 'Social', 'Reddit'] }
  ];

  // Filter recommendations based on active tab matching category keywords
  const filteredRecs = recommendations.filter((rec) => {
    if (activeTab === 'ALL') return true;
    
    const targetTab = tabs.find((t) => t.id === activeTab);
    if (!targetTab) return true;
    
    return targetTab.categories.some(
      (catKey) => rec.category.toLowerCase().includes(catKey.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 py-2">
      
      {/* 1. Header description */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 text-indigo-400">
          <Lightbulb className="h-4.5 w-4.5 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Optimization Playbook Checklist</h3>
        </div>
        <p className="text-[11px] text-gray-500 font-semibold">
          High-yield execution tasks for <strong>{businessName}</strong>, ordered from highest impact severity.
        </p>
      </div>

      {/* 2. Interactive Category Tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-gray-900 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-[10px] sm:text-xs font-bold tracking-wide transition-all border flex items-center space-x-1.5 cursor-pointer ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-md'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/60'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Filtered recommendations list grid */}
      {filteredRecs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map((rec, idx) => (
            <RecommendationCard key={idx} recommendation={rec} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-gray-900 bg-gray-950/20 max-w-md mx-auto">
          <Lightbulb className="h-8 w-8 text-gray-700 mx-auto mb-3" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">No Tasks in Category</h4>
          <p className="text-[10px] text-gray-500 font-semibold mt-2 leading-relaxed">
            Your brand meets all target thresholds in this sector! Switch back to **All Actions** to check other advisories.
          </p>
        </div>
      )}

    </div>
  );
}
