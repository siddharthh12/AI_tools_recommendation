'use client';

import React from 'react';

export default function PriorityBadge({ priority }) {
  if (!priority) return null;

  const cleanPriority = priority.toUpperCase().trim();

  let styles = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  
  if (cleanPriority === 'HIGH') {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (cleanPriority === 'MEDIUM') {
    styles = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${styles}`}>
      {cleanPriority} Priority
    </span>
  );
}
