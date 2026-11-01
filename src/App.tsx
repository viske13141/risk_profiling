/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Role,
  Investor,
  KYCStatus,
  AMLClassification,
  InvestmentRiskProfile,
  CRMPipelineStage,
  FinancialProfileAnswers,
  InvestmentGoal,
} from './types/investor';
import { investingStore } from './services/investingState';

// Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Customer Views
import { CustomerOverview } from './components/customer/CustomerOverview';
import { KYCView } from './components/customer/KYCView';
import { FinancialProfileView } from './components/customer/FinancialProfileView';
import { InvestmentGoalsView } from './components/customer/InvestmentGoalsView';
import { RiskAssessmentView } from './components/customer/RiskAssessmentView';
import { MyRiskProfileView } from './components/customer/MyRiskProfileView';
import { ConsentView } from './components/customer/ConsentView';
import { InvestmentSuitabilityView } from './components/customer/InvestmentSuitabilityView';

// Admin Views
import { AdminOverview } from './components/admin/AdminOverview';
import { InvestorManagementView } from './components/admin/InvestorManagementView';
import { AMLComplianceWorkspace } from './components/admin/AMLComplianceWorkspace';
import { RiskOversightWorkspace } from './components/admin/RiskOversightWorkspace';
import { SuitabilityReviewWorkspace } from './components/admin/SuitabilityReviewWorkspace';
import { RiskEngineVerificationView } from './components/admin/RiskEngineVerificationView';

// CRM Views
import { CRMDashboardView } from './components/crm/CRMDashboardView';

