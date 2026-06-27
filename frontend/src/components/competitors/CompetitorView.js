'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Users, 
  Terminal, 
  Globe, 
  MapPin, 
  Search, 
  Activity, 
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Star,
  Phone,
  ArrowRight
} from 'lucide-react';
import { 
  RiInstagramLine, 
  RiFacebookCircleLine, 
  RiLinkedinBoxLine, 
  RiYoutubeLine, 
  RiTwitterXLine 
} from 'react-icons/ri';

export default function CompetitorView() {
  const { 
    competitors, 
    queries, 
    logs, 
    browserStatus, 
    businessName, 
    category, 
    city,
    clearAuditScan
  } = useDashboard();

  const [isDebugExpanded, setIsDebugExpanded] = useState(false);

  // Filter logs for easy reading
  const errorLogs = logs.filter(l => l.type === 'error');

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500 shrink-0" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-500/40 text-amber-500 shrink-0" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-200 shrink-0" />);
      }
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  return (
    <div className="space-y-8 py-2 animate-fade-in text-gray-900">
      
      {/* 1. Header Information Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-[#5939fc]">
            <Users className="h-4.5 w-4.5 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider">Real-World Competitor Discovery</h3>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-955 tracking-tight leading-none">
            Scan Results for <span className="bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] bg-clip-text text-transparent">"{businessName}"</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-1">
            Targeting Vertical: <span className="text-gray-800 font-extrabold">{category}</span> &middot; Location: <span className="text-gray-800 font-extrabold">{city}</span>
          </p>
        </div>

        {/* Emerald green Live Data Trust Banner */}
        <div className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wide w-fit select-none shadow-md">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
          <span>Live Data Extracted & Enriched</span>
        </div>
      </div>

      {/* 2. Debug Panel */}
      <div className="border border-gray-100 bg-white rounded-[2rem] overflow-hidden shadow-xl">
        <button
          onClick={() => setIsDebugExpanded(!isDebugExpanded)}
          className="w-full px-5 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between hover:bg-gray-100 transition-all focus:outline-none"
        >
          <div className="flex items-center space-x-2.5">
            <Terminal className="h-5 w-5 text-[#5939fc]" />
            <span className="text-base font-black text-gray-950 uppercase tracking-wider">Playwright Scraping Debug Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-550 shadow-sm">
              <Activity className="h-4 w-4 text-[#5939fc] animate-pulse" />
              <span className="uppercase font-semibold">{browserStatus}</span>
            </div>
            {isDebugExpanded ? <ChevronUp className="h-5 w-5 text-gray-405" /> : <ChevronDown className="h-5 w-5 text-gray-405" />}
          </div>
        </button>

        {isDebugExpanded && (
          <div className="p-5 space-y-5">
            {/* Quick Scrape Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4.5 rounded-xl border border-gray-150 bg-gray-50/50">
                <div className="text-xs font-black text-gray-450 uppercase tracking-widest leading-none mb-2">Generated Queries</div>
                <div className="text-2xl font-black text-gray-900">{queries.length}</div>
              </div>
              <div className="p-4.5 rounded-xl border border-gray-150 bg-gray-50/50">
                <div className="text-xs font-black text-gray-450 uppercase tracking-widest leading-none mb-2">Enriched Competitors</div>
                <div className="text-2xl font-black text-gray-900">{competitors.length}</div>
              </div>
              <div className="p-4.5 rounded-xl border border-gray-150 bg-gray-50/50">
                <div className="text-xs font-black text-gray-450 uppercase tracking-widest leading-none mb-2">Failed Searches</div>
                <div className="text-2xl font-black text-rose-605">{errorLogs.length}</div>
              </div>
              <div className="p-4.5 rounded-xl border border-gray-150 bg-gray-50/50">
                <div className="text-xs font-black text-gray-450 uppercase tracking-widest leading-none mb-2">Crawler Status</div>
                <div className="text-2xl font-black text-indigo-600 capitalize">Done</div>
              </div>
            </div>

            {/* Generated Queries Badges */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-405 block">Executed Search Phrases</span>
              <div className="flex flex-wrap gap-2">
                {queries.map((q, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-gray-205 bg-white text-sm font-black text-gray-700 shadow-sm"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Console Logs Terminal */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-405 block">Browser Activity Console Logs</span>
              <div className="h-44 rounded-xl border border-gray-205 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-600 overflow-y-auto space-y-2 scrollbar-thin select-text">
                {logs.length > 0 ? (
                  logs.map((log, index) => {
                    let typeColor = 'text-gray-550';
                    if (log.type === 'error') typeColor = 'text-rose-600 font-extrabold';
                    if (log.type === 'warn') typeColor = 'text-amber-600';
                    
                    return (
                      <div key={index} className="flex items-start space-x-2 select-text">
                        <span className="text-gray-400 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-indigo-650 shrink-0 select-none font-bold">[{log.component}]</span>
                        <span className={`${typeColor} select-text`}>{log.message}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400 italic">No browser console logs loaded.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Competitor Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black uppercase tracking-wider text-gray-955">Enriched Local Competitors</h3>
          <button 
            onClick={clearAuditScan}
            className="px-4 py-2 border border-gray-200 hover:border-[#336ffc]/30 hover:bg-[#336ffc]/5 bg-white rounded-xl text-xs font-bold text-gray-650 hover:text-[#336ffc] cursor-pointer transition-all shadow-md"
          >
            Run New Audit
          </button>
        </div>

        {competitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitors.map((comp, idx) => {
              const rating = comp.rating;
              const reviewCount = comp.reviewCount || comp.review_count;
              const googleMapsLink = comp.googleMapsLink || comp.google_maps_link;
              const socialLinks = comp.socialLinks || comp.social_links || {};

              return (
                <div 
                  key={idx} 
                  className="p-6 rounded-[2rem] border border-gray-100 bg-white hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-5 group relative overflow-hidden"
                >
                  {/* Subtle background glow */}
                  <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
                  
                  {/* Position ranking tag */}
                  <span className="absolute top-6 right-6 h-8 w-8 rounded-lg bg-gradient-to-tr from-[#5939fc] to-[#336ffc] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/10 select-none">
                    #{idx + 1}
                  </span>

                  <div className="space-y-4">
                    {/* Brand Name & Category Badge */}
                    <div className="space-y-2 pr-8">
                      <h4 className="text-xl font-black text-gray-950 group-hover:text-[#5939fc] transition-colors leading-tight">
                        {comp.name}
                      </h4>
                      {comp.category && (
                        <span className="inline-block px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[10px] font-black text-[#5939fc] uppercase tracking-widest">
                          {comp.category}
                        </span>
                      )}
                    </div>

                    {/* Google Ratings Indicator */}
                    {rating !== undefined && rating !== null ? (
                      <div className="flex items-center space-x-2 bg-amber-50/45 p-2 px-3 rounded-xl border border-amber-100 w-fit select-none">
                        {renderStars(rating)}
                        <span className="text-xs font-black text-gray-900">{rating}</span>
                        {reviewCount !== undefined && reviewCount !== null && (
                          <span className="text-[10px] text-gray-500 font-bold">
                            ({reviewCount.toLocaleString()} reviews)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-405 italic font-bold">No Google rating available</div>
                    )}

                    {/* Physical Address & Phone */}
                    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-gray-600">
                      {comp.address && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600 font-semibold leading-relaxed line-clamp-2">{comp.address}</span>
                        </div>
                      )}
                      {comp.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="text-gray-600 font-semibold">{comp.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Website URL link */}
                    {comp.website ? (
                      <a 
                        href={comp.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-150 hover:border-[#336ffc]/30 hover:bg-[#336ffc]/5 hover:text-[#336ffc] transition-all text-xs font-bold text-gray-655 w-full"
                      >
                        <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="truncate flex-grow text-left">{comp.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#336ffc]" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-gray-50/50 border border-gray-150 text-xs font-bold text-gray-400 w-full cursor-not-allowed select-none">
                        <Globe className="h-4 w-4 text-gray-300 shrink-0" />
                        <span className="italic flex-grow text-left">No website resolved</span>
                      </div>
                    )}

                    {/* Social Media Links icons */}
                    <div className="flex items-center space-x-2 pt-1.5">
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" title="Instagram"
                          className="h-9 w-9 rounded-xl border border-gray-200 hover:border-pink-300 bg-white hover:bg-pink-50/20 text-pink-500 flex items-center justify-center transition-all shadow-sm">
                          <RiInstagramLine className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" title="Facebook"
                          className="h-9 w-9 rounded-xl border border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50/20 text-blue-600 flex items-center justify-center transition-all shadow-sm">
                          <RiFacebookCircleLine className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                          className="h-9 w-9 rounded-xl border border-gray-200 hover:border-sky-300 bg-white hover:bg-sky-50/20 text-sky-600 flex items-center justify-center transition-all shadow-sm">
                          <RiLinkedinBoxLine className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.youtube && (
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" title="YouTube"
                          className="h-9 w-9 rounded-xl border border-gray-200 hover:border-red-300 bg-white hover:bg-red-50/20 text-red-650 flex items-center justify-center transition-all shadow-sm">
                          <RiYoutubeLine className="h-5 w-5" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="X/Twitter"
                          className="h-9 w-9 rounded-xl border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-55 text-gray-800 flex items-center justify-center transition-all shadow-sm">
                          <RiTwitterXLine className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {!socialLinks.instagram && !socialLinks.facebook && !socialLinks.linkedin && !socialLinks.youtube && !socialLinks.twitter && (
                        <span className="text-xs text-gray-400 italic font-semibold">No social media links detected</span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    {/* View Details Link */}
                    {comp.id ? (
                      <Link 
                        href={`/competitor/${comp.id}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#5939fc] hover:text-[#336ffc] transition-colors cursor-pointer group/link"
                      >
                        <span>View Profile Details</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-400 italic font-semibold">Saving Profile...</span>
                    )}

                    {/* Google Maps Link */}
                    {googleMapsLink && (
                      <a 
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 border border-gray-200 hover:border-rose-200 hover:bg-rose-50/30 bg-white text-xs font-bold text-gray-650 hover:text-rose-600 rounded-lg shadow-sm transition-all flex items-center space-x-1 shrink-0"
                      >
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span>Maps Link</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 rounded-[2rem] border border-gray-100 bg-white shadow-xl text-center flex flex-col items-center justify-center space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-rose-500/5 blur-2xl pointer-events-none" />
            <AlertTriangle className="h-12 w-12 text-rose-500/80 animate-pulse" />
            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-gray-950 uppercase tracking-widest">No Competitors Discovered</h4>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed max-w-md">
                We did not discover other real physical business competitor listings related to category "{category}" inside location area "{city}". 
              </p>
            </div>
            {errorLogs.length > 0 && (
              <div className="text-xs text-rose-600 font-mono bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl max-w-md text-left select-text">
                <strong>Scraper Error Sighted:</strong> {errorLogs[0].message}
              </div>
            )}
            <button 
              onClick={clearAuditScan}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] font-extrabold text-xs sm:text-sm text-white cursor-pointer shadow-md border border-indigo-400/20"
            >
              Adjust Parameters & Re-Scan
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
