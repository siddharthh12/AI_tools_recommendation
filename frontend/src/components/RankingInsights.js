'use client';

import React from 'react';
import { 
  RiLightbulbFlashLine, 
  RiArrowRightSLine, 
  RiCheckDoubleLine, 
  RiFocus2Line 
} from 'react-icons/ri';

export default function RankingInsights({ breakdown, reviewData, authorityData, businessName }) {
  if (!breakdown) return null;

  // Compile specific actionable recommendations based on sub-score values
  const recommendations = [];

  // 1. Analyze Frequency & Position
  if (breakdown.frequency < 60) {
    recommendations.push({
      type: 'critical',
      title: 'Boost AI Mention Frequency',
      action: `Your brand "${businessName}" lacks search catalog density in Perplexity AI responses. Author high-quality blogs and case studies highlighting local industry category keywords to let LLM indexers crawl you.`
    });
  } else if (breakdown.ranking < 75) {
    recommendations.push({
      type: 'optimization',
      title: 'Optimize AI Ranking Positions',
      action: `While cited, your brand ranks deeper in AI list recommendations. Inject clear structural markup (Schema.org Organization/LocalBusiness JSON-LD) on your homepage to raise semantic ranking spots.`
    });
  }

  // 2. Analyze Local Reviews
  if (reviewData) {
    if (reviewData.rating < 4.4) {
      recommendations.push({
        type: 'reviews',
        title: 'Enhance Rating Score Quality',
        action: `Your mock rating of ${reviewData.rating} is below the optimal discoverability threshold (4.5+). Direct local customers to leave detailed, keyword-rich reviews to boost rating signals.`
      });
    }
    if (reviewData.reviewCount < 800) {
      recommendations.push({
        type: 'reviews',
        title: 'Increase Reviews Citations Volume',
        action: `Your total mock review citations count (${reviewData.reviewCount}) is light. Volume establishes trust. Implement automated review invite triggers to scale to 1000+ records.`
      });
    }
  }

  // 3. Analyze Web Authority
  if (authorityData) {
    if (authorityData.domainAuthority < 50) {
      recommendations.push({
        type: 'authority',
        title: 'Improve Domain Backlink Authority',
        action: `Your Domain Authority score (${authorityData.domainAuthority}) is moderate. Acquire contextually relevant backlinks from high-authority brand portals and catalogs to strengthen link equity.`
      });
    }
    if (!authorityData.hasKeywords) {
      recommendations.push({
        type: 'authority',
        title: 'Resolve SEO Metadata Keyword Gaps',
        action: 'Your site code lacks core industry category terms in the header tags. Add relevant keyword meta-tags to help search crawlers associate your site with local industry terms.'
      });
    }
    if (!authorityData.sslEnabled) {
      recommendations.push({
        type: 'authority',
        title: 'Activate Web security protocols',
        action: 'Enable SSL (HTTPS) active certificates on your domain hosting immediately. AI engines actively penalize unencrypted website connections.'
      });
    }
  }

  // Fallback default if all metrics are perfect
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      title: 'Optimal AI Discoverability Active',
      action: `Congratulations! "${businessName}" displays exceptional local rating quality, search citation frequency, and domain security settings. Continue monitoring queries daily to track competitor trends.`
    });
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 shadow-xl space-y-5">
      
      {/* Header */}
      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
        <RiLightbulbFlashLine className="text-amber-400 h-5 w-5 animate-pulse" />
        <span>Optimization Insights Engine</span>
      </h3>

      {/* Recommendations Cards list */}
      <div className="space-y-4">
        {recommendations.map((rec, idx) => {
          let borderClass = 'border-gray-850 bg-gray-950/20';
          let bulletIcon = RiArrowRightSLine;
          let textClass = 'text-gray-400';

          if (rec.type === 'critical') {
            borderClass = 'border-rose-900/30 bg-rose-950/5';
            bulletIcon = RiFocus2Line;
            textClass = 'text-rose-400';
          } else if (rec.type === 'success') {
            borderClass = 'border-emerald-900/30 bg-emerald-950/5';
            bulletIcon = RiCheckDoubleLine;
            textClass = 'text-emerald-400';
          }

          const BulletIcon = bulletIcon;

          return (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex gap-3 text-xs sm:text-sm ${borderClass} transition-all`}
            >
              <div className="mt-0.5 shrink-0">
                <BulletIcon className={`h-5 w-5 ${textClass}`} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white tracking-wide">
                  {rec.title}
                </h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed select-text">
                  {rec.action}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
