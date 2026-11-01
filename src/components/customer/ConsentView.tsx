/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Download,
  ExternalLink,
  ChevronRight,
  PenTool,
} from 'lucide-react';
import { Investor } from '../../types/investor';
import { StatusBadge } from '../common/StatusBadge';

interface ConsentViewProps {
  investor: Investor;
  onSignConsent: () => void;
  onCompleteOnboarding: () => void;
}

export const ConsentView: React.FC<ConsentViewProps> = ({
  investor,
  onSignConsent,
  onCompleteOnboarding,
}) => {
  const [agreed1, setAgreed1] = useState(investor.consentGiven);
  const [agreed2, setAgreed2] = useState(investor.consentGiven);
  const [agreed3, setAgreed3] = useState(investor.consentGiven);
  const [isSigning, setIsSigning] = useState(false);
  const [hasSigned, setHasSigned] = useState(investor.consentGiven);

  const canSign = agreed1 && agreed2 && agreed3;

  const handleSimulateSign = () => {
    if (!canSign) return;
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setHasSigned(true);
      onSignConsent();
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Step 7 of 8 • Consent & E-Sign
              </span>
              <span className="text-xs font-semibold text-slate-500">Legal Confirmation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Investor Consent, Risk Acceptance & E-Signature
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Final review of all submitted identity KYC records, financial capacity, investment goals, and assessed risk profile.
            </p>
          </div>

          <button
            onClick={() => alert('Downloaded formal Investor Onboarding & Risk Profiling Application PDF.')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="w-4 h-4" /> Download Application PDF
          </button>
        </div>

        {hasSigned && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-xs text-emerald-900">
                  Investor Consent Form Digitally Signed & Locked
                </div>
                <div className="text-[11px] text-emerald-700">
                  Timestamp: {investor.consentTimestamp || new Date().toLocaleString()} • Aadhaar e-Sign Mock Token #LV-ESIGN-88419
                </div>
              </div>
            </div>
            <button
              onClick={onCompleteOnboarding}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              Proceed to Suitability Review
            </button>
          </div>
        )}
      </div>

      {/* Summary Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & KYC Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Identity & KYC Attributes
            </span>
            <StatusBadge type="kyc" value={investor.kycStatus} />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Legal Name</span>
              <span className="font-semibold text-slate-900">{investor.kycData.legalFullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Entity Category</span>
              <span className="font-semibold text-slate-900">{investor.investorCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">PAN</span>
              <span className="font-mono text-slate-900">{investor.kycData.panNumberMasked}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">PEP Declaration</span>
              <span className="font-semibold text-slate-900">{investor.kycData.pepDeclaration}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Primary Bank</span>
              <span className="font-semibold text-slate-900">{investor.bankAccounts[0]?.bankName || 'Verified Bank'}</span>
            </div>
          </div>
        </div>

        {/* Risk Profile Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Computed Risk Profile
            </span>
            <StatusBadge type="risk" value={investor.riskResult?.finalProfile || 'Moderate'} />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Risk Capacity (D1–D6)</span>
              <span className="font-semibold text-slate-900">{investor.riskResult?.capacityCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Risk Willingness (D7–D12)</span>
              <span className="font-semibold text-slate-900">{investor.riskResult?.willingnessCategory}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Calculated Final Profile</span>
              <span className="font-bold text-blue-700">{investor.riskResult?.finalProfile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Overrides Triggered</span>
              <span className="font-semibold text-slate-900">
                {investor.riskResult?.appliedOverrides.length || 0} active
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Next Reassessment</span>
              <span className="font-semibold text-emerald-600">{investor.riskResult?.nextReassessmentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Declarations & Mandatory Disclosures */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
          Statutory Declarations & Undertakings
        </h3>

        <div className="space-y-3 text-xs">
          {/* Checkbox 1: Accuracy */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed1}
              onChange={(e) => setAgreed1(e.target.checked)}
              className="mt-0.5 rounded text-blue-600"
            />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">Truthfulness of Information</div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                I hereby declare that all particulars and details provided across KYC, financial profiling, existing assets, liabilities, and risk assessment are complete, accurate, and current to the best of my knowledge.
              </p>
            </div>
          </label>

          {/* Checkbox 2: Direct/Regular Plan Disclosure */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed2}
              onChange={(e) => setAgreed2(e.target.checked)}
              className="mt-0.5 rounded text-blue-600"
            />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">
                Direct / Regular Plan & Commission Disclosure
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                I acknowledge the disclosure between Direct plans (nil distributor commission) and Regular plans (with ongoing distributor trail commissions). I confirm my selected execution preference is <strong>{investor.directPlanPreference}</strong>.
              </p>
            </div>
          </label>

          {/* Checkbox 3: Risk Acceptance & Market Fluctuation */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed3}
              onChange={(e) => setAgreed3(e.target.checked)}
              className="mt-0.5 rounded text-blue-600"
            />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">
                Risk Acceptance & No Return Guarantee
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                I understand that investments in capital market instruments, debt instruments, and mutual fund schemes carry investment risks, including potential loss of principal. I acknowledge that indicative allocations do not constitute guaranteed returns.
              </p>
            </div>
          </label>
        </div>

        {/* E-Sign Simulation Box */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Aadhaar e-Sign / Digital Electronic Signature
              </div>
              <div className="text-[11px] text-slate-500">
                {hasSigned
                  ? 'Digital signature timestamped and verified.'
                  : 'UIDAI OTP / Digital signature mock authentication workflow.'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateSign}
            disabled={!canSign || hasSigned || isSigning}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition ${
              hasSigned
                ? 'bg-emerald-600 text-white cursor-default'
                : canSign
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {hasSigned ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Signed Successfully
              </>
            ) : isSigning ? (
              'Verifying OTP & Signing...'
            ) : (
              'Click to e-Sign Application'
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-400 italic text-center">
          *Demo Prototype Note: Electronic signature is safely simulated in this frontend environment.
        </div>
      </div>
    </div>
  );
};
