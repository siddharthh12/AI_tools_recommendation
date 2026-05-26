import React from 'react';
import Link from 'next/link';
import { 
  RiSearchEyeLine, 
  RiLineChartLine, 
  RiPlayListLine,
  RiArrowRightLine
} from 'react-icons/ri';

export default function Home() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 flex-grow flex flex-col justify-center">
      <div className="mx-auto max-w-4xl py-12 sm:py-20">
        
        {/* Top Feature Tag */}
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-gray-800 hover:ring-gray-700 bg-gray-950/40 backdrop-blur-sm">
            Announcing AI Discoverability Audit Phase 1.{' '}
            <Link href="/dashboard" className="font-semibold text-indigo-400">
              <span className="absolute inset-0" aria-hidden="true" />
              Launch Scan <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Is ChatGPT Recommending <br />
            <span className="text-gradient-purple-blue">Your Business?</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            Traditional SEO is evolving. Today, millions of buyers ask ChatGPT, Claude, and Gemini for business recommendations. Discover your <strong>AI Search Visibility</strong> and benchmark against competitors.
          </p>
          
          {/* Action CTAs */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="glow-btn rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center space-x-2 border border-indigo-400/20"
            >
              <span>Scan Your Brand Visibility</span>
              <RiArrowRightLine className="h-4 w-4" />
            </Link>
            <a 
              href="file:///c:/Users/Lenovo/per-project/AI_tools_recommending/docs/architecture-overview.md" 
              className="text-sm font-semibold leading-6 text-gray-300 hover:text-white flex items-center space-x-1"
            >
              <span>View Architecture</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mx-auto mt-20 max-w-5xl sm:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col hover:border-gray-700/50 transition-all group">
              <dt className="text-base font-semibold leading-7 text-white flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                  <RiSearchEyeLine className="h-6 w-6" />
                </div>
                <span>AI Recommendation Audits</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">
                  Automatically query large language models under specific transaction criteria to discover if your brand is recommended.
                </p>
              </dd>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col hover:border-gray-700/50 transition-all group">
              <dt className="text-base font-semibold leading-7 text-white flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                  <RiLineChartLine className="h-6 w-6" />
                </div>
                <span>AI Visibility Indexes</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">
                  Calculate weighted visibility indexes representing your overall discoverability share in SearchGPT, Gemini, and Claude.
                </p>
              </dd>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col hover:border-gray-700/50 transition-all group">
              <dt className="text-base font-semibold leading-7 text-white flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-all">
                  <RiPlayListLine className="h-6 w-6" />
                </div>
                <span>Actionable Optimizations</span>
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                <p className="flex-auto">
                  Receive structured schema optimizations, backlink directions, and copy enhancements to rise in LLM vector search indexes.
                </p>
              </dd>
            </div>

          </dl>
        </div>

      </div>
    </div>
  );
}
