'use client';

import React, { useState } from 'react';
import apiService from '@/services/api';
import { getScoreColor } from '@/lib/utils';
import { 
  RiScan2Line, 
  RiLightbulbFlashLine, 
  RiCloseLine, 
  RiCompass3Fill,
  RiCheckDoubleLine,
  RiAlertLine
} from 'react-icons/ri';

export default function Dashboard() {
  // Input parameters state
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [competitors, setCompetitors] = useState('');

  // Scanning status and response report states
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [report, setReport] = useState(null);

  // Handles form submission
  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!businessName) return;

    setStatus('scanning');
    setErrorMsg('');
    setReport(null);

    try {
      // Direct call to Express backend scan API
      const response = await apiService.scanBusiness({
        businessName,
        industry,
        competitors
      });

      if (response.success) {
        setReport(response.data);
        setStatus('success');
      } else {
        throw new Error(response.message || 'Verification scan failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server error occurred during scan process. Verify that your backend is active.');
      setStatus('error');
    }
  };

  // Resets search dashboard back to idle state
  const handleReset = () => {
    setStatus('idle');
    setReport(null);
    setErrorMsg('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col justify-center">
      
      {/* Dashboard Header */}
      <div className="mb-8 border-b border-gray-900 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          AI Discoverability Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Analyze how search models interpret and recommend your brand keywords.
        </p>
      </div>

      {/* Main Grid: Input Form vs Results Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Parameter Form */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 border border-gray-800">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2 mb-5">
            <RiScan2Line className="text-indigo-400 h-5 w-5 animate-pulse" />
            <span>Launch Brand Audit</span>
          </h2>

          <form onSubmit={handleScanSubmit} className="space-y-5">
            
            {/* Business Name */}
            <div>
              <label htmlFor="business-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Business Brand Name *
              </label>
              <input
                id="business-name"
                type="text"
                required
                disabled={status === 'scanning'}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-gray-950/60 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* Industry Verticals */}
            <div>
              <label htmlFor="industry" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Industry Sector
              </label>
              <input
                id="industry"
                type="text"
                disabled={status === 'scanning'}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Fintech, E-Commerce, SaaS"
                className="w-full bg-gray-950/60 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* Competitors */}
            <div>
              <label htmlFor="competitors" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Competitors (Comma Separated)
              </label>
              <textarea
                id="competitors"
                rows="3"
                disabled={status === 'scanning'}
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                placeholder="e.g. Globex Corp, Initech Inc"
                className="w-full bg-gray-950/60 border border-gray-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* Submit Scan */}
            <button
              type="submit"
              disabled={!businessName || status === 'scanning'}
              className="w-full glow-btn rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-850 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'scanning' ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Running LLM Audits...</span>
                </>
              ) : (
                <>
                  <RiScan2Line className="h-4 w-4" />
                  <span>Execute Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic Output Display */}
        <div className="lg:col-span-2 flex flex-col justify-center min-h-[350px]">
          
          {/* A: IDLE STATE DISPLAY */}
          {status === 'idle' && (
            <div className="glass-panel border-dashed border-2 border-gray-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
              <RiCompass3Fill className="h-14 w-14 text-gray-700 mb-4" />
              <h3 className="text-lg font-bold text-gray-300">Awaiting Search Request</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Fill out the discoverability form on the left and click **Execute Analysis** to trigger search audits and compile recommendation scores.
              </p>
            </div>
          )}

          {/* B: LOADING STATE CRAWLER DISPLAY */}
          {status === 'scanning' && (
            <div className="glass-panel border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative flex items-center justify-center h-20 w-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/20 opacity-75"></span>
                <div className="relative rounded-full h-16 w-16 bg-indigo-950 flex items-center justify-center border border-indigo-500/40">
                  <RiScan2Line className="h-8 w-8 text-indigo-400 animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Scraping Web Citations</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                  Playwright is launching a Chromium browser sandbox behind the scenes, scanning search models, and mapping comparative brand citation indexes.
                </p>
              </div>
            </div>
          )}

          {/* C: ERROR STATE DISPLAY */}
          {status === 'error' && (
            <div className="glass-panel border border-rose-950 bg-rose-950/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4">
              <RiAlertLine className="h-12 w-12 text-rose-500" />
              <h3 className="text-lg font-bold text-white">Scan Failure Encountered</h3>
              <p className="text-sm text-gray-300 max-w-md">
                {errorMsg}
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-900 border border-gray-800 text-sm text-white rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-1"
              >
                <RiCloseLine className="h-4 w-4" />
                <span>Dismiss &amp; Clear</span>
              </button>
            </div>
          )}

          {/* D: AUDIT REPORT SUCCESS DISPLAY */}
          {status === 'success' && report && (
            <div className="space-y-6">
              
              {/* Header Box & Overall Index Card */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wide">
                      Active Scan Report
                    </span>
                    <span className="text-xs text-gray-500">Live Scraped</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-1">
                    {report.businessName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Sector: <span className="text-gray-300">{report.industry}</span>
                  </p>
                </div>

                <div className={`p-4 rounded-xl border flex items-center space-x-4 ${getScoreColor(report.overallScore).bg}`}>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-white">
                      {report.overallScore}<span className="text-xs text-gray-400">/100</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      Visibility Score
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-850" />
                  <span className={`text-xs font-semibold ${getScoreColor(report.overallScore).text}`}>
                    {getScoreColor(report.overallScore).label}
                  </span>
                </div>
              </div>

              {/* Models Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* ChatGPT */}
                <div className="glass-panel p-4 rounded-xl text-center border border-gray-800 hover:border-gray-700/50 transition-all">
                  <span className="text-xs font-bold text-gray-400 uppercase">ChatGPT</span>
                  <div className="text-2xl font-extrabold text-white mt-2">
                    {report.breakdown.chatgpt}%
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${getScoreColor(report.breakdown.chatgpt).fill}`}
                      style={{ width: `${report.breakdown.chatgpt}%` }}
                    />
                  </div>
                </div>

                {/* Claude */}
                <div className="glass-panel p-4 rounded-xl text-center border border-gray-800 hover:border-gray-700/50 transition-all">
                  <span className="text-xs font-bold text-gray-400 uppercase">Claude</span>
                  <div className="text-2xl font-extrabold text-white mt-2">
                    {report.breakdown.claude}%
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${getScoreColor(report.breakdown.claude).fill}`}
                      style={{ width: `${Math.min(100, report.breakdown.claude)}%` }}
                    />
                  </div>
                </div>

                {/* Gemini */}
                <div className="glass-panel p-4 rounded-xl text-center border border-gray-800 hover:border-gray-700/50 transition-all">
                  <span className="text-xs font-bold text-gray-400 uppercase">Gemini</span>
                  <div className="text-2xl font-extrabold text-white mt-2">
                    {report.breakdown.gemini}%
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${getScoreColor(report.breakdown.gemini).fill}`}
                      style={{ width: `${report.breakdown.gemini}%` }}
                    />
                  </div>
                </div>

                {/* Perplexity */}
                <div className="glass-panel p-4 rounded-xl text-center border border-gray-800 hover:border-gray-700/50 transition-all">
                  <span className="text-xs font-bold text-gray-400 uppercase">Perplexity</span>
                  <div className="text-2xl font-extrabold text-white mt-2">
                    {report.breakdown.perplexity}%
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${getScoreColor(report.breakdown.perplexity).fill}`}
                      style={{ width: `${report.breakdown.perplexity}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Competitors Gap Audit */}
              {report.competitors && report.competitors.length > 0 && (
                <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                    Competitor Share Gap Analysis
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-900 text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 font-semibold">
                          <th className="pb-3">Brand Profile</th>
                          <th className="pb-3">Visibility Share</th>
                          <th className="pb-3 text-right">Discoverability Index Gap</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-900 text-gray-300">
                        {/* Target brand row */}
                        <tr className="font-semibold text-white">
                          <td className="py-3 flex items-center space-x-1">
                            <span>{report.businessName}</span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px]">Target</span>
                          </td>
                          <td className="py-3">{report.overallScore}%</td>
                          <td className="py-3 text-right text-indigo-400 font-bold">--</td>
                        </tr>
                        {/* Competitors rows */}
                        {report.competitors.map((comp) => {
                          const gapVal = report.overallScore - comp.score;
                          return (
                            <tr key={comp.name}>
                              <td className="py-3">{comp.name}</td>
                              <td className="py-3">{comp.score}%</td>
                              <td className={`py-3 text-right font-bold ${gapVal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {gapVal >= 0 ? `+${gapVal}% ahead` : `${gapVal}% behind`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recommendations Box */}
              <div className="glass-panel p-5 rounded-2xl border border-gray-800">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <RiLightbulbFlashLine className="text-amber-400 h-5 w-5" />
                  <span>Actionable Discoverability Optimizations</span>
                </h4>
                <ul className="space-y-3.5">
                  {report.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-gray-300">
                      <RiCheckDoubleLine className="text-emerald-400 h-5 w-5 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clear Scan CTA */}
              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-850 hover:border-gray-700 text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  Clear scan &amp; run another brand
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
