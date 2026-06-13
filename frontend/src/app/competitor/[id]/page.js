'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import apiService from '../../../services/api';
import { 
  ArrowLeft,
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Award,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { 
  RiInstagramLine, 
  RiFacebookCircleLine, 
  RiLinkedinBoxLine, 
  RiYoutubeLine, 
  RiTwitterXLine 
} from 'react-icons/ri';

export default function CompetitorDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log(`[Competitor Detail]: Fetching competitor details for ID: ${id}`);
        const response = await apiService.getCompetitorProfileById(id);
        if (response.success && response.profile) {
          setProfile(response.profile);
        } else {
          throw new Error(response.message || 'Profile could not be loaded.');
        }
      } catch (err) {
        console.error('[Competitor Detail Error]:', err.message);
        setError(err.message || 'Failed to fetch competitor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

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
        stars.push(<Star key={i} className="h-4 w-4 text-gray-800 shrink-0" />);
      }
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Loading Competitor Profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px] py-12 px-4">
        <div className="glass-panel border border-rose-900 bg-rose-950/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-6 max-w-md shadow-2xl animate-fade-in">
          <div className="rounded-full h-12 w-12 bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-rose-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white leading-none">Failed to Load Profile</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              {error || 'Competitor profile not found in local files or Supabase.'}
            </p>
          </div>
          
          <button
            onClick={() => router.back()}
            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md"
          >
            <ArrowLeft className="h-4 w-4 text-gray-400" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const socialLinks = profile.social_links || profile.socialLinks || {};
  const reviewCount = profile.review_count || profile.reviewCount;
  const googleMapsLink = profile.google_maps_link || profile.googleMapsLink;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in relative">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-white bg-gray-950 border border-gray-900 hover:border-gray-800 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* 1. Profile Hero Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-900 bg-gray-950/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />
        
        <div className="space-y-3">
          {profile.category && (
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              {profile.category}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
            {profile.name}
          </h1>
          
          {profile.rating ? (
            <div className="flex items-center space-x-2 pt-1">
              {renderStars(profile.rating)}
              <span className="text-sm font-black text-white">{profile.rating}</span>
              {reviewCount !== undefined && reviewCount !== null && (
                <span className="text-xs text-gray-500 font-semibold">
                  ({reviewCount.toLocaleString()} Google reviews)
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No ratings discovered</p>
          )}
        </div>

        <div className="flex items-center space-x-3 self-start md:self-center">
          {googleMapsLink && (
            <a 
              href={googleMapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold text-rose-400 rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-rose-500/5"
            >
              <MapPin className="h-4 w-4" />
              <span>Google Maps Link</span>
            </a>
          )}
        </div>
      </div>

      {/* 2. Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Business Profiles & Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Contact & Address Card */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-900 pb-3">
              Location & Contact
            </h3>
            
            <div className="space-y-4">
              {profile.address ? (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-600" />
                    <span>Physical Address</span>
                  </div>
                  <p className="text-xs text-gray-300 font-semibold leading-relaxed pl-4.5 pt-0.5">
                    {profile.address}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-600 italic">No address visible</p>
              )}

              {profile.phone ? (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-gray-600" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-xs text-gray-300 font-semibold pl-4.5 pt-0.5">
                    {profile.phone}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-gray-600" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-xs text-gray-600 italic pl-4.5 pt-0.5">
                    No phone number visible
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Website metadata */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-900 pb-3">
              Website Details
            </h3>

            {profile.website ? (
              <div className="space-y-4">
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gray-950 border border-gray-900 hover:border-gray-800 hover:text-white transition-all text-xs font-semibold text-gray-400 w-full"
                >
                  <Globe className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span className="truncate flex-grow text-left">{profile.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-gray-650" />
                </a>

                <div className="space-y-2 text-[11px] leading-relaxed text-gray-400 bg-gray-950/40 p-3 rounded-xl border border-gray-900">
                  <div>
                    <span className="text-gray-500 font-bold block uppercase tracking-wider text-[9px] mb-0.5">Resolved URL</span>
                    <span className="text-gray-300 font-semibold break-all">{profile.website}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">No website resolved for this competitor</p>
            )}
          </div>

          {/* Social Links Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-900 bg-gray-950/20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-900 pb-3">
              Social Links
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center space-x-3 p-2.5 rounded-xl border border-gray-900 bg-gray-950/45 hover:bg-gray-950 text-xs font-bold text-gray-300 hover:text-white transition-all">
                  <RiInstagramLine className="h-4.5 w-4.5 text-pink-500 shrink-0" />
                  <span>Instagram Profile</span>
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center space-x-3 p-2.5 rounded-xl border border-gray-900 bg-gray-950/45 hover:bg-gray-950 text-xs font-bold text-gray-300 hover:text-white transition-all">
                  <RiFacebookCircleLine className="h-4.5 w-4.5 text-blue-500 shrink-0" />
                  <span>Facebook Page</span>
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center space-x-3 p-2.5 rounded-xl border border-gray-900 bg-gray-950/45 hover:bg-gray-950 text-xs font-bold text-gray-300 hover:text-white transition-all">
                  <RiLinkedinBoxLine className="h-4.5 w-4.5 text-sky-500 shrink-0" />
                  <span>LinkedIn Page</span>
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center space-x-3 p-2.5 rounded-xl border border-gray-900 bg-gray-950/45 hover:bg-gray-950 text-xs font-bold text-gray-300 hover:text-white transition-all">
                  <RiYoutubeLine className="h-4.5 w-4.5 text-red-500 shrink-0" />
                  <span>YouTube Channel</span>
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center space-x-3 p-2.5 rounded-xl border border-gray-900 bg-gray-950/45 hover:bg-gray-950 text-xs font-bold text-gray-300 hover:text-white transition-all">
                  <RiTwitterXLine className="h-4.5 w-4.5 text-gray-100 shrink-0" />
                  <span>X/Twitter Handle</span>
                </a>
              )}
              {!socialLinks.instagram && !socialLinks.facebook && !socialLinks.linkedin && !socialLinks.youtube && !socialLinks.twitter && (
                <p className="text-xs text-gray-600 italic text-center py-2">No social profiles discovered</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Description and Future Planning metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-900 bg-gray-950/20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-gray-900 pb-3">
              Extracted Business Intelligence Description
            </h3>
            <p className="text-sm text-gray-300 font-semibold leading-relaxed">
              {profile.description || 'No business description could be resolved.'}
            </p>
          </div>

          {/* Gap Analysis / AI Visibility Roadmap Mock */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-900 bg-gray-950/20 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-48 w-48 bg-purple-500/5 blur-[80px] pointer-events-none rounded-full" />
            
            <div className="border-b border-gray-900 pb-3 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Gap Analysis & AI Search Readiness (Preview)
              </h3>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-400 uppercase tracking-wide">
                Phase 8 Foundation
              </span>
            </div>

            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              This intelligence data establishes the metrics for calculating LLM search share, indexing authorities, and recommendations. Below is an exploratory readiness snapshot:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/40 text-center">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">AI Search Presence</div>
                <div className="text-xl font-black text-emerald-400">READY</div>
                <div className="text-[9px] text-gray-600 mt-1">Profile parameters fully extracted</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/40 text-center">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Extracted Authority</div>
                <div className="text-xl font-black text-indigo-400">
                  {profile.rating && reviewCount ? Math.round((profile.rating * 10) + Math.min(reviewCount / 100, 50)) : 'N/A'}
                </div>
                <div className="text-[9px] text-gray-600 mt-1">Based on local listing weight</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-gray-900 bg-gray-950/40 text-center">
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Optimizations Needed</div>
                <div className="text-xl font-black text-amber-500">2 ITEMS</div>
                <div className="text-[9px] text-gray-600 mt-1">Schema markup and backlinks</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Visibility Gap Indicators</span>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  <span>Physical Maps profile contains structural validation (Rating & Phone).</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300">
                  {profile.website ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0 animate-pulse" />
                  )}
                  <span>Official domain indexed and metadata descriptions present.</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300">
                  {Object.keys(socialLinks).length >= 2 ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                  )}
                  <span>Social media linkages visible for secondary backlink crawling (Found: {Object.keys(socialLinks).length}).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrape Metadata Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] text-gray-500 font-semibold bg-gray-950/10 border border-gray-900 p-4 rounded-xl">
            <span className="flex items-center space-x-1">
              <Search className="h-3.5 w-3.5 text-gray-600" />
              <span>Source Query: <span className="text-gray-400 normal-case">{profile.source_query || profile.sourceQuery}</span></span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-gray-600" />
              <span>Extracted At: <span className="text-gray-400">{new Date(profile.created_at || profile.updated_at).toLocaleString()}</span></span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
