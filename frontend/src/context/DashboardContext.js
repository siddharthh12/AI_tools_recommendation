'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  // Navigation active tab: 'home' | 'visibility' | 'competitors' | 'recommendations' | 'analytics'
  const [activeSection, setActiveSection] = useState('home');

  // Active search/audit coordinates
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Scanning/Crawl statuses
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // API Reports results
  const [report, setReport] = useState(null);       // Visibility Score Report
  const [compReport, setCompReport] = useState(null); // Competitors Analysis Report
  const [recReport, setRecReport] = useState(null);   // Prioritized Recommendations Report

  // Search Audit History Recalls (Prefilled with realistic startup demos)
  const [searchHistory, setSearchHistory] = useState([
    { business: "Gold's Gym", category: "Gym", city: "Mumbai" },
    { business: "Initech Café", category: "Café", city: "Bangalore" }
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

  // Triggers unified audit scan concurrently
  const triggerAuditScan = async (searchCoords) => {
    const { business, category: cat, city: ct } = searchCoords;
    if (!business || !cat || !ct) return;

    // Set search coordinates state
    setBusinessName(business);
    setCategory(cat);
    setCity(ct);

    setStatus('scanning');
    setErrorMsg('');
    setReport(null);
    setCompReport(null);
    setRecReport(null);

    try {
      // Fetch scoring, competitor, and recommendations analysis concurrently
      const [scoreRes, compRes, recRes] = await Promise.all([
        apiService.executeQueryEngine({ business, category: cat, city: ct }),
        apiService.executeCompetitorAnalysis({ business, category: cat, city: ct }),
        apiService.generateRecommendations({ business, category: cat, city: ct })
      ]);

      if (scoreRes.success && compRes.success && recRes.success) {
        setReport(scoreRes);
        setCompReport(compRes);
        setRecReport(recRes);
        setStatus('success');
        
        // Switch viewport focus automatically to Results page
        setActiveSection('visibility');

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
        throw new Error('Crawlers failed to return structured analytical tables.');
      }
    } catch (err) {
      console.error('[DashboardState Provider Error]:', err.message);
      setErrorMsg(
        err.message || 'Audits timed out. Check that backend server is listening on port 5000.'
      );
      setStatus('error');
    }
  };

  // Resets search targets and active view panels
  const clearAuditScan = () => {
    setStatus('idle');
    setReport(null);
    setCompReport(null);
    setRecReport(null);
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
        report,
        compReport,
        recReport,
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
