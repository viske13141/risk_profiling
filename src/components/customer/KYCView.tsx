/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  User,
  CreditCard,
  ShieldAlert,
  ChevronRight,
  Save,
  Check,
  Eye,
} from 'lucide-react';
import { Investor, KYCData, InvestorCategory } from '../../types/investor';
import { StatusBadge } from '../common/StatusBadge';

interface KYCViewProps {
  investor: Investor;
  onUpdateKYC: (updatedKYC: Partial<KYCData>, newStatus?: any) => void;
  onContinue: () => void;
}

export const KYCView: React.FC<KYCViewProps> = ({
  investor,
  onUpdateKYC,
  onContinue,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'A1' | 'A2' | 'A3' | 'Docs'>('A1');

  const [formData, setFormData] = useState<KYCData>({
    ...investor.kycData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleFieldChange = (field: keyof KYCData, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveDraft = () => {
    onUpdateKYC(formData, 'Draft');
    setSaveSuccessMsg('KYC information saved as Draft.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateKYC(formData, 'Submitted');
      setIsSubmitting(false);
      setSaveSuccessMsg('KYC Application successfully submitted for Compliance Review.');
      setTimeout(() => {
        onContinue();
      }, 1200);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Step 2 of 8 • Section A
              </span>
              <StatusBadge type="kyc" value={investor.kycStatus} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Identity Verification & Regulatory KYC
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              SEBI / RBI regulatory identity verification including CKYC, KRA, AML, and FATCA compliance declarations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit KYC'}
            </button>
          </div>
        </div>

        {/* Alerts if Additional Information Required */}
        {investor.kycStatus === 'Additional Information Required' && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-xs text-amber-800">
                Action Required: Additional Information Requested by Compliance
              </div>
              <div className="text-xs text-amber-700 mt-0.5">
                The compliance admin requested: "Uploaded PAN scan has slight glare obscuring the date of birth. Please re-upload a clear color scan."
              </div>
            </div>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Sub-tabs navigation */}
        <div className="flex border-b border-slate-200 mt-6 gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('A1')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'A1'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            A1. Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('A2')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'A2'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            A2. Declarations (PEP/FATCA)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('A3')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'A3'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            A3. Bank & Nominees
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('Docs')}
            className={`pb-3 border-b-2 transition whitespace-nowrap ${
              activeSubTab === 'Docs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            A4. Document Uploads ({investor.documents.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {/* SECTION A1: PERSONAL DETAILS */}
      {activeSubTab === 'A1' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Legal Identity & Contact Attributes
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Investor Legal Entity Type
              </label>
              <select
                value={formData.investorCategory}
                onChange={(e) => handleFieldChange('investorCategory', e.target.value as InvestorCategory)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              >
                <option value="Individual">Individual</option>
                <option value="HUF">Hindu Undivided Family (HUF)</option>
                <option value="Company">Private / Public Limited Company</option>
                <option value="Trust">Trust / Association of Persons</option>
                <option value="Partnership">Partnership / LLP</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.legalFullName}
                onChange={(e) => handleFieldChange('legalFullName', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth / Incorporation</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleFieldChange('gender', e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Entity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PAN (Masked)</label>
              <input
                type="text"
                value={formData.panNumberMasked}
                onChange={(e) => handleFieldChange('panNumberMasked', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar / OVD (Masked)</label>
              <input
                type="text"
                value={formData.aadhaarMasked}
                onChange={(e) => handleFieldChange('aadhaarMasked', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Status</label>
              <select
                value={formData.residentialStatus}
                onChange={(e) => handleFieldChange('residentialStatus', e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              >
                <option value="Resident Individual">Resident Individual</option>
                <option value="Non-Resident Indian (NRI)">Non-Resident Indian (NRI)</option>
                <option value="Person of Indian Origin (PIO)">Person of Indian Origin (PIO)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <Check className="w-3.5 h-3.5" /> OTP Verified
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <Check className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Correspondence Address</label>
              <textarea
                rows={2}
                value={formData.correspondenceAddress}
                onChange={(e) => handleFieldChange('correspondenceAddress', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Address</label>
              <textarea
                rows={2}
                value={formData.permanentAddress}
                onChange={(e) => handleFieldChange('permanentAddress', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleFieldChange('occupation', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Income Slab</label>
              <select
                value={formData.annualIncomeSlab}
                onChange={(e) => handleFieldChange('annualIncomeSlab', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              >
                <option value="Below ₹10 Lakhs">Below ₹10 Lakhs</option>
                <option value="₹10 Lakhs to ₹25 Lakhs">₹10 Lakhs to ₹25 Lakhs</option>
                <option value="₹25 Lakhs to ₹50 Lakhs">₹25 Lakhs to ₹50 Lakhs</option>
                <option value="₹50 Lakhs to ₹1 Crore">₹50 Lakhs to ₹1 Crore</option>
                <option value="₹1 Crore to ₹5 Crores">₹1 Crore to ₹5 Crores</option>
                <option value="Above ₹5 Crores">Above ₹5 Crores</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Source of Wealth</label>
              <input
                type="text"
                value={formData.sourceOfWealth}
                onChange={(e) => handleFieldChange('sourceOfWealth', e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION A2: DECLARATIONS */}
      {activeSubTab === 'A2' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mandatory AML & Regulatory Declarations
          </div>

          {/* PEP Declaration */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Politically Exposed Person (PEP) Declaration
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Are you, or any immediate family member, a Politically Exposed Person (holding public office, judiciary, military, senior govt position)?
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                'No',
                'Yes - Politically Exposed',
                'Yes - Related to PEP',
              ].map((val) => (
                <label key={val} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="pepDeclaration"
                    value={val}
                    checked={formData.pepDeclaration === val}
                    onChange={() => handleFieldChange('pepDeclaration', val)}
                    className="text-blue-600"
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
            {formData.pepDeclaration !== 'No' && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                ⚠️ Declaring PEP status triggers Enhanced Due Diligence (EDD) and High-Risk AML compliance review.
              </div>
            )}
          </div>

          {/* FATCA / CRS */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                FATCA & Common Reporting Standard (CRS) Declaration
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Confirm your tax residency status.
              </p>
            </div>
            <div className="space-y-2">
              <label className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="fatcaDeclaration"
                  value="Tax Resident of India Only"
                  checked={formData.fatcaDeclaration === 'Tax Resident of India Only'}
                  onChange={() => handleFieldChange('fatcaDeclaration', 'Tax Resident of India Only')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-slate-900">Tax Resident of India Only</div>
                  <div className="text-slate-500 text-[11px]">I am not a tax resident of any other jurisdiction, nor a US citizen/Green Card holder.</div>
                </div>
              </label>

              <label className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="radio"
                  name="fatcaDeclaration"
                  value="Tax Resident of Other Countries"
                  checked={formData.fatcaDeclaration === 'Tax Resident of Other Countries'}
                  onChange={() => handleFieldChange('fatcaDeclaration', 'Tax Resident of Other Countries')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-semibold text-slate-900">Tax Resident of Other Countries / US Person</div>
                  <div className="text-slate-500 text-[11px]">Requires FATCA self-certification form and Tax Identification Number (TIN).</div>
                </div>
              </label>
            </div>
          </div>

          {/* Central Registries status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-xs font-bold text-slate-700">CKYC Central Registry Status</div>
              <div className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {formData.ckycStatus}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated lookup across CERSAI CKYCR</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-xs font-bold text-slate-700">SEBI KRA Status</div>
              <div className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {formData.kraStatus}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">NDML / CVL / Karvy KRA verification</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION A3: BANK & NOMINEES */}
      {activeSubTab === 'A3' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bank Mandates & Nominee Protection
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Verified Bank Accounts
              </h3>
            </div>
          </div>

          {/* Bank Accounts */}
          <div className="space-y-3">
            {investor.bankAccounts.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-blue-600 shadow-2xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{b.bankName}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                        {b.accountNumberMasked}
                      </span>
                      {b.isPrimary && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          Primary Mandate
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Holder: {b.accountHolderName} • IFSC: {b.ifscCode} • {b.accountType} Account
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Penny Drop Verified
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Nominees */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Registered Nominees</h3>
            {investor.nominees.length > 0 ? (
              investor.nominees.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{n.name}</span>
                      <span className="text-[11px] text-slate-500">({n.relationship})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      DOB: {n.dateOfBirth} • Allocation Share: <strong>{n.sharePercentage}%</strong>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active Nominee
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-50 border border-slate-200">
                No individual nominees recorded (Entity / Non-Individual mode).
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION DOCS: DOCUMENT UPLOADS */}
      {activeSubTab === 'Docs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Document Repository
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Officially Valid Documents (OVD) & Verification Status
              </h3>
            </div>
            <button
              type="button"
              onClick={() => alert('Simulated document upload: File encrypted and uploaded to secure vault.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Document
            </button>
          </div>

          <div className="space-y-3">
            {investor.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-blue-600 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{doc.documentType}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {doc.fileName} ({doc.fileSize}) • Uploaded {doc.uploadDate}
                    </div>
                    {doc.remarks && (
                      <div className="text-[11px] text-amber-700 font-medium mt-1">
                        Review Remarks: {doc.remarks}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge type="kyc" value={doc.status} />
                  <button
                    type="button"
                    onClick={() => alert(`Viewing masked document: ${doc.fileName}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
        >
          Save Progress
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
        >
          <span>Continue to Financial Profile</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
