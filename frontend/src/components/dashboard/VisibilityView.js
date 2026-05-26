'use client';

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import VisibilityMeter from '../VisibilityMeter';
import BreakdownChart from '../BreakdownChart';
import RankingInsights from '../RankingInsights';
import QueryResults from '../QueryResults';
import { Sparkles, Shield, BarChart3 } from 'lucide-react';

export default function VisibilityView() {
  const { report, businessName } = useDashboard();

  if (!report) return null;

  return (
    <div className="space-y-10 py-2">
      
      {/* 1. Header description */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 text-indigo-400">
          <BarChart3 className="h-4.5 w-4.5" />
          <h3 className="text-xs font-black uppercase tracking-wider">AI Discoverability Index Scorecard</h3>
        </div>
        <p className="text-[11px] text-gray-500 font-semibold">
          Comprehensive score calculations for <strong>{businessName}</strong> based on live Playwright engine crawls.
        </p>
      </div>

      {/* 2. Visual Scores Panels grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <div className="md:col-span-2">
          <VisibilityMeter score={report.overallScore} />
        </div>
        <div className="md:col-span-3">
          <BreakdownChart breakdown={report.breakdown} />
        </div>
      </div>

      {/* 3. Text Optimization Insights details */}
      <RankingInsights
        breakdown={report.breakdown}
        reviewData={report.reviewData}
        authorityData={report.authorityData}
        businessName={businessName}
      />

      {/* 4. Raw Crawls accordion list */}
      <div className="pt-6 border-t border-gray-900 space-y-4">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Shield className="h-4.5 w-4.5" />
          <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Playwright Search Log Accordions</h3>
        </div>
        
        <QueryResults
          queries={report.queries}
          targetBusiness={businessName}
        />
      </div>

    </div>
  );
}
