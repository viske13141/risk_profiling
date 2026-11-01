/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  User,
  CreditCard,
  FileText,
  PieChart,
  Target,
  FileCheck2,
  Layers,
  History,
  X,
} from 'lucide-react';
import { Investor, KYCStatus, AMLClassification, InvestmentRiskProfile } from '../../types/investor';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

interface InvestorManagementViewProps {
  investors: Investor[];
  selectedInvestorId: string;
  onSelectInvestor: (id: string) => void;
  onUpdateKYCStatus: (id: string, status: KYCStatus, remarks?: string) => void;
  onUpdateAML: (id: string, aml: AMLClassification, notes?: string) => void;
  onApplyRiskOverride: (id: string, target: InvestmentRiskProfile, reason: string) => void;
}

export const InvestorManagementView: React.FC<InvestorManagementViewProps> = ({
  investors,
  selectedInvestorId,
  onSelectInvestor,
  onUpdateKYCStatus,
  onUpdateAML,
  onApplyRiskOverride,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [kycFilter, setKycFilter] = useState('All');
  const [amlFilter, setAmlFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Modal 360 State
  const [is360Open, setIs360Open] = useState(false);
  const [active360Tab, setActive360Tab] = useState<number>(1);

  // Review Action Modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'RequestInfo' | 'Reject'>('Approve');
  const [actionRemarks, setActionRemarks] = useState('');

  const currentInvestor =
    investors.find((i) => i.id === selectedInvestorId) || investors[0];

  const filteredInvestors = investors.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || inv.investorCategory === categoryFilter;
    const matchesKyc = kycFilter === 'All' || inv.kycStatus === kycFilter;
    const matchesAml = amlFilter === 'All' || inv.amlClassification === amlFilter;
    const matchesRisk =
      riskFilter === 'All' || inv.riskResult?.finalProfile === riskFilter;

    return matchesSearch && matchesCategory && matchesKyc && matchesAml && matchesRisk;
  });

  const handleOpen360 = (inv: Investor, defaultTab = 1) => {
    onSelectInvestor(inv.id);
    setActive360Tab(defaultTab);
    setIs360Open(true);
  };

  const handleExecuteAction = () => {
    if (actionType === 'Reject' && !actionRemarks.trim()) {
      alert('A mandatory rejection reason is required for compliance audit trails.');
      return;
    }
    if (actionType === 'RequestInfo' && !actionRemarks.trim()) {
      alert('Please specify what additional information is required.');
      return;
    }

    if (actionType === 'Approve') {
      onUpdateKYCStatus(currentInvestor.id, 'Verified', 'Identity and documents verified by compliance.');
    } else if (actionType === 'RequestInfo') {
      onUpdateKYCStatus(currentInvestor.id, 'Additional Information Required', actionRemarks);
    } else if (actionType === 'Reject') {
      onUpdateKYCStatus(currentInvestor.id, 'Rejected', actionRemarks);
    }

    setActionModalOpen(false);
    setActionRemarks('');
  };

  const tabLabels = [
    '1. Overview',
    '2. Personal Info',
    '3. KYC Details',
    '4. Documents',
    '5. Financial Profile',
    '6. Investment Goals',
    '7. Risk Assessment',
    '8. AML & Compliance',
    '9. Bank Accounts',
    '10. Nominees',
    '11. Consent',
    '12. Activities',
    '13. Audit History',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Investor Management & Comprehensive 360 Repository
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance oversight, document verification, AML due diligence, and risk profiling records.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by investor name, ID (INV-...), or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700"
            >
              <option value="All">All Categories</option>
              <option value="Individual">Individual</option>
              <option value="HUF">HUF</option>
              <option value="Company">Company</option>
              <option value="Trust">Trust</option>
              <option value="Partnership">Partnership</option>
            </select>

            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700"
            >
              <option value="All">All KYC Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Under Review">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Additional Information Required">Info Required</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={amlFilter}
              onChange={(e) => setAmlFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700"
            >
              <option value="All">All AML Tiers</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Investor</th>
                <th className="p-3">Category</th>
                <th className="p-3">Registration</th>
                <th className="p-3">KYC Status</th>
                <th className="p-3">AML Tier</th>
                <th className="p-3">Risk Profile</th>
                <th className="p-3">Assigned Adviser</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvestors.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{inv.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {inv.id} • {inv.email}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{inv.investorCategory}</td>
                  <td className="p-3 text-slate-600">{inv.registrationDate}</td>
                  <td className="p-3">
                    <StatusBadge type="kyc" value={inv.kycStatus} />
                  </td>
                  <td className="p-3">
                    <StatusBadge type="aml" value={inv.amlClassification} />
                  </td>
                  <td className="p-3">
                    <StatusBadge type="risk" value={inv.riskResult?.finalProfile || 'Moderate'} />
                  </td>
                  <td className="p-3 text-slate-700 font-medium">
                    {inv.assignedAdviser.split(',')[0]}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${inv.onboardingProgress}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700">{inv.onboardingProgress}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => handleOpen360(inv, 1)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                    >
                      Investor 360
                    </button>
                    <button
                      onClick={() => {
                        onSelectInvestor(inv.id);
                        setActionType('Approve');
                        setActionModalOpen(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                      title="Quick KYC Review"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVESTOR 360 COMPREHENSIVE MODAL (13 TABS) */}
      <Modal
        isOpen={is360Open}
        onClose={() => setIs360Open(false)}
        title={`Investor 360: ${currentInvestor.name} (${currentInvestor.id})`}
        subtitle={`${currentInvestor.investorCategory} • KYC: ${currentInvestor.kycStatus} • AML: ${currentInvestor.amlClassification} • Risk Profile: ${currentInvestor.riskResult?.finalProfile}`}
        maxWidth="max-w-5xl"
      >
        <div className="space-y-5">
          {/* 13 Tabs navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
            {tabLabels.map((label, idx) => (
              <button
                key={label}
                onClick={() => setActive360Tab(idx + 1)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  active360Tab === idx + 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {active360Tab === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400">Onboarding Stage</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentInvestor.currentStage}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400">KYC Status</div>
                  <div className="font-bold text-emerald-700 mt-0.5">{currentInvestor.kycStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400">AML Risk Classification</div>
                  <div className="font-bold text-slate-900 mt-0.5">{currentInvestor.amlClassification}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-400">Final Risk Profile</div>
                  <div className="font-bold text-blue-700 mt-0.5">{currentInvestor.riskResult?.finalProfile}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="font-bold text-slate-800">Quick Compliance Actions:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setActionType('Approve');
                      setActionModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Mark KYC Verified
                  </button>
                  <button
                    onClick={() => {
                      setActionType('RequestInfo');
                      setActionModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  >
                    Request Additional Info
                  </button>
                  <button
                    onClick={() => {
                      setActionType('Reject');
                      setActionModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                  >
                    Reject KYC with Reason
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFO */}
          {active360Tab === 2 && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400">Legal Name:</span>{' '}
                  <strong>{currentInvestor.kycData.legalFullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">DOB:</span>{' '}
                  <strong>{currentInvestor.kycData.dateOfBirth}</strong>
                </div>
                <div>
                  <span className="text-slate-400">PAN (Masked):</span>{' '}
                  <strong className="font-mono">{currentInvestor.kycData.panNumberMasked}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Aadhaar (Masked):</span>{' '}
                  <strong className="font-mono">{currentInvestor.kycData.aadhaarMasked}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Phone:</span>{' '}
                  <strong>{currentInvestor.phone}</strong> (OTP Verified)
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>{' '}
                  <strong>{currentInvestor.email}</strong> (Verified)
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Permanent Address:</span>{' '}
                  <span>{currentInvestor.kycData.permanentAddress}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KYC DETAILS */}
          {active360Tab === 3 && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400">KRA Registry Status:</span>{' '}
                  <strong className="text-emerald-700">{currentInvestor.kycData.kraStatus}</strong>
                </div>
                <div>
                  <span className="text-slate-400">CKYC Central Registry:</span>{' '}
                  <strong className="text-emerald-700">{currentInvestor.kycData.ckycStatus}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Occupation:</span>{' '}
                  <strong>{currentInvestor.kycData.occupation}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Income Slab:</span>{' '}
                  <strong>{currentInvestor.kycData.annualIncomeSlab}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Source of Wealth:</span>{' '}
                  <strong>{currentInvestor.kycData.sourceOfWealth}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Residential Status:</span>{' '}
                  <strong>{currentInvestor.kycData.residentialStatus}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {active360Tab === 4 && (
            <div className="space-y-3 text-xs">
              {currentInvestor.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{doc.documentType}</div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      {doc.fileName} ({doc.fileSize}) • {doc.uploadDate}
                    </div>
                    {doc.remarks && (
                      <div className="text-amber-700 font-medium text-[11px] mt-0.5">
                        Remarks: {doc.remarks}
                      </div>
                    )}
                  </div>
                  <StatusBadge type="kyc" value={doc.status} />
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FINANCIAL PROFILE (B1-B9) */}
          {active360Tab === 5 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Unscored Financial Profile (Questions B1 to B9)
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <strong>B1 Dependents:</strong> {currentInvestor.financialProfile.dependents}
                  </div>
                  <div>
                    <strong>B2 Net Worth:</strong> {currentInvestor.financialProfile.netWorth}
                  </div>
                  <div>
                    <strong>B3 Monthly Surplus:</strong> {currentInvestor.financialProfile.monthlyInvestmentComfort}
                  </div>
                  <div>
                    <strong>B4 Lump-Sum:</strong> {currentInvestor.financialProfile.lumpSumCapacity}
                  </div>
                  <div>
                    <strong>B6 Debt Servicing:</strong> {currentInvestor.financialProfile.existingDebtEmi}
                  </div>
                  <div>
                    <strong>B8 Anticipated Changes:</strong> {currentInvestor.financialProfile.anticipatedChanges}
                  </div>
                  <div className="col-span-2">
                    <strong>B5 Existing Portfolio:</strong>{' '}
                    {currentInvestor.financialProfile.existingPortfolio?.join(', ')}
                  </div>
                  <div className="col-span-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <strong>B9 Needed within 12 Months:</strong>{' '}
                    <span className="font-bold text-blue-900">{currentInvestor.financialProfile.neededWithin12Months}</span>
                    {currentInvestor.financialProfile.neededAmount && ` (${currentInvestor.financialProfile.neededAmount})`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INVESTMENT GOALS */}
          {active360Tab === 6 && (
            <div className="space-y-3 text-xs">
              {currentInvestor.investmentGoals.map((g) => (
                <div key={g.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between">
                  <div>
                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {g.category}
                    </span>
                    <div className="text-slate-800 font-semibold mt-1">{g.description}</div>
                    <div className="text-slate-500 text-[11px]">
                      Approach: {g.investmentApproach} • Priority: {g.priority}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      ₹{(g.targetAmount / 100000).toLocaleString('en-IN')} Lakhs
                    </div>
                    <div className="text-slate-400">Target Year {g.targetYear}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: RISK ASSESSMENT */}
          {active360Tab === 7 && currentInvestor.riskResult && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400">Capacity Score (D1-D6):</span>
                  <div className="text-base font-bold text-slate-900">
                    {currentInvestor.riskResult.capacityScore} / 30
                  </div>
                  <div className="text-blue-700 font-semibold">
                    {currentInvestor.riskResult.capacityCategory} (Level {currentInvestor.riskResult.capacityLevel})
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Willingness Score (D7-D12):</span>
                  <div className="text-base font-bold text-slate-900">
                    {currentInvestor.riskResult.willingnessScore} / 30
                  </div>
                  <div className="text-blue-700 font-semibold">
                    {currentInvestor.riskResult.willingnessCategory} (Level {currentInvestor.riskResult.willingnessLevel})
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Final Calculated Profile:</span>
                  <div className="text-base font-bold text-indigo-700">
                    {currentInvestor.riskResult.finalProfile}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Lower of two levels + Overrides
                  </div>
                </div>
              </div>

              {currentInvestor.riskResult.appliedOverrides.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold text-xs">Active Prudential Overrides (O1–O7):</div>
                  {currentInvestor.riskResult.appliedOverrides.map((ov) => (
                    <div key={ov.code} className="text-[11px]">
                      <strong>{ov.code}: {ov.title}</strong> — {ov.impact}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: AML & COMPLIANCE */}
          {active360Tab === 8 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">AML Classification:</span>
                  <StatusBadge type="aml" value={currentInvestor.amlClassification} />
                </div>
                <div>
                  <span className="text-slate-400">PEP Status:</span>{' '}
                  <strong className="text-rose-700">{currentInvestor.kycData.pepDeclaration}</strong>
                </div>
                <div>
                  <span className="text-slate-400">FATCA / CRS:</span>{' '}
                  <strong>{currentInvestor.kycData.fatcaDeclaration}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Source of Wealth:</span>{' '}
                  <strong>{currentInvestor.kycData.sourceOfWealth}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BANK ACCOUNTS */}
          {active360Tab === 9 && (
            <div className="space-y-3 text-xs">
              {currentInvestor.bankAccounts.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{b.bankName}</div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      Acc: {b.accountNumberMasked} • IFSC: {b.ifscCode}
                    </div>
                  </div>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Penny Drop Verified
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 10: NOMINEES */}
          {active360Tab === 10 && (
            <div className="space-y-3 text-xs">
              {currentInvestor.nominees.length > 0 ? (
                currentInvestor.nominees.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{n.name} ({n.relationship})</div>
                      <div className="text-slate-500 text-[11px]">DOB: {n.dateOfBirth} • Contact: {n.contactNumber}</div>
                    </div>
                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      {n.sharePercentage}% Share
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-slate-500 italic">No individual nominees registered.</div>
              )}
            </div>
          )}

          {/* TAB 11: CONSENT */}
          {active360Tab === 11 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consent Given:</span>
                  <strong>{currentInvestor.consentGiven ? 'Yes (Verified)' : 'Pending'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="font-mono">{currentInvestor.consentTimestamp || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan Disclosure:</span>
                  <strong>{currentInvestor.directPlanPreference} Plan Chosen</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: ACTIVITIES */}
          {active360Tab === 12 && (
            <div className="space-y-3 text-xs">
              {currentInvestor.notes.map((n) => (
                <div key={n.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{n.author}</span>
                    <span className="text-slate-400 font-normal">{n.date}</span>
                  </div>
                  <p className="text-slate-600">{n.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 13: AUDIT HISTORY */}
          {active360Tab === 13 && (
            <div className="space-y-3 text-xs">
              {currentInvestor.auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{log.action}</span>
                    <span className="text-slate-400 font-normal">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                  <div className="text-[10px] text-slate-400 italic">Performed by: {log.performedBy}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* KYC ACTION MODAL */}
      <Modal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title={`KYC Action: ${actionType} for ${currentInvestor.name}`}
        subtitle={`Investor ID: ${currentInvestor.id}`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Action Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Approve', 'RequestInfo', 'Reject'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActionType(t)}
                  className={`py-2 px-3 rounded-lg font-bold border transition ${
                    actionType === t
                      ? t === 'Approve'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : t === 'RequestInfo'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {t === 'Approve' ? 'Verify KYC' : t === 'RequestInfo' ? 'Request Info' : 'Reject KYC'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {actionType === 'Reject'
                ? 'Mandatory Rejection Reason'
                : actionType === 'RequestInfo'
                ? 'Specific Information Required'
                : 'Compliance Verification Remarks (Optional)'}
            </label>
            <textarea
              rows={3}
              placeholder={
                actionType === 'Reject'
                  ? 'Specify regulatory basis for KYC rejection...'
                  : actionType === 'RequestInfo'
                  ? 'e.g. Uploaded PAN scan is blurred; please re-upload clear color image.'
                  : 'Document match confirmed against NDML KRA.'
              }
              value={actionRemarks}
              onChange={(e) => setActionRemarks(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              onClick={() => setActionModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteAction}
              className={`px-5 py-2 text-white font-bold rounded-lg shadow-xs ${
                actionType === 'Approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : actionType === 'RequestInfo'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Confirm Action
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
