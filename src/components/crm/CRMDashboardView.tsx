/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  PhoneCall,
  CheckCircle2,
  TrendingUp,
  Megaphone,
  Briefcase,
  Layers,
  Search,
  Calendar,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { Investor, CRMPipelineStage } from '../../types/investor';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { OnboardingFunnelChart, OnboardingTrendChart } from '../charts/DashboardCharts';
import { CRMKanbanPipeline } from './CRMKanbanPipeline';

interface CRMDashboardViewProps {
  investors: Investor[];
  onMoveStage: (id: string, stage: CRMPipelineStage) => void;
  onOpenInvestor360: (id: string) => void;
  onAddActivity: (id: string, type: any, text: string, author: string, date?: string) => void;
}

export const CRMDashboardView: React.FC<CRMDashboardViewProps> = ({
  investors,
  onMoveStage,
  onOpenInvestor360,
  onAddActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'metrics' | 'campaigns' | 'activities'>('kanban');

  // New activity modal state
  const [activityText, setActivityText] = useState('');
  const [activityType, setActivityType] = useState<'Call' | 'Meeting' | 'Note' | 'FollowUp'>('Call');
  const [selectedInvId, setSelectedInvId] = useState(investors[0]?.id || '');
  const [dueDate, setDueDate] = useState('');

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityText.trim()) return;
    onAddActivity(selectedInvId, activityType, activityText, 'CRM Representative', dueDate);
    setActivityText('');
    alert('Activity logged and synced with investor record.');
  };

  const campaigns = [
    {
      id: 'CMP-1',
      name: 'HNW Doctor Wealth Symposium',
      channel: 'Medical Associations',
      leads: 48,
      converted: 12,
      rate: '25.0%',
      budget: '₹2,50,000',
    },
    {
      id: 'CMP-2',
      name: 'CXO Equity Compensation Advisory',
      channel: 'LinkedIn Sponsored & Executive Outreach',
      leads: 92,
      converted: 28,
      rate: '30.4%',
      budget: '₹4,00,000',
    },
    {
      id: 'CMP-3',
      name: 'Family Office Real Estate Treasury',
      channel: 'Commercial Builder Networks',
      leads: 34,
      converted: 8,
      rate: '23.5%',
      budget: '₹3,20,000',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              CRM & Relationship Module
            </span>
            <span className="text-xs text-slate-400">Lead Acquisition & Conversions</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Investor Pipeline & Acquisition Management
          </h2>
          <p className="text-xs text-slate-500">
            Track prospective investors across 12 pipeline stages from new enquiry to completed suitability sign-off.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'kanban' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'metrics' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Analytics & Funnel
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'campaigns' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'activities' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Log Activity
          </button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          title="Total Leads"
          value="320"
          subtitle="All pipeline channels"
          trend={{ value: '+14% MoM', isPositive: true }}
          accentColor="bg-blue-600"
        />
        <MetricCard
          title="Contacted"
          value="245"
          subtitle="First touch completed"
          accentColor="bg-teal-600"
        />
        <MetricCard
          title="KYC Pending"
          value="48"
          subtitle="Docs submission stage"
          accentColor="bg-amber-600"
        />
        <MetricCard
          title="Risk Profiling Pending"
          value="35"
          subtitle="D1–D12 questionnaire"
          accentColor="bg-indigo-600"
        />
        <MetricCard
          title="Onboarding Completed"
          value="154"
          subtitle="Active wealth clients"
          trend={{ value: '48.1% Rate', isPositive: true }}
          accentColor="bg-emerald-600"
        />
        <MetricCard
          title="Lost / Dropped"
          value="24"
          subtitle="Unresponsive / Disqualified"
          accentColor="bg-slate-500"
        />
      </div>

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === 'kanban' && (
        <CRMKanbanPipeline
          investors={investors}
          onMoveStage={onMoveStage}
          onOpenInvestor360={onOpenInvestor360}
        />
      )}

      {/* TAB 2: ANALYTICS & FUNNEL */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <OnboardingFunnelChart />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <OnboardingTrendChart />
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Wealth Acquisition Campaign Attribution
              </h3>
              <p className="text-xs text-slate-500">
                Tracking source attribution from outbound campaign channels through to fully onboarded investors.
              </p>
            </div>
            <button
              onClick={() => alert('New Campaign creation drawer (Demo simulation).')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Create Campaign
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Campaign Name</th>
                  <th className="p-3">Channel Source</th>
                  <th className="p-3">Leads Generated</th>
                  <th className="p-3">Completed Onboardings</th>
                  <th className="p-3">Conversion Rate</th>
                  <th className="p-3">Spend Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{c.name}</td>
                    <td className="p-3 text-slate-600">{c.channel}</td>
                    <td className="p-3 font-semibold text-slate-800">{c.leads}</td>
                    <td className="p-3 font-bold text-emerald-700">{c.converted}</td>
                    <td className="p-3 font-bold text-blue-600">{c.rate}</td>
                    <td className="p-3 text-slate-600">{c.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LOG ACTIVITY */}
      {activeTab === 'activities' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              Record Follow-Up Call, Meeting or Note
            </h3>
            <p className="text-xs text-slate-500">
              Activities are immediately logged in the shared investor timeline and visible in Sales and Admin.
            </p>
          </div>

          <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Investor</label>
              <select
                value={selectedInvId}
                onChange={(e) => setSelectedInvId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium"
              >
                {investors.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} ({inv.id}) • Stage: {inv.crmStage}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Type</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Call">Phone Call</option>
                  <option value="Meeting">Advisory Meeting</option>
                  <option value="Note">Internal Note</option>
                  <option value="FollowUp">Follow-up Task</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interaction Summary</label>
              <textarea
                rows={3}
                placeholder="Details of conversation with investor..."
                value={activityText}
                onChange={(e) => setActivityText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition"
              >
                Save Activity to Timeline
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
