/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KYCStatus, AMLClassification, InvestmentRiskProfile, CRMPipelineStage } from '../../types/investor';

interface StatusBadgeProps {
  type?: 'kyc' | 'aml' | 'risk' | 'stage' | 'priority' | 'status';
  value: string;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type = 'status',
  value,
  className = '',
  showDot = true,
}) => {
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';

  // KYC Status
  if (value === 'Verified') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (value === 'Under Review' || value === 'Submitted') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
    dotClass = 'bg-blue-500';
  } else if (value === 'Additional Information Required') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (value === 'Rejected') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
  } else if (value === 'Draft' || value === 'Not Started') {
    bgClass = 'bg-slate-100 text-slate-600 border-slate-200';
    dotClass = 'bg-slate-400';
  }

  // AML Classification
  if (value === 'Low' && type === 'aml') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (value === 'Medium' && type === 'aml') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (value === 'High' && type === 'aml') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-300 font-semibold ring-1 ring-rose-200';
    dotClass = 'bg-rose-600 animate-pulse';
  }

  // Risk Profile
  if (value === 'Conservative') {
    bgClass = 'bg-teal-50 text-teal-800 border-teal-200';
    dotClass = 'bg-teal-500';
  } else if (value === 'Moderately Conservative') {
    bgClass = 'bg-cyan-50 text-cyan-800 border-cyan-200';
    dotClass = 'bg-cyan-500';
  } else if (value === 'Moderate') {
    bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    dotClass = 'bg-indigo-500';
  } else if (value === 'Moderately Aggressive') {
    bgClass = 'bg-violet-50 text-violet-800 border-violet-200';
    dotClass = 'bg-violet-500';
  } else if (value === 'Aggressive') {
    bgClass = 'bg-purple-50 text-purple-800 border-purple-200';
    dotClass = 'bg-purple-600';
  }

  // Priority
  if (value === 'High' && type === 'priority') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
  } else if (value === 'Medium' && type === 'priority') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (value === 'Low' && type === 'priority') {
    bgClass = 'bg-slate-50 text-slate-600 border-slate-200';
    dotClass = 'bg-slate-400';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
      {value}
    </span>
  );
};
