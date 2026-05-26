'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function ScoreComparisonChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-900/10 border border-gray-800/40 rounded-2xl animate-pulse">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading comparison benchmarks...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-900/10 border border-gray-800/40 rounded-2xl">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">No competitor benchmark data compiled</span>
      </div>
    );
  }

  // Find dynamic keys representing user and competitor brand names (excluding 'date')
  const keys = Object.keys(data[0] || {}).filter((k) => k !== 'date');
  const userKey = keys.find((k) => k === 'You') || 'You';
  const competitorKeys = keys.filter((k) => k !== 'You');

  const colors = ['#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="h-64 w-full text-xs font-semibold">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="var(--chart-grid, #1f2937)" 
            className="stroke-gray-800 dark:stroke-gray-900"
          />
          
          <XAxis 
            dataKey="date" 
            tickLine={false}
            axisLine={false}
            dy={10}
            stroke="#6b7280"
            className="fill-gray-500"
          />
          
          <YAxis 
            domain={[0, 100]} 
            tickCount={6}
            tickLine={false}
            axisLine={false}
            dx={-10}
            stroke="#6b7280"
            className="fill-gray-500"
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: '#030712',
              borderColor: '#1f2937',
              borderRadius: '12px',
              padding: '10px 14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}
            itemStyle={{ fontSize: '12px' }}
            labelStyle={{ color: '#6b7280', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
          />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
          />
          
          {/* User brand line */}
          <Line
            type="monotone"
            dataKey={userKey}
            name="Your Brand"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          
          {/* Competitor lines */}
          {competitorKeys.map((cKey, idx) => (
            <Line
              key={cKey}
              type="monotone"
              dataKey={cKey}
              name={cKey}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
