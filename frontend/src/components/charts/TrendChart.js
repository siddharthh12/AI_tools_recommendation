'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function TrendChart({ data = [], loading = false }) {
  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-900/10 border border-gray-800/40 rounded-2xl animate-pulse">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Loading trend telemetry...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center bg-gray-900/10 border border-gray-800/40 rounded-2xl">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">No trend coordinates compiled</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full text-xs font-semibold">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          
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
            itemStyle={{ color: '#fff', fontSize: '12px' }}
            labelStyle={{ color: '#6b7280', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
            formatter={(value) => [`${value} Index`, 'Visibility Score']}
          />
          
          <Area
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
