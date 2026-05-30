'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  // Navigation active tab: 'home' | 'competitors'
  const [activeSection, setActiveSection] = useState('home');

  // Active search coordinates
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Scanning/Crawl statuses
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Results states
  const [competitors, setCompetitors] = useState([]);
  const [queries, setQueries] = useState([]);
  const [logs, setLogs] = useState([]);
  const [browserStatus, setBrowserStatus] = useState('idle');

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

  // Triggers unified Playwright competitor search scan
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

    try {
      console.log(`[Dashboard Context] Dispatching discovery search coordinate scan...`);
      const response = await apiService.discoverCompetitors({
        brand: business,
        category: cat,
        location: ct
      });

      if (response.success) {
        setCompetitors(response.competitors);
        setQueries(response.queries);
        if (response.debug) {
          setLogs(response.debug.logs || []);
          setBrowserStatus(response.debug.browserStatus || 'done');
        }
        
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
        err.message || 'Competitor discovery failed. Please ensure the backend server is running on port 5000.'
      );
      setStatus('error');
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
        searchHistory,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        theme,
        toggleTheme,
        triggerAuditScan,
        clearAuditScan
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
