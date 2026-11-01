/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Users2,
  Target,
  PhoneCall,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { Investor } from '../../types/investor';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

interface SalesDashboardViewProps {
  investors: Investor[];
  onOpenInvestorDetail: (id: string) => void;
  onAddFollowUp: (id: string, text: string) => void;
}

export const SalesDashboardView: React.FC<SalesDashboardViewProps> = ({
  investors,
  onOpenInvestorDetail,
  onAddFollowUp,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'tracker' | 'followups' | 'assistance'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [followUpText, setFollowUpText] = useState('');
  const [selectedInvId, setSelectedInvId] = useState(investors[0]?.id || '');

  const filteredInvestors = investors.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;
    onAddFollowUp(selectedInvId, followUpText);
    setFollowUpText('');
    alert('Follow-up call logged and notification dispatched to customer.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Sales & DSA Onboarding Desk
            </span>
            <span className="text-xs text-slate-400">Assigned Investor Pipeline</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Investor Assistance & Onboarding Tracker
          </h2>
          <p className="text-xs text-slate-500">
            Guide prospective wealth clients through registration, document uploads, and questionnaire completion.
            Sales users cannot approve KYC or alter calculated risk scores.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'tracker' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Onboarding Tracker
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'leads' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Assigned Leads ({investors.length})
          </button>
          <button
            onClick={() => setActiveTab('followups')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'followups' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Follow-Up Log
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Assigned Leads"
          value={investors.length}
          subtitle="Active roster"
          accentColor="bg-blue-600"
        />
        <MetricCard
          title="KYC Pending"
          value="2"
          subtitle="Document uploads"
          accentColor="bg-amber-600"
        />
        <MetricCard
          title="Risk Pending"
          value="1"
          subtitle="D1–D12 incomplete"
          accentColor="bg-indigo-600"
        />
        <MetricCard
          title="Consent Pending"
          value="1"
          subtitle="Awaiting e-sign"
          accentColor="bg-teal-600"
        />
        <MetricCard
          title="Completed"
          value="1"
          subtitle="Fully active"
          accentColor="bg-emerald-600"
        />
        <MetricCard
          title="Today's Tasks"
          value="3"
          subtitle="Scheduled calls"
          accentColor="bg-purple-600"
        />
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Follow-up Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                Action Required: Urgent Customer Interventions
              </h3>
              <span className="text-xs text-amber-600 font-semibold">2 Blocked Journeys</span>
            </div>

            <div className="space-y-3">
              {investors
                .filter((i) => i.onboardingProgress < 100)
                .map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{inv.name}</span>
                        <StatusBadge type="priority" value={inv.priority} />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Current Bottleneck: <strong>{inv.currentStage}</strong> • KYC: {inv.kycStatus}
                      </div>
                      {inv.kycStatus === 'Additional Information Required' && (
                        <div className="text-[11px] text-amber-700 font-semibold mt-1">
                          ⚠️ Action: Compliance requested clear PAN scan without glare. Call client.
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedInvId(inv.id);
                          setActiveTab('followups');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call & Assist
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
              My Monthly Performance (Demo)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Contact Rate</span>
                <span className="font-bold text-slate-900">92.4%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Average Onboarding Duration</span>
                <span className="font-bold text-slate-900">3.2 Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Lead Conversion Rate</span>
                <span className="font-bold text-emerald-600">48.1%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Scheduled Follow-ups</span>
                <span className="font-bold text-blue-600">6 Remaining</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ONBOARDING TRACKER */}
      {activeTab === 'tracker' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Assigned Investor Milestone Progression
            </h3>
            <p className="text-xs text-slate-500">
              Step-by-step visibility into customer journey status across all 8 onboarding milestones.
            </p>
          </div>

          <div className="space-y-4">
            {investors.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{inv.name}</span>
                    <span className="text-slate-400 text-xs ml-2">({inv.id})</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Category: {inv.investorCategory} • Agent: {inv.assignedSalesAgent}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {inv.currentStage}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {inv.onboardingProgress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${inv.onboardingProgress}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                  <span>Last Activity: {inv.lastActivity}</span>
                  <button
                    onClick={() => {
                      setSelectedInvId(inv.id);
                      setActiveTab('followups');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Record Note / Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEADS LIST */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search assigned leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Lead ID</th>
                  <th className="p-3">Investor Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvestors.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono text-slate-400">{inv.leadId}</td>
                    <td className="p-3 font-bold text-slate-900">{inv.name}</td>
                    <td className="p-3 text-slate-700">{inv.investorCategory}</td>
                    <td className="p-3">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {inv.crmStage}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge type="priority" value={inv.priority} />
                    </td>
                    <td className="p-3 text-slate-600">{inv.leadSource}</td>
                    <td className="p-3 text-slate-500">{inv.lastActivity.substring(0, 35)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FOLLOW-UPS */}
      {activeTab === 'followups' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Log Sales Contact & Guidance Note
            </h3>
            <p className="text-xs text-slate-500">
              Record conversations, guide clients through missing sections, and dispatch SMS/email reminders.
            </p>
          </div>

          <form onSubmit={handleSendFollowUp} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Investor</label>
              <select
                value={selectedInvId}
                onChange={(e) => setSelectedInvId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} ({inv.id}) • Stage: {inv.currentStage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Communication Notes / Guidance Provided
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Called client regarding PAN re-upload. Guided them to use the Document tab..."
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition"
              >
                <Send className="w-4 h-4" /> Save & Log Call
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
