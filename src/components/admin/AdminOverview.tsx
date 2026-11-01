/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users2,
  FileCheck,
  AlertTriangle,
  Sliders,
  FileCheck2,
  History,
  TrendingUp,
  Clock,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Investor, Role } from '../../types/investor';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  OnboardingTrendChart,
  KYCStatusDistributionChart,
  RiskProfileDistributionChart,
} from '../charts/DashboardCharts';

interface AdminOverviewProps {
  investors: Investor[];
  onNavigateTab: (tabId: string) => void;
  onSelectInvestorForReview: (investorId: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  investors,
  onNavigateTab,
  onSelectInvestorForReview,
}) => {
  // Aggregate statistics
  const totalInvestors = investors.length;
  const kycPendingCount = investors.filter(
    (i) => i.kycStatus === 'Submitted' || i.kycStatus === 'Under Review'
  ).length;
  const kycVerifiedCount = investors.filter((i) => i.kycStatus === 'Verified').length;
  const kycRejectedCount = investors.filter((i) => i.kycStatus === 'Rejected').length;
  const kycInfoReqCount = investors.filter(
    (i) => i.kycStatus === 'Additional Information Required'
  ).length;
  const amlPendingCount = investors.filter((i) => i.amlClassification === 'High').length;
  const riskAssessedCount = investors.filter((i) => i.riskResult && !i.riskResult.isMissingAnswer).length;
  const consentPendingCount = investors.filter((i) => !i.consentGiven).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Admin & Compliance Hub
            </span>
            <span className="text-xs text-slate-400">Institutional Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Investing & Wealth Management Oversight
          </h1>
          <p className="text-xs text-slate-500">
            Real-time monitoring of regulatory KYC verifications, AML classifications, risk overrides, and suitability sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('risk-engine-tests')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Run Risk Engine Tests (15)</span>
          </button>
        </div>
      </div>

      {/* Critical Compliance Alert Banner */}
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-xs text-rose-900">
              Critical AML Review Required: 1 High-Risk Entity Flagged
            </div>
            <div className="text-xs text-rose-700 mt-0.5">
              <strong>Aarav Builders & Developers LLP</strong> has a declared Politically Exposed Person (PEP) relation. Enhanced Due Diligence (EDD) must be completed before KYC approval.
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            onSelectInvestorForReview('INV-2026-003');
            onNavigateTab('aml-compliance');
          }}
          className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
        >
          Open EDD Workspace
        </button>
      </div>

      {/* Primary 10 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Total Registered"
          value={totalInvestors}
          subtitle="4 Active Portfolios"
          icon={<Users2 className="w-4 h-4 text-blue-600" />}
          accentColor="bg-blue-600"
          onClick={() => onNavigateTab('investor-management')}
        />
        <MetricCard
          title="KYC Pending Review"
          value={kycPendingCount}
          subtitle="Needs Admin review"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          accentColor="bg-amber-600"
          onClick={() => onNavigateTab('kyc-verification')}
        />
        <MetricCard
          title="KYC Verified"
          value={kycVerifiedCount}
          subtitle="Ready for Profiling"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          accentColor="bg-emerald-600"
          onClick={() => onNavigateTab('kyc-verification')}
        />
        <MetricCard
          title="Info Requested"
          value={kycInfoReqCount}
          subtitle="Awaiting Customer Upload"
          icon={<HelpCircle className="w-4 h-4 text-amber-500" />}
          accentColor="bg-amber-500"
          onClick={() => onNavigateTab('kyc-verification')}
        />
        <MetricCard
          title="AML High-Risk Cases"
          value={amlPendingCount}
          subtitle="Enhanced Due Diligence"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
          accentColor="bg-rose-600"
          onClick={() => onNavigateTab('aml-compliance')}
        />
        <MetricCard
          title="Risk Assessments"
          value={riskAssessedCount}
          subtitle="All 12 Qs scored"
          icon={<Sliders className="w-4 h-4 text-indigo-600" />}
          accentColor="bg-indigo-600"
          onClick={() => onNavigateTab('risk-oversight')}
        />
        <MetricCard
          title="Consent Pending"
          value={consentPendingCount}
          subtitle="Awaiting e-sign"
          icon={<FileCheck2 className="w-4 h-4 text-slate-600" />}
          accentColor="bg-slate-600"
          onClick={() => onNavigateTab('consent-management')}
        />
        <MetricCard
          title="Adviser Overrides"
          value="1 Active"
          subtitle="Strictly downward"
          icon={<History className="w-4 h-4 text-purple-600" />}
          accentColor="bg-purple-600"
          onClick={() => onNavigateTab('adviser-overrides')}
        />
        <MetricCard
          title="Suitability Signed"
          value="1 Approved"
          subtitle="2 Pending Review"
          icon={<CheckCircle2 className="w-4 h-4 text-teal-600" />}
          accentColor="bg-teal-600"
          onClick={() => onNavigateTab('suitability-review')}
        />
        <MetricCard
          title="Reassessments Due"
          value="0 Overdue"
          subtitle="Annual cycle valid"
          icon={<History className="w-4 h-4 text-blue-500" />}
          accentColor="bg-blue-500"
          onClick={() => onNavigateTab('reassessment-management')}
        />
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <OnboardingTrendChart />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <KYCStatusDistributionChart />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <RiskProfileDistributionChart />
        </div>
      </div>

      {/* Pending Review Queue & Quick Approvals */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pending Compliance Review Queue
            </h3>
            <p className="text-xs text-slate-500">
              Priority applications awaiting KYC verification, AML sign-off, or suitability decision.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('investor-management')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Investors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Investor Name & ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">KYC Status</th>
                <th className="p-3">AML Risk</th>
                <th className="p-3">Risk Profile</th>
                <th className="p-3">Onboarding Progress</th>
                <th className="p-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {investors.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{inv.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{inv.id}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{inv.investorCategory}</td>
                  <td className="p-3">
                    <StatusBadge type="kyc" value={inv.kycStatus} />
                  </td>
                  <td className="p-3">
                    <StatusBadge type="aml" value={inv.amlClassification} />
                  </td>
                  <td className="p-3">
                    <StatusBadge type="risk" value={inv.riskResult?.finalProfile || 'Moderate'} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${inv.onboardingProgress}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700">{inv.onboardingProgress}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        onSelectInvestorForReview(inv.id);
                        onNavigateTab('investor-management');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
                    >
                      Open 360 View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
