'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiService from '../services/api';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication states
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Sync auth state and handle login redirection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth-token');
      const storedUser = localStorage.getItem('auth-user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        // Redirect to login if user tries to access dashboard paths without credentials
        if (pathname && pathname.startsWith('/dashboard')) {
          router.push('/login');
        }
      }
    }
  }, [pathname, router]);

  // Navigation active tab: 'dashboard' | 'home' | 'competitors'
  const [activeSection, setActiveSection] = useState('dashboard');

  // Active search coordinates
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Scanning/Crawl statuses
  const [status, setStatus] = useState('idle'); // idle | scanning | enriching | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Results states
  const [competitors, setCompetitors] = useState([]);
  const [queries, setQueries] = useState([]);
  const [logs, setLogs] = useState([]);
  const [browserStatus, setBrowserStatus] = useState('idle');

  // Enrichment Specific States
  const [enrichmentProgress, setEnrichmentProgress] = useState({ current: 0, total: 0, competitor: '', statusText: '' });
  const [enrichmentDetails, setEnrichmentDetails] = useState({ rating: null, reviewCount: null, websiteFound: false, socialsFound: [], failures: [] });
  const [enrichmentLogs, setEnrichmentLogs] = useState([]);

  // AI Visibility States
  const [visibilityStatus, setVisibilityStatus] = useState('idle'); // idle | running | success | error
  const [visibilityData, setVisibilityData] = useState(null);
  const [visibilityLogs, setVisibilityLogs] = useState([]);

  // Search Audit History Recalls (Prefilled with realistic gym startup coordinates)
  const [searchHistory, setSearchHistory] = useState([
    { business: "Be Strong Gym", category: "Gym", city: "Vikhroli, Mumbai" }
  ]);

  // Sidebar Layout Collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Theme Toggle: 'dark' | 'light'
  const [theme, setTheme] = useState('dark');

  // Load theme and search history from localStorage on mount (browser only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');

      const savedHistory = localStorage.getItem('dashboard-history');
      if (savedHistory) {
        try {
          setSearchHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Failed to parse search history', e);
        }
      }
    }
  }, []);

  // Sync theme changes with DOM class lists
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-theme', nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  // Triggers unified Playwright competitor search scan and sequential enrichment
  const triggerAuditScan = async (searchCoords) => {
    const { business, category: cat, city: ct } = searchCoords;
    if (!business || !cat || !ct) return;

    // Set search coordinates state
    setBusinessName(business);
    setCategory(cat);
    setCity(ct);

    setStatus('scanning');
    setErrorMsg('');
    setCompetitors([]);
    setQueries([]);
    setLogs([]);
    setBrowserStatus('launching');
    setEnrichmentProgress({ current: 0, total: 0, competitor: '', statusText: '' });
    setEnrichmentDetails({ rating: null, reviewCount: null, websiteFound: false, socialsFound: [], failures: [] });
    setEnrichmentLogs([]);

    try {
      console.log(`[Dashboard Context] Dispatching discovery search coordinate scan...`);
      const response = await apiService.discoverCompetitors({
        brand: business,
        category: cat,
        location: ct
      });

      if (response.success) {
        setQueries(response.queries);
        if (response.debug) {
          setLogs(response.debug.logs || []);
          setBrowserStatus(response.debug.browserStatus || 'done');
        }

        const discoveredList = response.competitors || [];
        if (discoveredList.length === 0) {
          setCompetitors([]);
          setStatus('success');
          setActiveSection('competitors');
          return;
        }

        // Switch automatically to competitor intelligence enrichment phase
        setStatus('enriching');
        setEnrichmentProgress({
          current: 0,
          total: discoveredList.length,
          competitor: 'Initializing Enrichment Engine...',
          statusText: 'starting'
        });

        const sourceQuery = response.queries[0] || `Google Search: ${cat} in ${ct}`;
        
        console.log(`[Dashboard Context] Starting enrichment streaming for ${discoveredList.length} competitors...`);
        const enrichedResults = await apiService.enrichCompetitorsStream(
          discoveredList,
          sourceQuery,
          (progressData) => {
            if (progressData.progress) {
              setEnrichmentProgress({
                current: progressData.progress.current,
                total: progressData.progress.total,
                competitor: progressData.currentCompetitor || '',
                statusText: progressData.status || ''
              });
            }
            if (progressData.details) {
              setEnrichmentDetails(progressData.details);
            }
            if (progressData.logs) {
              setEnrichmentLogs(progressData.logs);
            }
          }
        );

        setCompetitors(enrichedResults);
        setStatus('success');
        
        // Switch viewport focus automatically to Competitors Results tab
        setActiveSection('competitors');

        // Append search target to recent history
        const auditRecord = { business, category: cat, city: ct };
        setSearchHistory((prev) => {
          // Remove duplicates
          const filtered = prev.filter(
            (item) => !(item.business.toLowerCase() === business.toLowerCase() && item.city.toLowerCase() === ct.toLowerCase())
          );
          const nextHistory = [auditRecord, ...filtered].slice(0, 5); // Max 5 items
          if (typeof window !== 'undefined') {
            localStorage.setItem('dashboard-history', JSON.stringify(nextHistory));
          }
          return nextHistory;
        });
      } else {
        throw new Error(response.message || 'Scraper failed to return competitor listings.');
      }
    } catch (err) {
      console.error('[DashboardState Provider Error]:', err.message);
      setErrorMsg(
        err.message || 'Competitor discovery or enrichment failed. Please ensure the backend server is running on port 5000.'
      );
      setStatus('error');
    }
  };

  const triggerVisibilityCheck = async () => {
    if (!businessName || !category || !city) return;
    
    setVisibilityStatus('running');
    setVisibilityData(null);
    setVisibilityLogs([]);

    try {
      console.log(`[Dashboard Context] Dispatching AI Visibility Analysis scan...`);
      const compNames = competitors.map(c => c.name);
      
      const response = await apiService.runAIVisibility({
        brand: businessName,
        category: category,
        location: city,
        competitors: compNames
      });

      if (response.success) {
        setVisibilityData(response);
        setVisibilityLogs(response.debug?.logs || []);
        setVisibilityStatus('success');
      } else {
        throw new Error(response.message || 'AI Visibility Engine failed to return results.');
      }
    } catch (err) {
      console.error('[DashboardState Provider Error - Visibility]:', err.message);
      setVisibilityStatus('error');
      setErrorMsg(err.message || 'AI Visibility audit execution failed.');
    }
  };

  // Resets search targets and active view panels
  const clearAuditScan = () => {
    setStatus('idle');
    setCompetitors([]);
    setQueries([]);
    setLogs([]);
    setBusinessName('');
    setCategory('');
    setCity('');
    setActiveSection('home');
    setEnrichmentProgress({ current: 0, total: 0, competitor: '', statusText: '' });
    setEnrichmentDetails({ rating: null, reviewCount: null, websiteFound: false, socialsFound: [], failures: [] });
    setEnrichmentLogs([]);
    setVisibilityStatus('idle');
    setVisibilityData(null);
    setVisibilityLogs([]);
  };

  // Sign out user and remove JWT credentials from cache
  const logoutUser = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    }
    clearAuditScan();
    router.push('/login');
  };

  return (
    <DashboardContext.Provider
      value={{
        activeSection,
        setActiveSection,
        businessName,
        setBusinessName,
        category,
        setCategory,
        city,
        setCity,
        status,
        setStatus,
        errorMsg,
        setErrorMsg,
        competitors,
        queries,
        logs,
        browserStatus,
        enrichmentProgress,
        enrichmentDetails,
        enrichmentLogs,
        searchHistory,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        theme,
        toggleTheme,
        triggerAuditScan,
        clearAuditScan,
        visibilityStatus,
        setVisibilityStatus,
        visibilityData,
        visibilityLogs,
        triggerVisibilityCheck,
        
        // Auth state and actions
        token,
        setToken,
        user,
        setUser,
        logoutUser
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be invoked inside a DashboardProvider wrapper.');
  }
  return context;
}
