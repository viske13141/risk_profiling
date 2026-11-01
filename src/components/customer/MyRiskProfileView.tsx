/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Calendar,
  CheckCircle2,
  PieChart,
  FileCheck2,
  Scale,
  Info,
  Layers,
} from 'lucide-react';
import { Investor } from '../../types/investor';
import { INDICATIVE_ALLOCATIONS } from '../../utils/riskCalculation';
import { StatusBadge } from '../common/StatusBadge';

interface MyRiskProfileViewProps {
  investor: Investor;
  onRetake: () => void;
  onProceedToConsent?: () => void;
}

export const MyRiskProfileView: React.FC<MyRiskProfileViewProps> = ({
  investor,
  onRetake,
  onProceedToConsent,
}) => {
  const result = investor.riskResult;

  if (!result || result.isMissingAnswer) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Risk Assessment Incomplete</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You must complete all 12 scored questions (D1–D12) in the Risk Assessment before your investor risk profile can be computed.
        </p>
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
        >
          Start Risk Questionnaire
        </button>
      </div>
    );
  }

  const alloc = INDICATIVE_ALLOCATIONS[result.finalProfile];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Result Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold bg-blue-500/30 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              Verified Investor Risk Profile
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>Assessed: {result.assessmentDate}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Valid until: {result.nextReassessmentDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-center">
            <div className="md:col-span-2 space-y-2">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                Final Investment Classification
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                {result.finalProfile}
                <span className="text-sm font-semibold px-2.5 py-1 bg-white/10 rounded-lg text-blue-200">
                  Level {result.capacityLevel && result.willingnessLevel ? Math.min(result.capacityLevel, result.willingnessLevel) : 3} of 5
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {alloc.description}
              </p>
            </div>

            {/* Two Pillars: Capacity vs Willingness */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
              <div>
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Risk Capacity (D1–D6)</div>
                <div className="text-sm font-bold text-white flex items-center justify-between mt-0.5">
                  <span>{result.capacityCategory}</span>
                  <span className="text-xs text-blue-300">Level {result.capacityLevel}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Risk Willingness (D7–D12)</div>
                <div className="text-sm font-bold text-white flex items-center justify-between mt-0.5">
                  <span>{result.willingnessCategory}</span>
                  <span className="text-xs text-blue-300">Level {result.willingnessLevel}</span>
                </div>
              </div>

              <div className="pt-1 text-[10px] text-slate-400 italic">
                *Determined by the lower of capacity and willingness pillars.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Overrides Section */}
      {result.appliedOverrides.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Prudential Risk Overrides Applied ({result.appliedOverrides.length})
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            In accordance with investor protection rules (O1–O7), certain conservative boundaries were activated:
          </p>
          <div className="space-y-2 mt-2">
            {result.appliedOverrides.map((ov) => (
              <div
                key={ov.code}
                className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-amber-900 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono text-[10px]">
                      {ov.code}
                    </span>
                    <span>{ov.title}</span>
                    {ov.status === 'Pending Policy Approval' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-400">
                        Pending Policy Approval
                      </span>
                    )}
                    {ov.status === 'Unevaluated' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                        Unevaluated (Clarification Requested)
                      </span>
                    )}
                  </div>
                  <div className="text-amber-800 mt-1">{ov.description}</div>
                  {ov.withdrawalAmount && (
                    <div className="text-[11px] text-amber-900 font-medium mt-1">
                      Liquidity requirement: {ov.withdrawalAmount}
                    </div>
                  )}
                  {ov.requiresBusinessApproval && (
                    <div className="text-[11px] text-amber-900 font-semibold mt-1">
                      ⚠️ Note: Partial withdrawal ring-fencing awaits formal policy and compliance approval. Portfolio allocation remains unchanged until approved.
                    </div>
                  )}
                </div>
                <span className="shrink-0 font-semibold text-amber-900 bg-amber-100 px-2 py-1 rounded-md text-[11px]">
                  {ov.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicative Asset Allocation Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Indicative Asset Allocation Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target asset split aligned with your {result.finalProfile} risk profile.
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Source: Wealth Management Framework
          </span>
        </div>

        {/* Visual Allocation Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-blue-600">Growth / Equity Assets: {alloc.equityRange}</span>
            <span className="text-slate-600">Fixed Income / Debt Assets: {alloc.debtRange}</span>
          </div>

          <div className="h-5 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
            <div
              style={{
                width:
                  result.finalProfile === 'Conservative'
                    ? '10%'
                    : result.finalProfile === 'Moderately Conservative'
                    ? '30%'
                    : result.finalProfile === 'Moderate'
                    ? '55%'
                    : result.finalProfile === 'Moderately Aggressive'
                    ? '80%'
                    : '95%',
              }}
              className="bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white transition-all duration-700"
            >
              Equity
            </div>
            <div className="flex-1 bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-700">
              Debt / Fixed Income
            </div>
          </div>
        </div>

        {/* Scheme Categories */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Approved Scheme Categories for this Profile:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {alloc.schemes.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Disclaimers */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-500" />
            Mandatory Suitability & Risk Disclosures
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
            <li>These allocations represent indicative framework ranges, not guaranteed model portfolios.</li>
            <li>Scheme riskometers and latest Scheme Information Documents (SID) must be verified prior to actual deployment.</li>
            <li>No representation of guaranteed or capital-protected returns is made.</li>
            <li>Final portfolio activation requires formal advisory suitability sign-off.</li>
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
        >
          <RotateCcw className="w-4 h-4" /> Retake Risk Questionnaire
        </button>

        {onProceedToConsent && (
          <button
            onClick={onProceedToConsent}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
          >
            <FileCheck2 className="w-4 h-4" /> Proceed to Consent & Declarations
          </button>
        )}
      </div>
    </div>
  );
};
