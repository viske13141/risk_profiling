/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  UserCheck,
  FileText,
  Sliders,
  PieChart,
  Target,
  FileCheck2,
  Scale,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Investor, OnboardingStage } from '../../types/investor';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';

interface CustomerOverviewProps {
  investor: Investor;
  onNavigateTab: (tabId: string) => void;
  onContinueOnboarding: () => void;
}

export const CustomerOverview: React.FC<CustomerOverviewProps> = ({
  investor,
  onNavigateTab,
  onContinueOnboarding,
}) => {
  const stages: { stage: OnboardingStage; label: string; tab: string }[] = [
    { stage: 'Investor Details', label: '1. Details', tab: 'profile-settings' },
    { stage: 'Identity KYC', label: '2. KYC', tab: 'my-kyc' },
    { stage: 'Financial Profile', label: '3. Financial (B1-B9)', tab: 'financial-profile' },
    { stage: 'Investment Goals', label: '4. Goals', tab: 'investment-goals' },
    { stage: 'Risk Assessment', label: '5. Risk (D1-D12)', tab: 'risk-assessment' },
    { stage: 'Risk Calculation', label: '6. Risk Profile', tab: 'my-risk-profile' },
    { stage: 'Confirmation & Consent', label: '7. Consent', tab: 'consent' },
    { stage: 'Suitability Review', label: '8. Suitability', tab: 'suitability' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.stage === investor.currentStage);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome & Continue Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
                Wealth Management Portal
              </span>
              <span className="text-xs text-slate-300">Investor ID: {investor.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {investor.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Complete your institutional wealth onboarding, financial risk questionnaire, and regulatory suitability review to activate managed investment mandates.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400">Onboarding Completion</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{investor.onboardingProgress}%</span>
                <span className="text-xs font-normal text-blue-300">
                  ({investor.currentStage})
                </span>
              </div>
            </div>

            <button
              onClick={onContinueOnboarding}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition group"
            >
              <span>Continue Investor Onboarding</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 8-Stage Progress Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">
              Investor Onboarding Journey
            </h3>
            <p className="text-xs text-slate-500">
              End-to-end regulatory sequence across identity KYC, risk profiling, and suitability sign-off.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Current: {investor.currentStage}
          </span>
        </div>

        {/* Timeline Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {stages.map((st, idx) => {
            const isCompleted = idx < currentStageIndex || investor.onboardingProgress === 100;
            const isCurrent = idx === currentStageIndex && investor.onboardingProgress < 100;

            return (
              <button
                key={st.stage}
                onClick={() => onNavigateTab(st.tab)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[74px] ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step {idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <div
                  className={`text-xs font-bold leading-tight mt-1 ${
                    isCurrent
                      ? 'text-blue-900'
                      : isCompleted
                      ? 'text-emerald-950'
                      : 'text-slate-600'
                  }`}
                >
                  {st.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="KYC Verification Status"
          value={investor.kycStatus}
          subtitle={`Entity: ${investor.investorCategory}`}
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          accentColor="bg-blue-600"
          onClick={() => onNavigateTab('my-kyc')}
        />
        <MetricCard
          title="Calculated Risk Profile"
          value={investor.riskResult?.finalProfile || 'Moderate'}
          subtitle={`Capacity: ${investor.riskResult?.capacityCategory || 'Moderate'}`}
          icon={<Sliders className="w-5 h-5 text-indigo-600" />}
          accentColor="bg-indigo-600"
          onClick={() => onNavigateTab('my-risk-profile')}
        />
        <MetricCard
          title="Financial Profile (B1–B9)"
          value="9 Questions"
          subtitle="Net worth, debt, and 12m liquidity"
          icon={<PieChart className="w-5 h-5 text-teal-600" />}
          accentColor="bg-teal-600"
          onClick={() => onNavigateTab('financial-profile')}
        />
        <MetricCard
          title="Assigned Wealth Adviser"
          value={investor.assignedAdviser.split(',')[0]}
          subtitle="SEBI Registered Investment Adviser"
          icon={<UserCheck className="w-5 h-5 text-purple-600" />}
          accentColor="bg-purple-600"
          onClick={() => onNavigateTab('suitability')}
        />
      </div>

      {/* Main Grid: Pending Actions & Activity History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions Checklist */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Action Required Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Steps required to complete onboarding and activate execution.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Stage: {investor.currentStage}
            </span>
          </div>

          <div className="space-y-3">
            {/* Action Item 1: KYC */}
            <div
              onClick={() => onNavigateTab('my-kyc')}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition flex items-start justify-between cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Verify Identity Documentation & CKYC Details
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    PAN, Masked Aadhaar XML, Bank Proof, and PEP/FATCA declarations.
                  </div>
                </div>
              </div>
              <StatusBadge type="kyc" value={investor.kycStatus} />
            </div>

            {/* Action Item 2: Risk Assessment */}
            <div
              onClick={() => onNavigateTab('risk-assessment')}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition flex items-start justify-between cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mt-0.5">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Complete 12-Question Risk Assessment (D1–D12)
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Evaluates Capacity (D1–D6) and Willingness (D7–D12) with O1–O7 overrides.
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                12 Questions
              </span>
            </div>

            {/* Action Item 3: Consent */}
            <div
              onClick={() => onNavigateTab('consent')}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition flex items-start justify-between cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    E-Sign Investor Consent & Disclosures
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Direct vs Regular plan disclosure and statutory risk confirmations.
                  </div>
                </div>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  investor.consentGiven
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {investor.consentGiven ? 'Signed' : 'Pending Sign'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Audit & System Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Audit & Activity Trail
            </h3>
            <span className="text-xs text-slate-400">Immutable Log</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto">
            {investor.auditLogs.map((log) => (
              <div key={log.id} className="text-xs space-y-1 p-2 rounded-lg hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp.split(' ')[0]}</span>
                </div>
                <div className="text-slate-600 text-[11px]">{log.details}</div>
                <div className="text-[10px] text-slate-400 italic">By: {log.performedBy}</div>
              </div>
            ))}
          </div>

          {/* Reassessment reminder */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Next Reassessment Due:</span>
            <span className="font-semibold text-slate-800">
              {investor.riskResult?.nextReassessmentDate || 'Annual Review'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
