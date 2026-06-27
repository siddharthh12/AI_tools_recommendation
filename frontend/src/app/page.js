import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  RiSearchEyeLine, 
  RiLineChartLine, 
  RiPlayListLine,
  RiArrowRightLine,
  RiCheckDoubleLine
} from 'react-icons/ri';
import { 
  Search, 
  Edit3, 
  Image as ImageIcon, 
  MessageSquare, 
  Star, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';

const WhatsAppIcon = ({ className = "h-4.5 w-4.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.46 3.473 1.334 4.982L2 22l5.209-1.365a9.92 9.92 0 004.8 1.233h.005c5.506 0 9.99-4.482 9.99-9.988C22.004 6.482 17.518 2 12.012 2zm6.208 14.153c-.27.761-1.562 1.393-2.146 1.474-.509.071-1.17.135-3.342-.766-2.779-1.153-4.576-3.978-4.716-4.162-.135-.185-1.135-1.507-1.135-2.876 0-1.369.72-2.043.977-2.313.256-.27.562-.338.751-.338h.54c.162 0 .378.063.535.438.162.388.558 1.36.608 1.464.05.104.085.225.014.36-.071.135-.108.225-.216.351-.108.126-.229.283-.328.383-.108.108-.22.225-.094.438.126.212.562.923 1.206 1.498.832.743 1.53.972 1.746 1.08.216.108.342.09.468-.054.126-.144.54-.63.684-.846.144-.216.288-.18.486-.108.198.072 1.256.594 1.472.702.216.108.36.162.414.252.054.09.054.522-.216 1.283z" />
  </svg>
);

export default function Home() {
  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col font-sans selection:bg-indigo-500/10 selection:text-indigo-600">
      
      {/* 1. HERO GRADIENT SECTION (Image 1) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full">
        <div className="rounded-[2rem] px-8 py-12 md:p-16 bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] text-white flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl relative">
          
          {/* Subtle background abstract blobs */}
          <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -z-10 h-60 w-60 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

          {/* Left Hero Copy */}
          <div className="flex-1 space-y-6 text-left max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Team of AI Agents that work for your Business Growth
            </h1>
            <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed max-w-lg">
              We automate keyword research, content optimizations, and review replies to multiply your organic Google Leads and keep your business recommended across leading AI platforms.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a 
                href="https://wa.me/#"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white text-gray-950 hover:bg-gray-50 text-sm font-black rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer select-none"
              >
                <WhatsAppIcon className="h-4.5 w-4.5 text-[#5939fc]" />
                <span>Book Free Demo</span>
              </a>

              <Link
                href="/dashboard"
                className="px-6 py-3.5 border border-white/30 hover:border-white text-white text-sm font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-white/10 transition-all shadow-md select-none"
              >
                <span>Launch AI Scanner</span>
                <RiArrowRightLine className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Phone Mockup (CSS-Styled iPhone Analytics Screen) */}
          <div className="shrink-0 relative select-none">
            {/* Phone shell container */}
            <div className="relative mx-auto border-gray-950 bg-gray-950 border-[10px] sm:border-[12px] rounded-[2.5rem] h-[460px] w-[230px] sm:h-[480px] sm:w-[240px] shadow-2xl overflow-hidden flex flex-col">
              
              {/* Dynamic Island */}
              <div className="absolute top-2 inset-x-0 h-4 bg-gray-950 rounded-full mx-auto w-24 z-30 flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-950/20" />
              </div>

              {/* Status bar */}
              <div className="px-5 pt-2 flex items-center justify-between text-[8px] font-black text-gray-400 select-none z-20 shrink-0">
                <span>10:30</span>
                <div className="flex items-center space-x-1">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Screen Content */}
              <div className="flex-grow bg-[#fcfdff] p-3 pt-4 text-gray-900 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-3">
                  
                  {/* Small logo header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black tracking-tight text-gray-900 uppercase">Analytics</div>
                      <div className="text-[7px] font-bold text-sky-600 flex items-center mt-0.5 cursor-pointer hover:text-sky-500">
                        Vashi, Navi Mumbai <span className="ml-0.5 text-[5px]">▼</span>
                      </div>
                    </div>
                    <span className="h-4.5 w-4.5 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-[7px] font-bold text-gray-500">
                      Peacock
                    </span>
                  </div>

                  <div className="border-t border-gray-100 my-1" />

                  {/* Section Title */}
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest text-left">Your Business</div>

                  {/* Revenue Main Card */}
                  <div className="bg-[#f2f6ff] border border-blue-50/60 rounded-xl p-3 text-left space-y-1">
                    <div className="text-[7px] text-gray-400 font-bold">Revenue</div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-sm font-black text-gray-950">₹2,26,345</div>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[6px] font-black rounded px-1.5 py-0.5">
                        ▲ ₹24,600 last month
                      </span>
                    </div>
                  </div>

                  {/* Grid Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Card 1 */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-left">
                      <div className="text-[6px] text-gray-400 font-bold">Total Sales</div>
                      <div className="text-xs font-black text-gray-950 mt-1">310</div>
                      <div className="text-[6px] text-emerald-500 font-bold mt-0.5 flex items-center">
                        ▲ 145
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-left">
                      <div className="text-[6px] text-gray-400 font-bold">Leads Added</div>
                      <div className="text-xs font-black text-gray-950 mt-1">549</div>
                      <div className="text-[6px] text-emerald-500 font-bold mt-0.5 flex items-center">
                        ▲ 240
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-left">
                      <div className="text-[6px] text-gray-400 font-bold">New Customers</div>
                      <div className="text-xs font-black text-gray-950 mt-1">176</div>
                      <div className="text-[6px] text-emerald-500 font-bold mt-0.5 flex items-center">
                        ▲ 45
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-left">
                      <div className="text-[6px] text-gray-400 font-bold">Repeat Customers</div>
                      <div className="text-xs font-black text-gray-950 mt-1">89</div>
                      <div className="text-[6px] text-emerald-500 font-bold mt-0.5 flex items-center">
                        ▲ 47
                      </div>
                    </div>

                  </div>
                </div>

                <div className="mt-3 text-[6px] text-gray-400 italic">
                  Live reports refreshed 1m ago
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. CORE SAAS AUDIT SCANNER INTRODUCTION */}
      <section id="how-it-works" className="py-16 bg-gray-50/50 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <RiSearchEyeLine className="h-3.5 w-3.5" />
              <span>AI Search Engine Visibility</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
              Are AI search engines recommending you?
            </h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Traditional search indexes are evolving. Today, millions of buyers ask ChatGPT, Gemini, and Perplexity for business suggestions. Check your discoverability share.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-left space-y-4 hover:shadow-md transition-all">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-600">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">1. Generate Queries</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                We automatically compile location and category-aware queries (e.g., "best gyms in vikhroli") to test platform answers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-left space-y-4 hover:shadow-md transition-all">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-600">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">2. Crawl Multi-Platform</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Our Playwright scripts execute searches on Perplexity, ChatGPT, and Gemini to capture raw text and citation source links.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-left space-y-4 hover:shadow-md transition-all">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-50 border border-purple-150 text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">3. Calculate Visibility</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Detect brand mentions, compare recommendation placement order, and render a comparative matrix scoreboard.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg border border-indigo-400/20"
            >
              <span>Scan Your Brand Visibility Now</span>
              <RiArrowRightLine className="h-4.5 w-4.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. MEET YOUR DIGITAL MARKETING AI TEAM SECTION (Image 3) */}
      <section id="about-us" className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-12">
        
        {/* Title block */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Meet Your <span className="bg-gradient-to-r from-[#5939fc] via-[#336ffc] to-[#04cbe6] bg-clip-text text-transparent">Digital Marketing AI Team</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold max-w-md mx-auto">
            Autonomous specialized agents taking control of your local search presence and generating high organic customer foot traffic.
          </p>
        </div>

        {/* Feature box card */}
        <div className="mx-auto max-w-5xl bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col lg:flex-row gap-8 items-stretch justify-between">
          
          {/* Left profile block */}
          <div className="flex-1 bg-gradient-to-b from-[#fffefc] to-[#fffbfa] border border-orange-100/40 rounded-2xl p-6 flex flex-col items-center justify-between text-center min-h-[360px] relative overflow-hidden shadow-inner">
            
            {/* Soft decorative background circles */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.04),transparent_70%)] pointer-events-none" />
            
            {/* Header Badge */}
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-gray-150 shadow-sm text-[9px] font-black uppercase tracking-wider text-gray-500 z-10">
              <span className="flex items-center space-x-0.5">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </span>
              <span>Business Profile</span>
              <span className="text-gray-300">|</span>
              <span className="text-indigo-600 flex items-center space-x-0.5">
                <Sparkles className="h-2.5 w-2.5 fill-current" />
                <span>AI Agent</span>
              </span>
            </div>

            {/* Avatar Headshot */}
            <div className="relative h-28 w-28 rounded-full border-4 border-white shadow-xl overflow-hidden mt-4 z-10 shrink-0 bg-gradient-to-tr from-purple-200 to-cyan-200">
              <Image
                src="/ai-agent-avatar.png"
                alt="Google Business Profile AI Agent avatar"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Text details */}
            <div className="space-y-1.5 z-10">
              <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                AI Agent to Get You More Leads from Google
              </h3>
              <p className="text-[10px] text-gray-400 font-semibold max-w-xs mx-auto">
                Publishes updates, responds to recommendations, and crafts GBP posts automatically.
              </p>
            </div>

            {/* CTA Book free demo */}
            <a 
              href="https://wa.me/#"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#4d6bfe] hover:bg-[#3d5be4] text-white text-[10px] font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all cursor-pointer z-10 w-full max-w-[180px]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              <span>Book Free Demo</span>
            </a>

          </div>

          {/* Right features checklist block */}
          <div className="flex-1 flex flex-col justify-center gap-4 text-left">
            
            {/* Feature 1 */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                <Search className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">SEO Keyword Discovery</h4>
                <p className="text-xs text-gray-500 font-medium">Finds the best SEO keywords for your business</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                <Edit3 className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">GBP Content Optimization</h4>
                <p className="text-xs text-gray-500 font-medium">Rewrites SEO-optimised GBP content and services</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
                <ImageIcon className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Automated Postings</h4>
                <p className="text-xs text-gray-500 font-medium">Auto-publishes SEO-powered GBP posts</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-xl bg-[#fff2f2] border border-red-105 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">GBP Review Replies</h4>
                <p className="text-xs text-gray-500 font-medium">Crafts SEO-rich replies to all Google reviews</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-xl bg-[#fff9e6] border border-amber-105 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                <Star className="h-4.5 w-4.5 fill-current" />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Review Campaigns</h4>
                <p className="text-xs text-gray-500 font-medium">Generates authentic Google reviews from your paid customers</p>
              </div>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
