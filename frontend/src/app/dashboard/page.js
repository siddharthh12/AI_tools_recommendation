'use client';

import React, { useState } from 'react';
import apiService from '@/services/api';
import QueryForm from '@/components/QueryForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import VisibilityMeter from '@/components/VisibilityMeter';
import BreakdownChart from '@/components/BreakdownChart';
import RankingInsights from '@/components/RankingInsights';
import CompetitorCard from '@/components/CompetitorCard';
import ComparisonTable from '@/components/ComparisonTable';
import RecommendationPanel from '@/components/RecommendationPanel';
import RecommendationCard from '@/components/RecommendationCard';
import QueryResults from '@/components/QueryResults';

import { 
  RiCompass3Fill,
  RiCloseLine,
  RiAlertLine,
  RiRefreshLine,
  RiGroupLine,
  RiLineChartLine
} from 'react-icons/ri';

export default function Dashboard() {
  // Brand audit coordinates state
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Scraper status and report payload states
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');
  
  const [report, setReport] = useState(null); // Visibility scores report
  const [compReport, setCompReport] = useState(null); // Competitors analysis report
  const [recReport, setRecReport] = useState(null); // Recommendations report

  // Handles query engine form submission
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !category || !city) return;

    setStatus('scanning');
    setErrorMsg('');
    setReport(null);
    setCompReport(null);
    setRecReport(null);

    try {
      // Connects concurrently to backend Scoring API, Competitor Analysis API, and Recommendations API
      const [scoreRes, compRes, recRes] = await Promise.all([
        apiService.executeQueryEngine({
          business: businessName,
          category: category,
          city: city
        }),
        apiService.executeCompetitorAnalysis({
          business: businessName,
          category: category,
          city: city
        }),
        apiService.generateRecommendations({
          business: businessName,
          category: category,
          city: city
        })
      ]);

      if (scoreRes.success && compRes.success && recRes.success) {
        setReport(scoreRes);
        setCompReport(compRes);
        setRecReport(recRes);
        setStatus('success');
      } else {
        throw new Error('Dynamic crawling audits compiled a failure state.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message || 'Scraper engine timed out. Verify your backend server is online and running at localhost:5000.'
      );
      setStatus('error');
    }
  };

  // Clears active reports state
  const handleClear = () => {
    setStatus('idle');
    setReport(null);
    setCompReport(null);
    setRecReport(null);
    setErrorMsg('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col justify-center">
      
      {/* Dashboard Title Panel */}
      <div className="mb-8 border-b border-gray-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            AI Discoverability Center
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Probe AI recommendation systems, calculate visibility score breakdowns, and chart competitor gap metrics.
          </p>
        </div>
        {status === 'success' && (
          <button
            onClick={handleClear}
            className="self-start sm:self-center px-4 py-2 border border-gray-800 hover:border-gray-700 bg-gray-900 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
          >
            <RiRefreshLine className="h-4 w-4" />
            <span>Reset Search</span>
          </button>
        )}
      </div>

      {/* Grid: Left Inputs Form vs Right Analytics Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Inputs Form */}
        <div className="lg:col-span-1">
          <QueryForm
            businessName={businessName}
            setBusinessName={setBusinessName}
            category={category}
            setCategory={setCategory}
            city={city}
            setCity={setCity}
            onSubmit={handleQuerySubmit}
            disabled={status === 'scanning'}
          />
        </div>

        {/* Right Analytics Screen */}
        <div className="lg:col-span-2 flex flex-col justify-center min-h-[350px]">
          
          {/* A: IDLE STATE VIEW */}
          {status === 'idle' && (
            <div className="glass-panel border-dashed border-2 border-gray-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center bg-gray-950/20">
              <RiCompass3Fill className="h-16 w-16 text-gray-700 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-gray-300">Awaiting Discovery Targets</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Configure your brand name, market category, and city on the left. Click **Execute Perplexity Crawl** to run automated Playwright searches, evaluate discoverability, and benchmark competitors.
              </p>
            </div>
          )}

          {/* B: LOADING STATE VIEW */}
          {status === 'scanning' && (
            <LoadingSpinner />
          )}

          {/* C: ERROR STATE VIEW */}
          {status === 'error' && (
            <div className="glass-panel border border-rose-900 bg-rose-950/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-5 max-w-md mx-auto shadow-2xl">
              <div className="rounded-full h-12 w-12 bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <RiAlertLine className="h-6 w-6 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Scraper Execution Fault</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-900 border border-gray-800 text-xs font-bold text-white rounded-xl hover:bg-gray-800 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <RiCloseLine className="h-4 w-4" />
                <span>Clear &amp; Try Again</span>
              </button>
            </div>
          )}

          {/* D: AUDIT REPORT SUCCESS DISPLAY VIEW */}
          {status === 'success' && report && compReport && (
            <div className="space-y-8">
              
              {/* SECTION 1: OVERALL DISCOVERABILITY SCORES */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <RiLineChartLine className="h-5 w-5" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Overall Discoverability Indexes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
                  <div className="md:col-span-2">
                    <VisibilityMeter score={report.overallScore} />
                  </div>
                  <div className="md:col-span-3">
                    <BreakdownChart breakdown={report.breakdown} />
                  </div>
                </div>

                <RankingInsights
                  breakdown={report.breakdown}
                  reviewData={report.reviewData}
                  authorityData={report.authorityData}
                  businessName={businessName}
                />
              </div>

              {/* SECTION 2: COMPETITOR GAPS CONTRAST PANEL */}
              {compReport.topCompetitors && compReport.topCompetitors.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-gray-900">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <RiGroupLine className="h-5 w-5" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-black">Competitor Gaps Analysis</h3>
                  </div>

                  {/* Competitor cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {compReport.topCompetitors.slice(0, 2).map((comp) => (
                      <CompetitorCard key={comp.name} competitor={comp} />
                    ))}
                  </div>

                  {/* Side-by-side signal grid table */}
                  <ComparisonTable
                    targetName={businessName}
                    targetMetrics={{
                      mentions: report.queries.reduce((acc, qRun) => acc + (qRun.results?.some(r => r.name.toLowerCase() === businessName.toLowerCase().trim()) ? 1 : 0), 0),
                      averagePosition: parseFloat((report.queries.reduce((acc, qRun) => {
                        const found = qRun.results?.find(r => r.name.toLowerCase() === businessName.toLowerCase().trim());
                        return found ? acc + found.position : acc;
                      }, 0) / (report.queries.reduce((acc, qRun) => acc + (qRun.results?.some(r => r.name.toLowerCase() === businessName.toLowerCase().trim()) ? 1 : 0), 0) || 1)).toFixed(1)),
                      rating: report.reviewData.rating,
                      reviewCount: report.reviewData.reviewCount,
                      domainAuthority: report.authorityData.domainAuthority,
                      redditScore: report.breakdown.reviews, // proxy score mapping
                      faqScore: report.breakdown.authority // proxy score mapping
                    }}
                    competitorsList={compReport.topCompetitors}
                  />

                  {/* Actionable recommendations panel */}
                  <RecommendationPanel
                    recommendations={compReport.topCompetitors[0]?.recommendations || []}
                  />
                </div>
              )}

              {/* SECTION 3: STRATEGIC RECOMMENDATIONS PLAYBOOK */}
              {recReport && recReport.recommendations && recReport.recommendations.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-gray-900">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <RiCompass3Fill className="h-5 w-5" />
                    <h3 className="text-xs font-bold uppercase tracking-wider font-black">Strategic Optimization Playbook</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recReport.recommendations.map((rec, idx) => (
                      <RecommendationCard key={idx} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: RAW CRAWL ACCORDIONS */}
              <div className="pt-4 border-t border-gray-900">
                <QueryResults
                  queries={report.queries}
                  targetBusiness={businessName}
                />
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
