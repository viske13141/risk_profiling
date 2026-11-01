/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  UserCheck,
  Info,
} from 'lucide-react';
import { Investor } from '../../types/investor';
import { INDICATIVE_ALLOCATIONS } from '../../utils/riskCalculation';
import { StatusBadge } from '../common/StatusBadge';

interface SuitabilityReviewWorkspaceProps {
  investors: Investor[];
  onSubmitDecision: (id: string, decision: 'Approved' | 'Flagged for Consultation', comments: string) => void;
}

export const SuitabilityReviewWorkspace: React.FC<SuitabilityReviewWorkspaceProps> = ({
  investors,
  onSubmitDecision,
}) => {
  const [selectedId, setSelectedId] = useState(
    investors.find((i) => !i.suitabilityReviewed)?.id || investors[0].id
  );
  const selectedInvestor = investors.find((i) => i.id === selectedId) || investors[0];

  const profile = selectedInvestor.riskResult?.finalProfile || 'Moderate';
  const alloc = INDICATIVE_ALLOCATIONS[profile];

  const [decision, setDecision] = useState<'Approved' | 'Flagged for Consultation'>('Approved');
  const [comments, setComments] = useState(
    'Suitable for diversified mutual fund portfolio aligned with investor risk profile.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please provide advisory rationale in the review comments.');
      return;
    }
    onSubmitDecision(selectedInvestor.id, decision, comments);
    alert(`Suitability decision marked as ${decision} for ${selectedInvestor.name}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Advisory Review Gate
          </span>
          <span className="text-xs text-slate-400">SEBI IA Regulations</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Investment Suitability Sign-Off & Fiduciary Verification
        </h2>
        <p className="text-xs text-slate-500">
          Independent advisory assessment ensuring investment goals, horizon, and emergency buffers match proposed scheme categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investor Select List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Suitability Queue ({investors.length})
          </div>
          <div className="space-y-2">
            {investors.map((inv) => {
              const isSelected = inv.id === selectedInvestor.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedId(inv.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{inv.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        inv.suitabilityReviewed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.suitabilityReviewed ? 'Signed-Off' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{inv.investorCategory}</span>
                    <span className="font-semibold text-blue-700">{inv.riskResult?.finalProfile}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Dossier */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs text-slate-400 font-mono">{selectedInvestor.id}</div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedInvestor.name}</span>
                <StatusBadge type="risk" value={profile} />
              </h3>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Assigned Adviser:</span>
              <div className="font-bold text-slate-800">{selectedInvestor.assignedAdviser}</div>
            </div>
          </div>

          {/* Key Suitability Alignment Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400">Investor Risk Profile:</span>
              <div className="font-bold text-slate-900 mt-1">{profile}</div>
              <div className="text-blue-600 font-semibold mt-0.5">Equity: {alloc.equityRange}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400">Declared Horizon & Goals:</span>
              <div className="font-bold text-slate-900 mt-1">
                {selectedInvestor.investmentGoals[0]?.category || 'Wealth Creation'}
              </div>
              <div className="text-slate-500 text-[11px]">
                Target Year: {selectedInvestor.investmentGoals[0]?.targetYear || 2032}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400">12-Month Liquidity Need:</span>
              <div className="font-bold text-slate-900 mt-1">
                {selectedInvestor.financialProfile.neededWithin12Months === 'Yes'
                  ? 'Yes (Ring-Fenced)'
                  : 'No 12M Outflow'}
              </div>
              <div className="text-slate-500 text-[11px]">
                Net Worth: {selectedInvestor.financialProfile.netWorth}
              </div>
            </div>
          </div>

          {/* Approved Schemes for this profile */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Indicative Product & Scheme Universe:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {alloc.schemes.map((s) => (
                <div key={s} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advisory Decision Form */}
          <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-4">
            <div className="text-xs font-bold text-blue-950">
              Formal Suitability Determination
            </div>

            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="decision"
                  checked={decision === 'Approved'}
                  onChange={() => setDecision('Approved')}
                  className="text-blue-600"
                />
                <span className="text-emerald-800">Approved for Mandate Deployment</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="decision"
                  checked={decision === 'Flagged for Consultation'}
                  onChange={() => setDecision('Flagged for Consultation')}
                  className="text-blue-600"
                />
                <span className="text-amber-800">Flag for Follow-up Consultation</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adviser Rationale & Review Comments:
              </label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
              >
                Submit Suitability Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