// Sales Views
import { SalesDashboardView } from './components/sales/SalesDashboardView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<Role>('customer');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Reactive store state
  const [investors, setInvestors] = useState<Investor[]>(investingStore.getInvestors());
  const [activeInvestor, setActiveInvestor] = useState<Investor>(investingStore.getActiveInvestor());

  useEffect(() => {
    const unsubscribe = investingStore.subscribe(() => {
      setInvestors([...investingStore.getInvestors()]);
      setActiveInvestor({ ...investingStore.getActiveInvestor() });
    });
    return unsubscribe;
  }, []);

  // When role changes, switch to sensible default tab
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    if (role === 'customer') {
      setActiveTab('overview');
    } else if (role === 'admin') {
      setActiveTab('admin-overview');
    } else if (role === 'crm') {
      setActiveTab('crm-dashboard');
    } else if (role === 'sales') {
      setActiveTab('sales-overview');
    }
  };

  const handleInvestorChange = (id: string) => {
    investingStore.setActiveInvestorId(id);
    setActiveInvestor(investingStore.getActiveInvestor());
  };

  // ==========================================
  // CUSTOMER ACTIONS
  // ==========================================
  const handleSaveRiskAnswers = (answers: Record<string, number>) => {
    investingStore.updateInvestor(activeInvestor.id, {
      riskAnswers: answers,
      onboardingProgress: Math.max(activeInvestor.onboardingProgress, 75),
      currentStage: 'Risk Calculation',
      crmStage: 'Consent Pending',
    });
    setActiveTab('my-risk-profile');
  };

  const handleSaveFinancialProfile = (finData: FinancialProfileAnswers) => {
    investingStore.updateInvestor(activeInvestor.id, {
      financialProfile: finData,
      onboardingProgress: Math.max(activeInvestor.onboardingProgress, 50),
      currentStage: 'Investment Goals',
    });
  };

  const handleSaveInvestmentGoals = (
    goals: InvestmentGoal[],
    pref: { directPlan: 'Direct' | 'Regular' }
  ) => {
    investingStore.updateInvestor(activeInvestor.id, {
      investmentGoals: goals,
      directPlanPreference: pref.directPlan,
      onboardingProgress: Math.max(activeInvestor.onboardingProgress, 65),
      currentStage: 'Risk Assessment',
    });
  };

  const handleUpdateKYC = (updatedKYC: any, newStatus?: KYCStatus) => {
    investingStore.updateInvestor(activeInvestor.id, {
      kycData: { ...activeInvestor.kycData, ...updatedKYC },
      kycStatus: newStatus || activeInvestor.kycStatus,
      onboardingProgress: Math.max(activeInvestor.onboardingProgress, 35),
      currentStage: 'Financial Profile',
    });
  };

  const handleSignConsent = () => {
    investingStore.updateInvestor(activeInvestor.id, {
      consentGiven: true,
      consentTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eSignStatus: 'Completed',
      onboardingProgress: 90,
      currentStage: 'Suitability Review',
      crmStage: 'Consent Pending',
    });
  };

  const handleCompleteOnboarding = () => {
    setActiveTab('suitability');
  };

  // ==========================================
  // ADMIN ACTIONS
  // ==========================================
  const handleAdminKYCUpdate = (id: string, status: KYCStatus, remarks?: string) => {
    investingStore.updateKYCStatus(id, status, remarks);
  };

  const handleAdminAMLUpdate = (id: string, aml: AMLClassification, notes?: string) => {
    investingStore.updateAMLClassification(id, aml, notes);
  };

  const handleAdminRiskOverride = (
    id: string,
    target: InvestmentRiskProfile,
    reason: string
  ) => {
    investingStore.applyAdviserRiskOverride(id, target, reason);
  };

  const handleAdminSuitabilityDecision = (
    id: string,
    decision: 'Approved' | 'Flagged for Consultation',
    comments: string
  ) => {
    investingStore.submitSuitabilityDecision(id, decision, comments);
  };

  // ==========================================
  // CRM & SALES ACTIONS
  // ==========================================
  const handleCRMMoveStage = (id: string, newStage: CRMPipelineStage) => {
    investingStore.updateCRMPipelineStage(id, newStage);
  };

  const handleAddActivity = (
    id: string,
    type: any,
    text: string,
    author: string,
    date?: string
  ) => {
    investingStore.addActivityOrTask(id, type, text, author, date);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Universal Top Header with Role Switcher & Persona Selector */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        investors={investors}
        activeInvestor={activeInvestor}
        onInvestorChange={handleInvestorChange}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-Specific Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* ==================================================== */}
          {/* CUSTOMER VIEWS */}
          {/* ==================================================== */}
          {currentRole === 'customer' && (
            <>
              {activeTab === 'overview' && (
                <CustomerOverview
                  investor={activeInvestor}
                  onNavigateTab={setActiveTab}
                  onContinueOnboarding={() => {
                    if (activeInvestor.currentStage === 'Identity KYC') setActiveTab('my-kyc');
                    else if (activeInvestor.currentStage === 'Financial Profile') setActiveTab('financial-profile');
                    else if (activeInvestor.currentStage === 'Investment Goals') setActiveTab('investment-goals');
                    else if (activeInvestor.currentStage === 'Risk Assessment') setActiveTab('risk-assessment');
                    else if (activeInvestor.currentStage === 'Risk Calculation') setActiveTab('my-risk-profile');
                    else if (activeInvestor.currentStage === 'Confirmation & Consent') setActiveTab('consent');
                    else setActiveTab('suitability');
                  }}
                />
              )}

              {activeTab === 'onboarding' && (
                <CustomerOverview
                  investor={activeInvestor}
                  onNavigateTab={setActiveTab}
                  onContinueOnboarding={() => setActiveTab('my-kyc')}
                />
              )}

              {activeTab === 'my-kyc' && (
                <KYCView
                  investor={activeInvestor}
                  onUpdateKYC={handleUpdateKYC}
                  onContinue={() => setActiveTab('financial-profile')}
                />
              )}

              {activeTab === 'financial-profile' && (
                <FinancialProfileView
                  investor={activeInvestor}
                  onSave={handleSaveFinancialProfile}
                  onContinue={() => setActiveTab('investment-goals')}
                />
              )}

              {activeTab === 'investment-goals' && (
                <InvestmentGoalsView
                  investor={activeInvestor}
                  onSaveGoals={handleSaveInvestmentGoals}
                  onContinue={() => setActiveTab('risk-assessment')}
                />
              )}

              {activeTab === 'risk-assessment' && (
                <RiskAssessmentView
                  investor={activeInvestor}
                  onSaveAnswers={handleSaveRiskAnswers}
                  onComplete={() => setActiveTab('my-risk-profile')}
                />
              )}

              {activeTab === 'my-risk-profile' && (
                <MyRiskProfileView
                  investor={activeInvestor}
                  onRetake={() => setActiveTab('risk-assessment')}
                  onProceedToConsent={() => setActiveTab('consent')}
                />
              )}

              {activeTab === 'documents' && (
                <KYCView
                  investor={activeInvestor}
                  onUpdateKYC={handleUpdateKYC}
                  onContinue={() => setActiveTab('my-risk-profile')}
                />
              )}

              {activeTab === 'bank-accounts' && (
                <KYCView
                  investor={activeInvestor}
                  onUpdateKYC={handleUpdateKYC}
                  onContinue={() => setActiveTab('my-risk-profile')}
                />
              )}

              {activeTab === 'nominees' && (
                <KYCView
                  investor={activeInvestor}
                  onUpdateKYC={handleUpdateKYC}
                  onContinue={() => setActiveTab('my-risk-profile')}
                />
              )}

              {activeTab === 'consent' && (
                <ConsentView
                  investor={activeInvestor}
                  onSignConsent={handleSignConsent}
                  onCompleteOnboarding={handleCompleteOnboarding}
                />
              )}

              {activeTab === 'suitability' && (
                <InvestmentSuitabilityView investor={activeInvestor} />
              )}

              {activeTab === 'notifications' && (
                <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Customer Alerts & Notifications</h2>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                      <strong>Onboarding Status:</strong> You are currently at step <strong>{activeInvestor.currentStage}</strong> with {activeInvestor.onboardingProgress}% completion.
                    </div>
                    {activeInvestor.kycStatus === 'Additional Information Required' && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                        <strong>Document Notification:</strong> Clearer PAN scan requested by compliance.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile-settings' && (
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
                  <h2 className="text-base font-bold text-slate-900">Investor Entity & Profile Configuration</h2>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div>Selected Category: <strong>{activeInvestor.investorCategory}</strong></div>
                    <div>Account Holder: <strong>{activeInvestor.name}</strong></div>
                    <div>Email: <strong>{activeInvestor.email}</strong></div>
                    <div>Mobile: <strong>{activeInvestor.phone}</strong></div>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    To alter registered entity categories (Individual, HUF, Company, Trust, Partnership), please initiate an authorized modification request.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ==================================================== */}
          {/* ADMIN VIEWS */}
          {/* ==================================================== */}
          {currentRole === 'admin' && (
            <>
              {activeTab === 'admin-overview' && (
                <AdminOverview
                  investors={investors}
                  onNavigateTab={setActiveTab}
                  onSelectInvestorForReview={(id) => {
                    handleInvestorChange(id);
                    setActiveTab('kyc-verification');
                  }}
                />
              )}

              {activeTab === 'investor-management' && (
                <InvestorManagementView
                  investors={investors}
                  selectedInvestorId={activeInvestor.id}
                  onSelectInvestor={handleInvestorChange}
                  onUpdateKYCStatus={handleAdminKYCUpdate}
                  onUpdateAML={handleAdminAMLUpdate}
                  onApplyRiskOverride={handleAdminRiskOverride}
                />
              )}

              {activeTab === 'kyc-verification' && (
                <InvestorManagementView
                  investors={investors}
                  selectedInvestorId={activeInvestor.id}
                  onSelectInvestor={handleInvestorChange}
                  onUpdateKYCStatus={handleAdminKYCUpdate}
                  onUpdateAML={handleAdminAMLUpdate}
                  onApplyRiskOverride={handleAdminRiskOverride}
                />
              )}

              {activeTab === 'aml-compliance' && (
                <AMLComplianceWorkspace
                  investors={investors}
                  onUpdateAML={handleAdminAMLUpdate}
                />
              )}

              {activeTab === 'risk-oversight' && (
                <RiskOversightWorkspace
                  investors={investors}
                  onApplyAdviserOverride={handleAdminRiskOverride}
                />
              )}

              {activeTab === 'adviser-overrides' && (
                <RiskOversightWorkspace
                  investors={investors}
                  onApplyAdviserOverride={handleAdminRiskOverride}
                />
              )}

              {activeTab === 'suitability-review' && (
                <SuitabilityReviewWorkspace
                  investors={investors}
                  onSubmitDecision={handleAdminSuitabilityDecision}
                />
              )}

              {activeTab === 'risk-engine-tests' && (
                <RiskEngineVerificationView />
              )}

              {activeTab === 'consent-management' && (
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
                  <h2 className="text-base font-bold text-slate-900">Consent & Declarations Audit Vault</h2>
                  <div className="space-y-2">
                    {investors.map((inv) => (
                      <div key={inv.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{inv.name} ({inv.id})</div>
                          <div className="text-slate-500 text-[11px]">
                            E-Sign Status: <strong>{inv.eSignStatus}</strong> • Preference: {inv.directPlanPreference} Plan
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${inv.consentGiven ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {inv.consentGiven ? 'Consent Verified' : 'Pending Sign'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reassessment-management' && (
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
                  <h2 className="text-base font-bold text-slate-900">Annual & Life-Event Reassessment Manager</h2>
                  <p className="text-slate-500">
                    Regulatory requirement: At least annual reassessment of risk capacity and willingness, and reassessment upon significant life events.
                  </p>
                  <div className="space-y-2">
                    {investors.map((inv) => (
                      <div key={inv.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{inv.name}</div>
                          <div className="text-slate-500 text-[11px]">
                            Last Assessed: {inv.riskResult?.assessmentDate || '2026-10-12'} • Next Review Due: {inv.riskResult?.nextReassessmentDate || '2027-10-12'}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Profile Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reports-analytics' && (
                <div className="space-y-4 max-w-5xl mx-auto">
                  <h2 className="text-base font-bold text-slate-900">Regulatory Compliance Reports & Exports</h2>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-800">SEBI Investor Onboarding & Risk Register Export (CSV/PDF)</div>
                      <div className="text-slate-500 text-xs">Simulated prototype export generation.</div>
                    </div>
                    <button
                      onClick={() => alert('Generated compliance report archive: SEBI_Risk_Profiling_Audit_Q4_2026.csv')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                    >
                      Export Audit Register
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'audit-logs' && (
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
                  <h2 className="text-base font-bold text-slate-900">System-Wide Compliance Audit Logs</h2>
                  <div className="space-y-2">
                    {investors.flatMap((i) => i.auditLogs).map((l, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{l.action}</span>
                          <span className="text-slate-400 font-normal">{l.timestamp}</span>
                        </div>
                        <p className="text-slate-600">{l.details}</p>
                        <div className="text-[10px] text-slate-400 italic">By: {l.performedBy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ==================================================== */}
          {/* CRM VIEWS */}
          {/* ==================================================== */}
          {currentRole === 'crm' && (
            <CRMDashboardView
              investors={investors}
              onMoveStage={handleCRMMoveStage}
              onOpenInvestor360={(id) => {
                handleInvestorChange(id);
                setCurrentRole('admin');
                setActiveTab('investor-management');
              }}
              onAddActivity={handleAddActivity}
            />
          )}

          {/* ==================================================== */}
          {/* SALES / DSA VIEWS */}
          {/* ==================================================== */}
          {currentRole === 'sales' && (
            <SalesDashboardView
              investors={investors}
              onOpenInvestorDetail={(id) => {
                handleInvestorChange(id);
                setActiveTab('tracker');
              }}
              onAddFollowUp={(id, text) => {
                handleAddActivity(id, 'Call', text, 'Sales Agent (Pooja Sharma)');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
