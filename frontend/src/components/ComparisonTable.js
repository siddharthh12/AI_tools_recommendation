'use client';

import React from 'react';
import { 
  RiFileList3Line, 
  RiMedalLine, 
  RiStarLine, 
  RiGlobalLine, 
  RiQuestionnaireLine,
  RiGroupLine
} from 'react-icons/ri';

export default function ComparisonTable({ targetName, targetMetrics, competitorsList }) {
  if (!competitorsList || !Array.isArray(competitorsList) || competitorsList.length === 0) {
    return null;
  }

  // Compile full table records: target business always goes first!
  const rows = [
    {
      name: targetName,
      isTarget: true,
      mentions: targetMetrics.mentions,
      averagePosition: targetMetrics.averagePosition,
      rating: targetMetrics.rating,
      reviewCount: targetMetrics.reviewCount,
      domainAuthority: targetMetrics.domainAuthority,
      redditScore: targetMetrics.redditScore,
      faqScore: targetMetrics.faqScore,
      authorityScore: targetMetrics.authorityScore
    },
    ...competitorsList.map(comp => {
      const compMetrics = comp.comparison;
      return {
        name: comp.name,
        isTarget: false,
        mentions: compMetrics.mentions.competitor,
        averagePosition: compMetrics.averagePosition.competitor,
        rating: compMetrics.rating.competitor,
        reviewCount: compMetrics.reviewCount.competitor,
        domainAuthority: compMetrics.domainAuthority.competitor,
        redditScore: compMetrics.redditScore.competitor,
        faqScore: compMetrics.faqScore.competitor,
        authorityScore: compMetrics.authorityScore.competitor
      };
    })
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl overflow-hidden space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Side-by-Side Signal Grid
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Complete comparison matrix mapping search signals and local reputation vectors.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-900 text-xs sm:text-sm">
          <thead>
            <tr className="text-left text-gray-500 font-bold uppercase tracking-wider border-b border-gray-900">
              <th className="pb-3 pr-4">Brand Profile</th>
              <th className="pb-3 px-3 text-center flex items-center justify-center space-x-1">
                <RiFileList3Line className="h-4 w-4 shrink-0 text-indigo-400" />
                <span className="hidden sm:inline">AI Citations</span>
              </th>
              <th className="pb-3 px-3 text-center">
                <RiMedalLine className="h-4 w-4 mx-auto text-amber-400" />
                <span className="hidden sm:inline">Avg Spot</span>
              </th>
              <th className="pb-3 px-3 text-center">
                <RiStarLine className="h-4 w-4 mx-auto text-emerald-400" />
                <span className="hidden sm:inline">Google Rating</span>
              </th>
              <th className="pb-3 px-3 text-center">
                <RiStarLine className="h-4 w-4 mx-auto text-emerald-400" />
                <span className="hidden sm:inline">Reviews Count</span>
              </th>
              <th className="pb-3 px-3 text-center">
                <RiGlobalLine className="h-4 w-4 mx-auto text-purple-400" />
                <span className="hidden sm:inline">Domain DA</span>
              </th>
              <th className="pb-3 px-3 text-center">
                <RiGroupLine className="h-4 w-4 mx-auto text-blue-400" />
                <span className="hidden sm:inline">Reddit Trust</span>
              </th>
              <th className="pb-3 pl-3 text-center">
                <RiQuestionnaireLine className="h-4 w-4 mx-auto text-pink-400" />
                <span className="hidden sm:inline">FAQ Score</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900 text-gray-300">
            {rows.map((row) => (
              <tr 
                key={row.name} 
                className={`transition-all hover:bg-gray-900/10 ${
                  row.isTarget ? 'bg-indigo-500/5 font-semibold text-white' : ''
                }`}
              >
                <td className="py-3.5 pr-4 flex items-center space-x-1.5 truncate max-w-[140px]">
                  <span>{row.name}</span>
                  {row.isTarget && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] border border-indigo-500/20 font-bold shrink-0">
                      Target
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {row.mentions} mentions
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {row.averagePosition > 0 ? `#${row.averagePosition}` : 'N/A'}
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {row.rating} ★
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {row.reviewCount}
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  DA {row.domainAuthority}
                </td>
                <td className="py-3.5 px-3 text-center font-mono">
                  {row.redditScore}%
                </td>
                <td className="py-3.5 pl-3 text-center font-mono">
                  {row.faqScore}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
