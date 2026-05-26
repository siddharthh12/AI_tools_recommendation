'use client';

import React, { useState } from 'react';
import apiService from '@/services/api';
import QueryForm from '@/components/QueryForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import VisibilityMeter from '@/components/VisibilityMeter';
import BreakdownChart from '@/components/BreakdownChart';
import RankingInsights from '@/components/RankingInsights';
import QueryResults from '@/components/QueryResults';

import { 
  RiCompass3Fill,
  RiCloseLine,
  RiAlertLine,
  RiRefreshLine
} from 'react-icons/ri';

export default function Dashboard() {
  // Brand audit coordinates state
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Scraper status and report payload states
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [report, setReport] = useState(null);

  // Handles query engine form submission
  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !category || !city) return;

    setStatus('scanning');
    setErrorMsg('');
    setReport(null);

    try {
      // Connects directly to backend Playwright + Heuristic Scoring endpoint (POST /api/score/calculate)
      const response = await apiService.executeQueryEngine({
        business: businessName,
        category: category,
        city: city
      });

      if (response.success) {
        setReport(response);
        setStatus('success');
      } else {
        throw new Error(response.message || 'Scraper execution returned a failure state.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.message || 'Scraper engine timed out. Verify your backend server is online and running at localhost:5000.'
      );
      setStatus('error');
    }
  };

  // Clears active report state
  const handleClear = () => {
    setStatus('idle');
    setReport(null);
    setErrorMsg('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col justify-center">
      
      {/* Dashboard Title Panel */}
      <div className="mb-8 border-b border-gray-900 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            AI Visibility Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Audit brand discoverability ratios, trace competitor ranks, and analyze website SEO signals.
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
              <h3 className="text-lg font-bold text-gray-300">Awaiting Engine Inputs</h3>
              <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                Configure your brand name, market category, and city on the left. Click **Execute Perplexity Crawl** to run automated Playwright searches and compile visibility scores.
              </p>
            </div>
          )}

          {/* B: LOADING STATE STEP TRANSITIONS VIEW */}
          {status === 'scanning' && (
            <LoadingSpinner />
          )}

          {/* C: ERROR STATE EXCEPTION DIALOG VIEW */}
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
          {status === 'success' && report && (
            <div className="space-y-6">
              
              {/* Scorecard Visual gauge & progress breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
                <div className="md:col-span-2">
                  <VisibilityMeter score={report.overallScore} />
                </div>
                <div className="md:col-span-3">
                  <BreakdownChart breakdown={report.breakdown} />
                </div>
              </div>

              {/* Actionable recommendations insights */}
              <RankingInsights
                breakdown={report.breakdown}
                reviewData={report.reviewData}
                authorityData={report.authorityData}
                businessName={businessName}
              />

              {/* Step-by-step query lists details */}
              <QueryResults
                queries={report.queries}
                targetBusiness={businessName}
              />

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
