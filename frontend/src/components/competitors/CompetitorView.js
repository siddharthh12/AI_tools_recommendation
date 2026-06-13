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
        stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-500/40 text-amber-500 shrink-0" />);
      } else {
        stars.push(<Star key={i} className="h-3.5 w-3.5 text-gray-800 shrink-0" />);
      }
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  return (
    <div className="space-y-8 py-2 animate-fade-in">
      
      {/* 1. Header Information Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 text-indigo-400">
            <Users className="h-5 w-5" />
            <h3 className="text-xs font-black uppercase tracking-wider font-extrabold">Real-World Competitor Discovery</h3>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
            Scan Results for <span className="text-indigo-400">"{businessName}"</span>
          </h2>
          <p className="text-xs text-gray-500 font-semibold leading-none">
            Targeting Vertical: <span className="text-gray-300">{category}</span> &middot; Location: <span className="text-gray-300">{city}</span>
          </p>
        </div>

        {/* Emerald green Live Data Trust Banner */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-extrabold uppercase tracking-wide w-fit select-none shadow-md shadow-emerald-500/5 select-none self-start md:self-center">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
          <span>Live Data Extracted & Enriched</span>
        </div>
      </div>

      {/* 2. Debug Panel (Playwright Console & Statistics Widget) */}
      <div className="glass-panel border border-gray-900 bg-gray-950/45 rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={() => setIsDebugExpanded(!isDebugExpanded)}
          className="w-full px-5 py-4 bg-gray-950/70 border-b border-gray-900 flex items-center justify-between hover:bg-gray-950/90 transition-all focus:outline-none"
        >
          <div className="flex items-center space-x-2.5">
            <Terminal className="h-4.5 w-4.5 text-indigo-400" />
            <span className="text-xs font-black text-white uppercase tracking-wider">Playwright Scraping Debug Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800 text-[10px] font-bold text-gray-400">
              <Activity className="h-3 w-3 text-indigo-400" />
              <span className="uppercase font-semibold">{browserStatus}</span>
            </div>
            {isDebugExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </div>
        </button>

        {isDebugExpanded && (
          <div className="p-5 space-y-5">
            {/* Quick Scrape Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/20">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Generated Queries</div>
                <div className="text-lg font-black text-white">{queries.length}</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/20">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Enriched Competitors</div>
                <div className="text-lg font-black text-white">{competitors.length}</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/20">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Failed Searches</div>
                <div className="text-lg font-black text-rose-500">{errorLogs.length}</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/20">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Crawler Status</div>
                <div className="text-lg font-black text-indigo-400 capitalize">Done</div>
              </div>
            </div>

            {/* Generated Queries Badges */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 block">Executed Search Phrases</span>
              <div className="flex flex-wrap gap-2">
                {queries.map((q, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-900 bg-gray-950 text-xs font-semibold text-gray-300"
                  >
                    <Search className="h-3 w-3 text-gray-600" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrollable Real-time Browser Log Terminal Console */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-500 block">Browser Activity Console Logs</span>
              <div className="h-44 rounded-xl border border-gray-900 bg-gray-950 p-4 font-mono text-[10px] leading-relaxed text-gray-400 overflow-y-auto space-y-1.5 scrollbar-thin select-text">
                {logs.length > 0 ? (
                  logs.map((log, index) => {
                    let typeColor = 'text-gray-400';
                    if (log.type === 'error') typeColor = 'text-rose-500';
                    if (log.type === 'warn') typeColor = 'text-amber-500';
                    
                    return (
                      <div key={index} className="flex items-start space-x-2 select-text">
                        <span className="text-gray-600 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-indigo-500 shrink-0 select-none font-bold">[{log.component}]</span>
                        <span className={`${typeColor} select-text`}>{log.message}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-600 italic">No browser console logs loaded.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Competitor Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">Enriched Local Competitors</h3>
          <button 
            onClick={clearAuditScan}
            className="px-3.5 py-1.5 border border-gray-800 hover:border-gray-700 bg-gray-950 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white cursor-pointer transition-all"
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
              const sourceQuery = comp.sourceQuery || comp.source_query;

              return (
                <div 
                  key={idx} 
                  className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/20 hover:border-gray-800/80 transition-all flex flex-col justify-between space-y-5 group relative"
                >
                  {/* Position ranking tag */}
                  <span className="absolute top-6 right-6 h-7 w-7 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 shadow-sm select-none">
                    #{idx + 1}
                  </span>

                  <div className="space-y-4">
                    {/* Brand Name & Category Badge */}
                    <div className="space-y-1.5 pr-8">
                      <h4 className="text-base font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                        {comp.name}
                      </h4>
                      {comp.category && (
                        <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-extrabold text-indigo-400 uppercase tracking-wider">
                          {comp.category}
                        </span>
                      )}
                    </div>

                    {/* Google Ratings Indicator */}
                    {rating !== undefined && rating !== null ? (
                      <div className="flex items-center space-x-2 bg-gray-950/50 p-2.5 rounded-xl border border-gray-900/60 w-fit">
                        {renderStars(rating)}
                        <span className="text-xs font-black text-white">{rating}</span>
                        {reviewCount !== undefined && reviewCount !== null && (
                          <span className="text-[10px] text-gray-500 font-semibold">
                            ({reviewCount.toLocaleString()} reviews)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-600 italic">No Google rating available</div>
                    )}

                    {/* Physical Address & Phone */}
                    <div className="space-y-1.5 text-[11px] leading-relaxed text-gray-400">
                      {comp.address && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="text-gray-300 font-semibold leading-relaxed line-clamp-2">{comp.address}</span>
                        </div>
                      )}
                      {comp.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="text-gray-400 font-semibold">{comp.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Website URL link */}
                    {comp.website ? (
                      <a 
                        href={comp.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-950 border border-gray-900 hover:border-gray-800 hover:text-white transition-all text-xs font-semibold text-gray-400 w-full"
                      >
                        <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="truncate flex-grow text-left">{comp.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-600 group-hover:text-gray-400" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-950/40 border border-gray-900/50 text-xs font-semibold text-gray-600 w-full cursor-not-allowed">
                        <Globe className="h-4 w-4 text-gray-800 shrink-0" />
                        <span className="italic flex-grow text-left">No website resolved</span>
                      </div>
                    )}

                    {/* Social Media Link Icons Row */}
                    <div className="flex items-center space-x-2 pt-1">
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" title="Instagram"
                          className="h-8 w-8 rounded-lg border border-gray-900 hover:border-gray-800 bg-gray-950/60 hover:bg-gray-950 text-pink-500 flex items-center justify-center transition-all">
                          <RiInstagramLine className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" title="Facebook"
                          className="h-8 w-8 rounded-lg border border-gray-900 hover:border-gray-800 bg-gray-950/60 hover:bg-gray-950 text-blue-500 flex items-center justify-center transition-all">
                          <RiFacebookCircleLine className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                          className="h-8 w-8 rounded-lg border border-gray-900 hover:border-gray-800 bg-gray-950/60 hover:bg-gray-950 text-sky-500 flex items-center justify-center transition-all">
                          <RiLinkedinBoxLine className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.youtube && (
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" title="YouTube"
                          className="h-8 w-8 rounded-lg border border-gray-900 hover:border-gray-800 bg-gray-950/60 hover:bg-gray-950 text-red-500 flex items-center justify-center transition-all">
                          <RiYoutubeLine className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="X/Twitter"
                          className="h-8 w-8 rounded-lg border border-gray-900 hover:border-gray-800 bg-gray-950/60 hover:bg-gray-950 text-gray-100 flex items-center justify-center transition-all">
                          <RiTwitterXLine className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {!socialLinks.instagram && !socialLinks.facebook && !socialLinks.linkedin && !socialLinks.youtube && !socialLinks.twitter && (
                        <span className="text-[10px] text-gray-600 italic">No social media links detected</span>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-4 border-t border-gray-900/60 flex items-center justify-between gap-4">
                    {/* View Details Link */}
                    {comp.id ? (
                      <Link 
                        href={`/competitor/${comp.id}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer group/link"
                      >
                        <span>View Profile Details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    ) : (
                      <span className="text-[10px] text-gray-650 italic">Saving Profile...</span>
                    )}

                    {/* Google Maps launcher */}
                    {googleMapsLink && (
                      <a 
                        href={googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 border border-gray-900 hover:border-gray-800 bg-gray-950/60 text-[10px] font-bold text-gray-400 hover:text-white rounded-lg transition-all flex items-center space-x-1 shrink-0"
                      >
                        <MapPin className="h-3 w-3 text-rose-500" />
                        <span>Maps Link</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-10 rounded-2xl border border-gray-900 bg-gray-950/20 text-center flex flex-col items-center justify-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-rose-500/80 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white uppercase tracking-widest">No Competitors Discovered</h4>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md">
                We did not discover other real physical business competitor listings related to category "{category}" inside location area "{city}". 
              </p>
            </div>
            {errorLogs.length > 0 && (
              <div className="text-[10px] text-rose-400 font-mono bg-rose-950/10 border border-rose-900/40 px-4 py-2.5 rounded-xl max-w-md text-left select-text">
                <strong>Scraper Error Sighted:</strong> {errorLogs[0].message}
              </div>
            )}
            <button 
              onClick={clearAuditScan}
              className="glow-btn px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-xs text-white cursor-pointer shadow-md"
            >
              Adjust Parameters & Re-Scan
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
