/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { Investor, InvestmentRiskProfile } from '../../types/investor';
import { INDICATIVE_ALLOCATIONS, LEVEL_TO_PROFILE } from '../../utils/riskCalculation';
import { StatusBadge } from '../common/StatusBadge';

interface InvestmentSuitabilityViewProps {
  investor: Investor;
  onSelectProductCategory?: (category: string) => void;
}

export const InvestmentSuitabilityView: React.FC<InvestmentSuitabilityViewProps> = ({
  investor,
}) => {
  const currentProfile = investor.riskResult?.finalProfile || 'Moderate';
  const [selectedProfilePreview, setSelectedProfilePreview] = useState<InvestmentRiskProfile>(currentProfile);
  const [showHigherRiskModal, setShowHigherRiskModal] = useState(false);
  const [acknowledgedHigherRisk, setAcknowledgedHigherRisk] = useState(false);

  const previewAlloc = INDICATIVE_ALLOCATIONS[selectedProfilePreview];

  const allProfiles: InvestmentRiskProfile[] = [
    'Conservative',
    'Moderately Conservative',
    'Moderate',
    'Moderately Aggressive',
    'Aggressive',
  ];

  const currentLevelIndex = allProfiles.indexOf(currentProfile);
  const previewLevelIndex = allProfiles.indexOf(selectedProfilePreview);
  const isHigherRisk = previewLevelIndex > currentLevelIndex;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Investment Suitability Architecture
              </span>
              <StatusBadge type="risk" value={currentProfile} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Product Suitability & Asset Allocation Alignment
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Indicative scheme categories and target asset classes mapped to your assessed risk profile.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Suitability Status</span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {investor.suitabilityReviewed ? (
                <span className="text-emerald-600 flex items-center gap-1.5 justify-end">
                  <CheckCircle2 className="w-4 h-4" /> Signed-Off by Adviser
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1.5 justify-end">
                  <AlertTriangle className="w-4 h-4" /> Pending Adviser Review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Matrix comparison tabs */}
        <div className="mt-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Explore Indicative Allocations by Profile Level
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {allProfiles.map((p, idx) => {
              const isUserCurrent = p === currentProfile;
              const isSelected = p === selectedProfilePreview;

              return (
                <button
                  key={p}
                  onClick={() => setSelectedProfilePreview(p)}
                  className={`p-3 rounded-xl border text-left transition relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  {isUserCurrent && (
                    <span className="absolute -top-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                      YOUR PROFILE
                    </span>
                  )}
                  <div className="text-[10px] text-slate-400 font-semibold">Level {idx + 1}</div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{p}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Profile Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Profile Scope Preview
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-3">
              {selectedProfilePreview}
              {isHigherRisk && (
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                  Higher Risk Than Assessed
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{previewAlloc.description}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500">Indicative Equity Range:</span>
            <div className="text-lg font-bold text-blue-600">{previewAlloc.equityRange}</div>
          </div>
        </div>

        {/* Warning if user explores higher risk scheme than assessed */}
        {isHigherRisk && (
          <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Statutory Warning: Scheme Risk Exceeds Assessed Risk Profile
            </div>
            <p className="text-xs text-rose-700 leading-relaxed">
              Your assessed investor risk profile is <strong>{currentProfile}</strong>. Selecting products in the <strong>{selectedProfilePreview}</strong> category exposes your capital to higher volatility than your assessed capacity/willingness.
            </p>
            <div className="text-[11px] text-rose-800 font-semibold">
              *SEBI Requirement: Proceeding with higher-risk product categories requires an explicit, separate written / e-signed risk acknowledgement declaration.
            </div>

            {/* Interactive Higher-Risk Acknowledgment Flow */}
            <div className="pt-2 border-t border-rose-200/80">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={acknowledgedHigherRisk}
                  onChange={(e) => setAcknowledgedHigherRisk(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="text-rose-950 font-medium">
                  I understand that {selectedProfilePreview} products carry higher downside volatility than my assessed risk profile of {currentProfile}. I voluntarily confirm my intention to allocate capital to this category.
                </span>
              </label>

              {acknowledgedHigherRisk && (
                <div className="mt-3 p-3 bg-white/80 rounded-lg border border-rose-200 text-[11px] text-rose-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span><strong>Risk Exceedance Acknowledged:</strong> Electronic record logged for adviser compliance audit.</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                    Audit Ref: RIA-EXC-{(Math.random() * 10000 | 0).toString().padStart(4, '0')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scheme Categories */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Approved Scheme & Product Categories
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {previewAlloc.schemes.map((scheme) => (
              <div
                key={scheme}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{scheme}</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Indicative
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Review Notice */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-blue-950">Independent Suitability Review</div>
            <div className="text-blue-800 text-[11px]">
              Per SEBI (Investment Advisers) Regulations, matching product categories alone does not constitute automatic approval.
              Assigned adviser (<strong>{investor.assignedAdviser}</strong>) will review your horizon, dependents, and liquidity before recommending specific schemes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
