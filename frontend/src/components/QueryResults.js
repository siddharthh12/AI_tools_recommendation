'use client';

import React, { useState } from 'react';
import { 
  RiQuestionnaireLine, 
  RiMedalLine, 
  RiFileList3Line, 
  RiArrowDownSLine, 
  RiArrowUpSLine, 
  RiCheckDoubleLine 
} from 'react-icons/ri';

export default function QueryResults({ queries, targetBusiness }) {
  const [openAccordion, setOpenAccordion] = useState(0);

  if (!queries || !Array.isArray(queries) || queries.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white tracking-wide flex items-center space-x-2">
        <RiQuestionnaireLine className="h-5 w-5 text-indigo-400" />
        <span>Scraper Crawl Details</span>
      </h3>

      <div className="space-y-3">
        {queries.map((qRun, idx) => {
          const isOpen = openAccordion === idx;
          const totalFound = qRun.results ? qRun.results.length : 0;
          const targetFound = qRun.results?.some(
            r => r.name.toLowerCase() === targetBusiness.toLowerCase()
          );

          return (
            <div 
              key={idx} 
              className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'border-indigo-500/30' : 'border-gray-800 hover:border-gray-700/60'
              }`}
            >
              {/* Accordion Toggle Header */}
              <button
                type="button"
                onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-gray-900/10"
              >
                <div className="space-y-1 pr-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Query Variation #{idx + 1}
                  </div>
                  <div className="text-sm font-bold text-white leading-relaxed">
                    "{qRun.query}"
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {/* Status Pills */}
                  {targetFound ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center space-x-0.5">
                      <RiCheckDoubleLine className="h-3 w-3" />
                      <span>Cited</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                      Unlisted
                    </span>
                  )}
                  
                  <span className="text-xs font-bold text-gray-400 bg-gray-900 px-2 py-0.5 rounded-lg border border-gray-800">
                    {totalFound} Found
                  </span>

                  {isOpen ? (
                    <RiArrowUpSLine className="h-5 w-5 text-gray-400" />
                  ) : (
                    <RiArrowDownSLine className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Accordion Content Body */}
              {isOpen && (
                <div className="px-5 pb-5 pt-3 border-t border-gray-900 bg-gray-950/20 space-y-5 transition-all">
                  
                  {/* Grid: Extracted Results vs Raw Output */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Column 1: Clean Extracted List */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <RiMedalLine className="h-4 w-4 text-indigo-400" />
                        <span>Extracted Rankings</span>
                      </h4>

                      {totalFound > 0 ? (
                        <div className="divide-y divide-gray-900 bg-gray-950/40 rounded-xl border border-gray-900 overflow-hidden">
                          {qRun.results.map((biz) => {
                            const isTarget = biz.name.toLowerCase() === targetBusiness.toLowerCase();
                            return (
                              <div 
                                key={biz.name} 
                                className={`px-4 py-2.5 flex items-center justify-between text-sm ${
                                  isTarget ? 'bg-indigo-500/10 text-white font-semibold' : 'text-gray-300'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-gray-500">#{biz.position}</span>
                                  <span>{biz.name}</span>
                                </div>
                                {isTarget && (
                                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                    Your Brand
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic py-4">
                          No businesses could be extracted from this response format.
                        </div>
                      )}
                    </div>

                    {/* Column 2: Raw AI response window */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <RiFileList3Line className="h-4 w-4 text-indigo-400" />
                        <span>Raw AI Answer Text</span>
                      </h4>

                      <div className="w-full bg-gray-950 border border-gray-900 rounded-xl p-3.5 h-[160px] overflow-y-auto text-xs text-gray-400 font-mono leading-relaxed select-text shadow-inner">
                        <pre className="whitespace-pre-wrap">{qRun.rawResponse}</pre>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
