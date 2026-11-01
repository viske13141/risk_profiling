/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export const OnboardingTrendChart: React.FC = () => {
  const data = [
    { month: 'Jun', count: 18 },
    { month: 'Jul', count: 26 },
    { month: 'Aug', count: 35 },
    { month: 'Sep', count: 48 },
    { month: 'Oct', count: 72 },
    { month: 'Nov', count: 94 },
  ];

  const maxVal = 100;
  const height = 180;
  const width = 480;
  const padding = 30;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d.count / maxVal) * (height - 2 * padding);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">Monthly Investor Onboarding Growth</span>
        <span className="text-xs text-emerald-600 font-medium">+30.5% vs last month</span>
      </div>
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = height - padding - (val / maxVal) * (height - 2 * padding);
            return (
              <g key={val}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x={padding - 6} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#blueGrad)" />

          {/* Stroke path */}
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <text x={p.x} y={height - 8} textAnchor="middle" className="text-[10px] fill-slate-500 font-medium">
                {p.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const KYCStatusDistributionChart: React.FC = () => {
  const items = [
    { label: 'Verified', count: 142, color: 'bg-emerald-500', hex: '#10b981', pct: 64 },
    { label: 'Under Review', count: 48, color: 'bg-blue-500', hex: '#3b82f6', pct: 21 },
    { label: 'Info Required', count: 22, color: 'bg-amber-500', hex: '#f59e0b', pct: 10 },
    { label: 'Rejected', count: 11, color: 'bg-rose-500', hex: '#ef4444', pct: 5 },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-700">KYC Applications Breakdown</span>
        <span className="text-xs text-slate-500">223 Total Submissions</span>
      </div>
      {/* Progress Bar stack */}
      <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100">
        {items.map((it) => (
          <div
            key={it.label}
            style={{ width: `${it.pct}%`, backgroundColor: it.hex }}
            className="h-full transition-all duration-500 hover:opacity-90"
            title={`${it.label}: ${it.count} (${it.pct}%)`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${it.color}`} />
              <span className="text-slate-600 font-medium">{it.label}</span>
            </div>
            <span className="font-bold text-slate-900">{it.count} ({it.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RiskProfileDistributionChart: React.FC = () => {
  const profiles = [
    { name: 'Conservative', count: 32, pct: 18, color: 'bg-teal-500' },
    { name: 'Mod. Conservative', count: 44, pct: 25, color: 'bg-cyan-500' },
    { name: 'Moderate', count: 58, pct: 32, color: 'bg-indigo-500' },
    { name: 'Mod. Aggressive', count: 30, pct: 17, color: 'bg-violet-500' },
    { name: 'Aggressive', count: 14, pct: 8, color: 'bg-purple-600' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-700">Investment Risk Profile Distribution</span>
        <span className="text-xs text-slate-500">178 Completed Profiles</span>
      </div>
      <div className="space-y-2.5">
        {profiles.map((p) => (
          <div key={p.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700">{p.name}</span>
              <span className="font-semibold text-slate-900">{p.count} investors ({p.pct}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${p.color} rounded-full transition-all duration-500`}
                style={{ width: `${p.pct * 2.5}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OnboardingFunnelChart: React.FC = () => {
  const stages = [
    { stage: '1. Leads Generated', count: 320, pct: 100 },
    { stage: '2. Identity KYC Submitted', count: 245, pct: 76 },
    { stage: '3. KYC Verified', count: 210, pct: 65 },
    { stage: '4. Financial Profile Completed', count: 185, pct: 57 },
    { stage: '5. Risk Profile Assessed', count: 168, pct: 52 },
    { stage: '6. Consent & Suitability Finalized', count: 154, pct: 48 },
  ];

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-700">Investor Conversion Funnel</span>
        <span className="text-xs text-emerald-600 font-semibold">48.1% Overall Conversion</span>
      </div>
      {stages.map((st, i) => (
        <div key={st.stage} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-slate-600">{st.stage}</span>
            <span className="font-bold text-slate-800">{st.count} ({st.pct}%)</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${st.pct}%`, opacity: 1 - i * 0.1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
