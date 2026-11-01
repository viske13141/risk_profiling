/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  MoreVertical,
  Calendar,
  Phone,
  User,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Investor, CRMPipelineStage } from '../../types/investor';
import { StatusBadge } from '../common/StatusBadge';

interface CRMKanbanPipelineProps {
  investors: Investor[];
  onMoveStage: (investorId: string, newStage: CRMPipelineStage) => void;
  onOpenInvestor360: (investorId: string) => void;
}

const ALL_STAGES: CRMPipelineStage[] = [
  'New Investor Lead',
  'Contacted',
  'Interested',
  'Registration Pending',
  'KYC Pending',
  'KYC Under Review',
  'Financial Profile Pending',
  'Risk Profiling Pending',
  'Consent Pending',
  'Onboarding Completed',
  'Converted',
  'Dropped / Lost',
];

export const CRMKanbanPipeline: React.FC<CRMKanbanPipelineProps> = ({
  investors,
  onMoveStage,
  onOpenInvestor360,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedInvestorId, setDraggedInvestorId] = useState<string | null>(null);

  const filteredInvestors = investors.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.leadId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedInvestorId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: CRMPipelineStage) => {
    e.preventDefault();
    const invId = e.dataTransfer.getData('text/plain') || draggedInvestorId;
    if (invId) {
      onMoveStage(invId, targetStage);
    }
    setDraggedInvestorId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads across pipeline by name or lead ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{investors.length} Total Leads</span>
          <span>•</span>
          <span className="text-blue-600 font-medium">Drag cards or use dropdown to move stages</span>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex gap-3 overflow-x-auto pb-4 items-start min-h-[600px]">
        {ALL_STAGES.map((stage, sIdx) => {
          const stageInvestors = filteredInvestors.filter((i) => i.crmStage === stage);

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
              className="w-72 shrink-0 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col max-h-[750px]"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/80 bg-white/80 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900 truncate">{stage}</span>
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                  {stageInvestors.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="p-2.5 space-y-2.5 overflow-y-auto flex-1">
                {stageInvestors.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No leads in this stage
                  </div>
                ) : (
                  stageInvestors.map((inv) => (
                    <div
                      key={inv.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, inv.id)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-blue-400 transition cursor-grab active:cursor-grabbing space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[10px] text-slate-400">{inv.leadId}</span>
                        <StatusBadge type="priority" value={inv.priority} />
                      </div>

                      <div
                        onClick={() => onOpenInvestor360(inv.id)}
                        className="font-bold text-xs text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {inv.name}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        {inv.investorCategory} • Source: {inv.leadSource}
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Onboarding</span>
                          <span className="font-bold text-slate-700">{inv.onboardingProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${inv.onboardingProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Agent: {inv.assignedSalesAgent}</span>
                        <select
                          value={inv.crmStage}
                          onChange={(e) => onMoveStage(inv.id, e.target.value as CRMPipelineStage)}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700"
                        >
                          {ALL_STAGES.map((st) => (
                            <option key={st} value={st}>
                              Move: {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
