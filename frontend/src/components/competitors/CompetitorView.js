'use client';

import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import CompetitorCard from '../CompetitorCard';
import ComparisonTable from '../ComparisonTable';
import RecommendationPanel from '../RecommendationPanel';
import { Users, ShieldAlert } from 'lucide-react';

export default function CompetitorView() {
  const { report, compReport, businessName } = useDashboard();

  if (!report || !compReport) return null;

  // Compile target brand metrics coordinates on the fly matching actual crawl results
  const targetName = businessName;
  const targetMentions = report.queries.reduce(
    (acc, qRun) => acc + (qRun.results?.some(r => r.name.toLowerCase() === targetName.toLowerCase().trim()) ? 1 : 0), 
    0
  );
  
  const targetAvgPos = parseFloat(
    (report.queries.reduce((acc, qRun) => {
      const found = qRun.results?.find(r => r.name.toLowerCase() === targetName.toLowerCase().trim());
      return found ? acc + found.position : acc;
    }, 0) / (targetMentions || 1)).toFixed(1)
  );

  const targetMetrics = {
    mentions: targetMentions,
    averagePosition: targetAvgPos,
    rating: report.reviewData.rating,
    reviewCount: report.reviewData.reviewCount,
    domainAuthority: report.authorityData.domainAuthority,
    redditScore: report.breakdown.reviews, // proxy score mapping
    faqScore: report.breakdown.authority   // proxy score mapping
  };

  const topCompetitors = compReport.topCompetitors || [];

  return (
    <div className="space-y-10 py-2">
      
      {/* 1. Header description */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-2 text-indigo-400">
          <Users className="h-4.5 w-4.5" />
          <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Competitor Citation Gaps</h3>
        </div>
        <p className="text-[11px] text-gray-500 font-semibold">
          Side-by-side gap audit contrasting star review metrics, search positions, and domain indexes.
        </p>
      </div>

      {/* 2. Top Competitors Cards Deck Grid */}
      {topCompetitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCompetitors.slice(0, 2).map((comp) => (
            <CompetitorCard key={comp.name} competitor={comp} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/20 text-center">
          <ShieldAlert className="h-10 w-10 text-gray-600 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Competitors Sighted</h4>
          <p className="text-[10px] text-gray-500 font-semibold mt-1">Crawl queries did not identify other local recommendation citations.</p>
        </div>
      )}

      {/* 3. Comparison Signal Grid table */}
      <ComparisonTable
        targetName={targetName}
        targetMetrics={targetMetrics}
        competitorsList={topCompetitors}
      />

      {/* 4. Action recommendations mapped to competitor gaps */}
      <RecommendationPanel
        recommendations={topCompetitors[0]?.recommendations || []}
      />

    </div>
  );
}
