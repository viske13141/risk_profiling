/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowDownRight,
  TrendingDown,
  Info,
  Calendar,
} from 'lucide-react';
import { Investor, InvestmentRiskProfile } from '../../types/investor';
import { PROFILE_TO_LEVEL, LEVEL_TO_PROFILE } from '../../utils/riskCalculation';
import { StatusBadge } from '../common/StatusBadge';

interface RiskOversightWorkspaceProps {
  investors: Investor[];
  onApplyAdviserOverride: (id: string, targetProfile: InvestmentRiskProfile, reason: string) => void;
}

export const RiskOversightWorkspace: React.FC<RiskOversightWorkspaceProps> = ({
  investors,
  onApplyAdviserOverride,
}) => {
  const [selectedId, setSelectedId] = useState(investors[0].id);
  const selectedInvestor = investors.find((i) => i.id === selectedId) || investors[0];

  const result = selectedInvestor.riskResult;

  const [overrideProfile, setOverrideProfile] = useState<InvestmentRiskProfile>(
    result?.finalProfile || 'Moderate'
  );
  const [overrideReason, setOverrideReason] = useState('');

  const currentLevel = result ? PROFILE_TO_LEVEL[result.finalProfile] : 3;

  const handleApplyOverride = () => {
    const targetLevel = PROFILE_TO_LEVEL[overrideProfile];
    if (targetLevel >= currentLevel) {
      alert('Regulatory Rule: An adviser may only LOWER the risk profile. Raising the profile is strictly prohibited.');
      return;
    }
    if (!overrideReason.trim()) {
      alert('A written compliance justification is mandatory for adjusting an investor profile.');
      return;
    }
    onApplyAdviserOverride(selectedInvestor.id, overrideProfile, overrideReason);
    setOverrideReason('');
    alert(`Risk profile for ${selectedInvestor.name} successfully adjusted downwards to ${overrideProfile}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            Assessment B • Risk Engine Oversight
          </span>
          <span className="text-xs text-slate-400">Scoring Formula Audit</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Risk Profiling Oversight & Adviser Downward Adjustment
        </h2>
        <p className="text-xs text-slate-500">
          Independent calculation of Capacity (D1–D6) and Willingness (D7–D12), prudential O1–O7 overrides, and strictly downward adviser adjustments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investor Select List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Assessed Investors ({investors.length})
          </div>
          <div className="space-y-2">
            {investors.map((inv) => {
              const isSelected = inv.id === selectedInvestor.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedId(inv.id);
                    if (inv.riskResult) setOverrideProfile(inv.riskResult.finalProfile);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{inv.name}</span>
                    <StatusBadge type="risk" value={inv.riskResult?.finalProfile || 'Moderate'} />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{inv.investorCategory}</span>
                    <span>Cap L{inv.riskResult?.capacityLevel} / Will L{inv.riskResult?.willingnessLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Investor Breakdown */}
        {result ? (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-400 font-mono">{selectedInvestor.id}</div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{selectedInvestor.name}</span>
                  <StatusBadge type="risk" value={result.finalProfile} />
                </h3>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">Assigned Adviser:</span>{' '}
                <strong className="text-slate-800">{selectedInvestor.assignedAdviser}</strong>
              </div>
            </div>

            {/* Scores Inspection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  Risk Capacity (D1–D6)
                </span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {result.capacityScore} <span className="text-xs text-slate-400">/ 30</span>
                </div>
                <div className="text-xs font-bold text-blue-700 mt-0.5">
                  Level {result.capacityLevel} • {result.capacityCategory}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  Risk Willingness (D7–D12)
                </span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {result.willingnessScore} <span className="text-xs text-slate-400">/ 30</span>
                </div>
                <div className="text-xs font-bold text-blue-700 mt-0.5">
                  Level {result.willingnessLevel} • {result.willingnessCategory}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  Combined Score (Report Only)
                </span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">
                  {result.combinedScore} <span className="text-xs text-slate-400">/ 60</span>
                </div>
                <div className="text-[11px] text-amber-700 font-semibold mt-0.5">
                  *Not used for final classification
                </div>
              </div>
            </div>

            {/* Separation of Decision Stages */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Audited Profile Calculation Sequence
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400">1. Base Level:</span>
                  <div className="font-bold text-slate-900 mt-1">{result.baseProfile}</div>
                  <div className="text-[10px] text-slate-500">min(Capacity, Willingness)</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400">2. Applied Overrides:</span>
                  <div className="font-bold text-slate-900 mt-1">
                    {result.appliedOverrides.length > 0
                      ? `${result.appliedOverrides.map((o) => o.code).join(', ')}`
                      : 'None'}
                  </div>
                  <div className="text-[10px] text-slate-500">Most restrictive wins</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400">3. Adviser Adjustment:</span>
                  <div className="font-bold text-slate-900 mt-1">
                    {result.adviserAdjustment
                      ? result.adviserAdjustment.adjustedProfile
                      : 'None (Original)'}
                  </div>
                  <div className="text-[10px] text-slate-500">Downward only</div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-semibold">4. Final Profile:</span>
                  <div className="font-extrabold text-blue-900 text-sm mt-1">{result.finalProfile}</div>
                  <div className="text-[10px] text-blue-600">Active Mandate</div>
                </div>
              </div>
            </div>

            {/* Overrides Audit Breakdown (O1–O7) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  Prudential Overrides & Policy Flags ({result.appliedOverrides.length})
                </h4>
                <span className="text-[11px] text-slate-500">Framework Rule: Most Restrictive Override Wins</span>
              </div>

              {result.appliedOverrides.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No prudential overrides triggered. Base profile calculation remains unrestricted.</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.appliedOverrides.map((ov) => {
                    const isPendingApproval = ov.status === 'Pending Policy Approval';
                    const isUnevaluated = ov.status === 'Unevaluated' || ov.isUnevaluated;

                    return (
                      <div
                        key={ov.code}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          isPendingApproval
                            ? 'bg-amber-50/70 border-amber-300'
                            : isUnevaluated
                            ? 'bg-purple-50/70 border-purple-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-300 text-[11px]">
                              {ov.code}
                            </span>
                            <span className="font-bold text-slate-900">{ov.title}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isPendingApproval && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Pending Policy Approval
                              </span>
                            )}
                            {isUnevaluated && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                Unevaluated (Requires Clarification)
                              </span>
                            )}
                            {ov.status === 'Applied' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Active Cap Applied
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-600 text-[11px]">{ov.description}</p>

                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold">
                            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>Impact: {ov.impact}</span>
                          </div>
                          {ov.evidenceNotes && (
                            <div className="text-[11px] text-slate-500 font-mono pl-5">
                              {ov.evidenceNotes}
                            </div>
                          )}
                          {ov.withdrawalAmount && (
                            <div className="text-[11px] text-amber-800 font-medium pl-5">
                              Liquidity Amount: {ov.withdrawalAmount}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Adviser Downward Adjustment Form */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Adviser Risk Profile Adjustment (Lowering Only)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Advisers may lower an investor's profile if deemed prudent, but can never raise it above the calculated level.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <Lock className="w-3.5 h-3.5" /> Raising Locked
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Select Lower Risk Profile:
                  </label>
                  <select
                    value={overrideProfile}
                    onChange={(e) => setOverrideProfile(e.target.value as InvestmentRiskProfile)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium"
                  >
                    {[
                      'Conservative',
                      'Moderately Conservative',
                      'Moderate',
                      'Moderately Aggressive',
                      'Aggressive',
                    ].map((p) => {
                      const level = PROFILE_TO_LEVEL[p as InvestmentRiskProfile];
                      const isHigher = level >= currentLevel;
                      return (
                        <option key={p} value={p} disabled={isHigher}>
                          {p} {isHigher ? '(Blocked - Cannot Raise or Equal)' : '(Permitted - Lower)'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Mandatory Written Justification:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Investor expressed anxiety during verbal advisory session..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleApplyOverride}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <TrendingDown className="w-4 h-4" /> Apply Downward Adjustment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-slate-500 italic">No risk profile calculated.</div>
        )}
      </div>
    </div>
  );
};
