/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  FileText,
  UserCheck,
  Building2,
  Info,
} from 'lucide-react';
import { Investor, AMLClassification } from '../../types/investor';
import { StatusBadge } from '../common/StatusBadge';

interface AMLComplianceWorkspaceProps {
  investors: Investor[];
  onUpdateAML: (id: string, aml: AMLClassification, notes?: string) => void;
}

export const AMLComplianceWorkspace: React.FC<AMLComplianceWorkspaceProps> = ({
  investors,
  onUpdateAML,
}) => {
  const [selectedInvestorId, setSelectedInvestorId] = useState(
    investors.find((i) => i.amlClassification === 'High')?.id || investors[0].id
  );
  const [eddNotes, setEddNotes] = useState('');
  const [targetClassification, setTargetClassification] = useState<AMLClassification>('High');

  const selectedInvestor =
    investors.find((i) => i.id === selectedInvestorId) || investors[0];

  const handleSaveAML = () => {
    onUpdateAML(selectedInvestor.id, targetClassification, eddNotes);
    alert(`AML Classification for ${selectedInvestor.name} updated to ${targetClassification}.`);
    setEddNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Assessment A • Independent AML Module
          </span>
          <span className="text-xs text-slate-400">PMLA Compliance</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Anti-Money Laundering (AML) & PEP Compliance Workspace
        </h2>
        <p className="text-xs text-slate-500">
          Independent identity and financial-crime risk tiering (Low, Medium, High).
          Strict regulatory separation: This assessment is never combined with the financial risk questionnaire (D1–D12).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investor List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active Investor Queue ({investors.length})
          </div>
          <div className="space-y-2">
            {investors.map((inv) => {
              const isSelected = inv.id === selectedInvestor.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvestorId(inv.id);
                    setTargetClassification(inv.amlClassification);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{inv.name}</span>
                    <StatusBadge type="aml" value={inv.amlClassification} />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {inv.investorCategory} • PEP: <strong>{inv.kycData.pepDeclaration}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Investor AML Dossier */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <div className="text-xs text-slate-400 font-mono">{selectedInvestor.id}</div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{selectedInvestor.name}</span>
                <StatusBadge type="aml" value={selectedInvestor.amlClassification} />
              </h3>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Category:</span>{' '}
              <strong className="text-slate-800">{selectedInvestor.investorCategory}</strong>
            </div>
          </div>

          {/* Compliance Attributes Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Politically Exposed Person (PEP):</span>
              <div
                className={`font-bold ${
                  selectedInvestor.kycData.pepDeclaration !== 'No'
                    ? 'text-rose-700'
                    : 'text-emerald-700'
                }`}
              >
                {selectedInvestor.kycData.pepDeclaration}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">FATCA / CRS Jurisdiction:</span>
              <div className="font-bold text-slate-800">
                {selectedInvestor.kycData.fatcaDeclaration}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Verified Source of Wealth:</span>
              <div className="font-bold text-slate-800">
                {selectedInvestor.kycData.sourceOfWealth}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-medium">Beneficial Ownership Declared:</span>
              <div className="font-bold text-emerald-700">
                {selectedInvestor.kycData.beneficialOwnershipDeclared ? 'Yes (Verified)' : 'No'}
              </div>
            </div>
          </div>

          {/* High-Risk EDD Section if PEP or High Risk */}
          {selectedInvestor.amlClassification === 'High' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="font-bold text-xs flex items-center gap-1.5 text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Enhanced Due Diligence (EDD) Mandatory Requirements:
              </div>
              <ul className="list-disc pl-5 text-[11px] space-y-1 text-rose-800">
                <li>Senior management / Principal Officer approval required prior to onboarding.</li>
                <li>Verify source of funds documentation and bank statement trail for transactions &gt; ₹50 Lakhs.</li>
                <li>Conduct adverse media screen and sanctions screening on beneficial partners.</li>
              </ul>
            </div>
          )}

          {/* Review Decision Form */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">
              Update Compliance AML Classification & Audit Findings
            </div>

            <div className="flex gap-2">
              {(['Low', 'Medium', 'High'] as AMLClassification[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTargetClassification(c)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                    targetClassification === c
                      ? c === 'Low'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : c === 'Medium'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c} Risk
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Compliance Review Findings / Escalation Notes:
              </label>
              <textarea
                rows={2}
                placeholder="Record basis of AML decision, sanction screening reference, or PEP approval..."
                value={eddNotes}
                onChange={(e) => setEddNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveAML}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
              >
                Save AML Assessment Decision
              </button>
            </div>
          </div>

          {/* Regulatory Note */}
          <div className="text-[11px] text-slate-400 italic">
            *Regulatory Disclosure: The framework does not use an arbitrary numerical formula for AML. AML decisions are rule-based and compliance-officer authorized.
          </div>
        </div>
      </div>
    </div>
  );
};
