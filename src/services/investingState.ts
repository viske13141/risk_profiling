/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Investor, InvestmentRiskProfile, KYCStatus, CRMPipelineStage } from '../types/investor';
import { calculateRiskProfile } from '../utils/riskCalculation';

export const INITIAL_INVESTORS: Investor[] = [
  {
    id: 'INV-2026-001',
    leadId: 'LEAD-901',
    name: 'Vikramaditya Singhania',
    email: 'vikram.singhania@apexindustries.in',
    phone: '+91 98201 44521',
    investorCategory: 'Individual',
    registrationDate: '2026-10-12',
    onboardingProgress: 88,
    currentStage: 'Suitability Review',
    kycStatus: 'Verified',
    amlClassification: 'Low',
    kycData: {
      investorCategory: 'Individual',
      legalFullName: 'Vikramaditya Singhania',
      dateOfBirth: '1984-06-15',
      gender: 'Male',
      panNumberMasked: 'ABCPS****F',
      aadhaarMasked: 'XXXXXXXX7812',
      parentSpouseName: 'Rajendra Singhania',
      maritalStatus: 'Married',
      nationality: 'Indian',
      residentialStatus: 'Resident Individual',
      mobileNumber: '+91 98201 44521',
      isMobileOtpVerified: true,
      emailAddress: 'vikram.singhania@apexindustries.in',
      isEmailVerified: true,
      correspondenceAddress: 'Flat 1402, Tower B, Sea Face Enclave, Worli, Mumbai 400018',
      permanentAddress: 'Flat 1402, Tower B, Sea Face Enclave, Worli, Mumbai 400018',
      occupation: 'Senior Corporate Executive / CXO',
      annualIncomeSlab: '₹1 Crore to ₹5 Crores',
      sourceOfWealth: 'Employment Remuneration & ESOPs',
      pepDeclaration: 'No',
      fatcaDeclaration: 'Tax Resident of India Only',
      countryOfBirth: 'India',
      beneficialOwnershipDeclared: true,
      kraStatus: 'Verified (NDML)',
      ckycStatus: 'KYC Verified',
    },
    financialProfile: {
      dependents: '2 to 3 dependents',
      netWorth: '₹5 Crores to ₹15 Crores',
      monthlyInvestmentComfort: '₹1,50,000 to ₹5,00,000 per month',
      lumpSumCapacity: '₹50 Lakhs to ₹2 Crores',
      existingPortfolio: [
        'Mutual Funds & Direct Equities',
        'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
        'Real Estate (Land, Commercial, Residential beyond primary home)',
      ],
      existingDebtEmi: 'Up to 20% of monthly income',
      insuranceCoverage: ['Both Comprehensive Term Life & Family Health Insurance'],
      anticipatedChanges: 'No major changes; steady predictable cashflows anticipated',
      neededWithin12Months: 'No',
    },
    investmentGoals: [
      {
        id: 'GOAL-1',
        category: 'Retirement',
        description: 'Target financial independence corpus by age 52',
        targetAmount: 150000000,
        targetYear: 2036,
        priority: 'High',
        investmentApproach: 'Both',
        monthlyContribution: 250000,
      },
      {
        id: 'GOAL-2',
        category: 'Education',
        description: 'Overseas University education fund for daughter',
        targetAmount: 25000000,
        targetYear: 2031,
        priority: 'High',
        investmentApproach: 'SIP',
        monthlyContribution: 150000,
      },
    ],
    riskAnswers: {
      D1: 3, // 41-50 yrs -> 4
      D2: 4, // >7 yrs -> 5
      D3: 3, // Stable -> 4
      D4: 3, // 10-25% -> 4
      D5: 4, // >6 months -> 5
      D6: 3, // 36-50% -> 4
      D7: 3, // Good -> 4
      D8: 3, // Wealth creation -> 4
      D9: 3, // Up to 20% -> 4
      D10: 3, // Hold calm -> 4
      D11: 3, // High return -> 4
      D12: 3, // Growth -> 4
    },
    bankAccounts: [
      {
        id: 'BANK-1',
        accountHolderName: 'Vikramaditya Singhania',
        bankName: 'HDFC Bank Ltd',
        accountNumberMasked: 'XXXXXXXXXX5671',
        ifscCode: 'HDFC0000060',
        accountType: 'Savings',
        verificationStatus: 'Verified',
        pennyDropStatus: 'Success',
        isPrimary: true,
      },
    ],
    nominees: [
      {
        id: 'NOM-1',
        name: 'Ananya Singhania',
        relationship: 'Spouse',
        dateOfBirth: '1987-11-20',
        sharePercentage: 100,
        isMinor: false,
        contactNumber: '+91 98201 44522',
      },
    ],
    documents: [
      {
        id: 'DOC-1',
        documentType: 'PAN Card',
        fileName: 'PAN_VSinghania_Masked.pdf',
        uploadDate: '2026-10-12',
        status: 'Verified',
        fileSize: '1.2 MB',
      },
      {
        id: 'DOC-2',
        documentType: 'Aadhaar Card',
        fileName: 'Aadhaar_Offline_XML.xml',
        uploadDate: '2026-10-12',
        status: 'Verified',
        fileSize: '840 KB',
      },
      {
        id: 'DOC-3',
        documentType: 'Bank Proof',
        fileName: 'Cancelled_Cheque_HDFC.pdf',
        uploadDate: '2026-10-12',
        status: 'Verified',
        fileSize: '2.1 MB',
      },
    ],
    consentGiven: true,
    consentTimestamp: '2026-10-14 11:32:00',
    eSignStatus: 'Completed',
    directPlanPreference: 'Direct',
    suitabilityReviewed: false,
    suitabilityDecision: 'Pending Review',
    assignedAdviser: 'Rohit Kulkarni, CFA',
    assignedSalesAgent: 'Pooja Sharma',
    crmStage: 'Consent Pending',
    leadSource: 'Private Wealth Referral',
    priority: 'High',
    lastActivity: 'Submitted risk questionnaire and completed consent signature',
    notes: [
      {
        id: 'N-1',
        author: 'Rohit Kulkarni',
        text: 'Client has strong net worth and solid investment knowledge. Target asset allocation 70% Equity / 30% Fixed Income.',
        date: '2026-10-13',
      },
    ],
    auditLogs: [
      {
        id: 'A-1',
        action: 'KYC Approved',
        performedBy: 'Compliance Admin (K. Menon)',
        timestamp: '2026-10-13 14:10:00',
        details: 'CKYC & KRA NDML records match identity. Bank penny drop successful.',
      },
      {
        id: 'A-2',
        action: 'Risk Assessment Submitted',
        performedBy: 'Customer',
        timestamp: '2026-10-14 11:30:00',
        details: 'All 12 scored questions answered. Profile calculated as Moderately Aggressive.',
      },
    ],
  },
  {
    id: 'INV-2026-002',
    leadId: 'LEAD-902',
    name: 'Dr. Meenakshi Sundaram',
    email: 'dr.meenakshi@chennaicardiocare.org',
    phone: '+91 94440 12890',
    investorCategory: 'Individual',
    registrationDate: '2026-10-20',
    onboardingProgress: 45,
    currentStage: 'Identity KYC',
    kycStatus: 'Additional Information Required',
    amlClassification: 'Medium',
    kycData: {
      investorCategory: 'Individual',
      legalFullName: 'Dr. Meenakshi Sundaram',
      dateOfBirth: '1976-03-24',
      gender: 'Female',
      panNumberMasked: 'AFKPS****D',
      aadhaarMasked: 'XXXXXXXX4419',
      parentSpouseName: 'S. Sundaram',
      maritalStatus: 'Married',
      nationality: 'Indian',
      residentialStatus: 'Resident Individual',
      mobileNumber: '+91 94440 12890',
      isMobileOtpVerified: true,
      emailAddress: 'dr.meenakshi@chennaicardiocare.org',
      isEmailVerified: true,
      correspondenceAddress: 'No 45, Poes Garden, Chennai 600086',
      permanentAddress: 'No 45, Poes Garden, Chennai 600086',
      occupation: 'Medical Consultant / Doctor',
      annualIncomeSlab: '₹50 Lakhs to ₹1 Crore',
      sourceOfWealth: 'Professional Practice',
      pepDeclaration: 'No',
      fatcaDeclaration: 'Tax Resident of India Only',
      countryOfBirth: 'India',
      beneficialOwnershipDeclared: true,
      kraStatus: 'Under Process',
      ckycStatus: 'Pending Download',
    },
    financialProfile: {
      dependents: '1 dependent',
      netWorth: '₹1 Crore to ₹5 Crores',
      monthlyInvestmentComfort: '₹50,000 to ₹1,50,000 per month',
      lumpSumCapacity: '₹10 Lakhs to ₹50 Lakhs',
      existingPortfolio: [
        'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
        'Gold, Sovereign Gold Bonds & Precious Metals',
      ],
      existingDebtEmi: '21% to 40% of monthly income',
      insuranceCoverage: ['Both Comprehensive Term Life & Family Health Insurance'],
      anticipatedChanges: 'No major changes; steady predictable cashflows anticipated',
      neededWithin12Months: 'No',
    },
    investmentGoals: [
      {
        id: 'GOAL-3',
        category: 'Wealth Creation',
        description: 'Diversified long-term equity mutual fund portfolio',
        targetAmount: 50000000,
        targetYear: 2034,
        priority: 'High',
        investmentApproach: 'SIP',
        monthlyContribution: 100000,
      },
    ],
    riskAnswers: {
      D1: 2, // 41-50
      D2: 2, // 3-5 yrs
      D3: 3, // Stable
      D4: 2, // 26-40%
      D5: 3, // 3-6 mos
      D6: 2, // 21-35%
      D7: 2, // Moderate
      D8: 2, // Balanced
      D9: 2, // Up to 10%
      D10: 2, // Hold anxiously
      D11: 2, // Moderate return
      D12: 2, // Balanced hybrid
    },
    bankAccounts: [
      {
        id: 'BANK-2',
        accountHolderName: 'Dr. Meenakshi Sundaram',
        bankName: 'State Bank of India',
        accountNumberMasked: 'XXXXXXXXXX9042',
        ifscCode: 'SBIN0000800',
        accountType: 'Savings',
        verificationStatus: 'Pending',
        pennyDropStatus: 'Pending',
        isPrimary: true,
      },
    ],
    nominees: [
      {
        id: 'NOM-2',
        name: 'Karthik Sundaram',
        relationship: 'Son',
        dateOfBirth: '2008-04-12',
        sharePercentage: 100,
        isMinor: true,
        guardianName: 'Dr. Meenakshi Sundaram',
        contactNumber: '+91 94440 12890',
      },
    ],
    documents: [
      {
        id: 'DOC-4',
        documentType: 'PAN Card',
        fileName: 'PAN_MSundaram.pdf',
        uploadDate: '2026-10-20',
        status: 'Additional Information Required',
        remarks: 'Uploaded PAN scan has slight corner glare obscuring the date of birth; please re-upload clear color image.',
        fileSize: '950 KB',
      },
    ],
    consentGiven: false,
    eSignStatus: 'Not Signed',
    directPlanPreference: 'Regular',
    suitabilityReviewed: false,
    assignedAdviser: 'Arjun Nambiar',
    assignedSalesAgent: 'Ramesh Verma',
    crmStage: 'KYC Under Review',
    leadSource: 'Medical Association Webinar',
    priority: 'Medium',
    lastActivity: 'Compliance Admin requested clear PAN scan',
    notes: [
      {
        id: 'N-2',
        author: 'Ramesh Verma',
        text: 'Followed up via phone on re-uploading PAN document. Client promised to upload this evening.',
        date: '2026-10-22',
      },
    ],
    auditLogs: [
      {
        id: 'A-3',
        action: 'Document Clarification Requested',
        performedBy: 'Compliance Admin (P. Iyer)',
        timestamp: '2026-10-21 16:45:00',
        details: 'PAN document flagged for glare. Notification sent to customer and Sales.',
      },
    ],
  },
  {
    id: 'INV-2026-003',
    leadId: 'LEAD-903',
    name: 'Aarav Builders & Developers LLP',
    email: 'partners@aaravbuilders.co.in',
    phone: '+91 97110 99402',
    investorCategory: 'Partnership',
    registrationDate: '2026-10-25',
    onboardingProgress: 25,
    currentStage: 'Identity KYC',
    kycStatus: 'Submitted',
    amlClassification: 'High',
    kycData: {
      investorCategory: 'Partnership',
      legalFullName: 'Aarav Builders & Developers LLP',
      dateOfBirth: '2018-09-01',
      gender: 'Other',
      panNumberMasked: 'AAHFA****K',
      aadhaarMasked: 'XXXXXXXX0000',
      parentSpouseName: 'N/A (Entity)',
      maritalStatus: 'Other',
      nationality: 'Indian Entity',
      residentialStatus: 'Resident Individual',
      mobileNumber: '+91 97110 99402',
      isMobileOtpVerified: true,
      emailAddress: 'partners@aaravbuilders.co.in',
      isEmailVerified: true,
      correspondenceAddress: 'Suite 501, Business Park, Sector 44, Gurugram 122003',
      permanentAddress: 'Suite 501, Business Park, Sector 44, Gurugram 122003',
      occupation: 'Real Estate & Infrastructure Development',
      annualIncomeSlab: 'Above ₹5 Crores',
      sourceOfWealth: 'Commercial Operations & Construction',
      pepDeclaration: 'Yes - Related to PEP',
      fatcaDeclaration: 'Tax Resident of India Only',
      countryOfBirth: 'India',
      beneficialOwnershipDeclared: true,
      kraStatus: 'Under Process',
      ckycStatus: 'Pending Download',
    },
    financialProfile: {
      dependents: 'No dependents (Self-supporting only)',
      netWorth: 'Above ₹15 Crores',
      monthlyInvestmentComfort: 'Above ₹5,00,000 per month',
      lumpSumCapacity: 'Above ₹2 Crores',
      existingPortfolio: [
        'Real Estate (Land, Commercial, Residential beyond primary home)',
        'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
      ],
      existingDebtEmi: '41% to 60% of monthly income',
      insuranceCoverage: ['Employer-provided group cover only'],
      anticipatedChanges: 'Expecting planned major expense (child education, marriage, home purchase)',
      neededWithin12Months: 'Yes',
      neededAmount: '₹50 Lakhs for project milestone',
    },
    investmentGoals: [
      {
        id: 'GOAL-4',
        category: 'Short-term Cash Parking',
        description: 'Treasury liquidity management in Ultra Short and Liquid Funds',
        targetAmount: 30000000,
        targetYear: 2027,
        priority: 'High',
        investmentApproach: 'Lump Sum',
      },
    ],
    riskAnswers: {
      D1: 4, // 18-30
      D2: 0, // <1 year -> Triggers O1!
      D3: 2, // Fluctuating
      D4: 1, // 41-60%
      D5: 2, // 1-3 mos
      D6: 3, // 36-50%
      D7: 2, // Moderate
      D8: 0, // Capital preservation
      D9: 0, // 0% tolerance
      D10: 0, // Panic
      D11: 0, // Low return
      D12: 0, // 100% fixed income
    },
    bankAccounts: [
      {
        id: 'BANK-3',
        accountHolderName: 'Aarav Builders & Developers LLP',
        bankName: 'ICICI Bank Ltd',
        accountNumberMasked: 'XXXXXXXXXX1104',
        ifscCode: 'ICIC0000104',
        accountType: 'Current',
        verificationStatus: 'Pending',
        pennyDropStatus: 'Success',
        isPrimary: true,
      },
    ],
    nominees: [],
    documents: [
      {
        id: 'DOC-5',
        documentType: 'Partnership Deed',
        fileName: 'Partnership_Deed_Registered.pdf',
        uploadDate: '2026-10-25',
        status: 'Under Review',
        fileSize: '4.5 MB',
      },
      {
        id: 'DOC-6',
        documentType: 'Board Resolution',
        fileName: 'Authorized_Signatory_Resolution.pdf',
        uploadDate: '2026-10-25',
        status: 'Under Review',
        fileSize: '1.8 MB',
      },
    ],
    consentGiven: false,
    eSignStatus: 'Not Signed',
    directPlanPreference: 'Direct',
    suitabilityReviewed: false,
    assignedAdviser: 'Sunil Rao',
    assignedSalesAgent: 'Pooja Sharma',
    crmStage: 'KYC Under Review',
    leadSource: 'Commercial Client Referral',
    priority: 'High',
    lastActivity: 'Submitted Partnership KYC documentation and PEP declaration',
    notes: [
      {
        id: 'N-3',
        author: 'Sunil Rao',
        text: 'High-risk AML case due to PEP relation declaration and entity structure. Enhanced Due Diligence (EDD) required.',
        date: '2026-10-26',
      },
    ],
    auditLogs: [
      {
        id: 'A-4',
        action: 'AML High-Risk Escalation',
        performedBy: 'Compliance Admin (K. Menon)',
        timestamp: '2026-10-26 10:15:00',
        details: 'Entity flagged as High Risk due to declared PEP relation. EDD initiated.',
      },
    ],
  },
  {
    id: 'INV-2026-004',
    leadId: 'LEAD-904',
    name: 'Sunita Kashyap',
    email: 'sunita.kashyap@gmail.com',
    phone: '+91 98112 33499',
    investorCategory: 'Individual',
    registrationDate: '2026-10-28',
    onboardingProgress: 100,
    currentStage: 'Completed',
    kycStatus: 'Verified',
    amlClassification: 'Low',
    kycData: {
      investorCategory: 'Individual',
      legalFullName: 'Sunita Kashyap',
      dateOfBirth: '1961-08-10', // Senior citizen > 60 yrs
      gender: 'Female',
      panNumberMasked: 'ABLPK****R',
      aadhaarMasked: 'XXXXXXXX9921',
      parentSpouseName: 'Harish Kashyap',
      maritalStatus: 'Married',
      nationality: 'Indian',
      residentialStatus: 'Resident Individual',
      mobileNumber: '+91 98112 33499',
      isMobileOtpVerified: true,
      emailAddress: 'sunita.kashyap@gmail.com',
      isEmailVerified: true,
      correspondenceAddress: 'B-44, Golf Links, New Delhi 110003',
      permanentAddress: 'B-44, Golf Links, New Delhi 110003',
      occupation: 'Retired Government Officer',
      annualIncomeSlab: '₹25 Lakhs to ₹50 Lakhs',
      sourceOfWealth: 'Retirement Pension & Provident Fund',
      pepDeclaration: 'No',
      fatcaDeclaration: 'Tax Resident of India Only',
      countryOfBirth: 'India',
      beneficialOwnershipDeclared: true,
      kraStatus: 'Verified (NDML)',
      ckycStatus: 'KYC Verified',
    },
    financialProfile: {
      dependents: 'No dependents (Self-supporting only)',
      netWorth: '₹5 Crores to ₹15 Crores',
      monthlyInvestmentComfort: '₹50,000 to ₹1,50,000 per month',
      lumpSumCapacity: '₹50 Lakhs to ₹2 Crores',
      existingPortfolio: [
        'EPF, PPF, NPS & Guaranteed Government Retirement Schemes',
        'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
        'Mutual Funds & Direct Equities',
      ],
      existingDebtEmi: 'Nil / No active debt obligations',
      insuranceCoverage: ['Both Comprehensive Term Life & Family Health Insurance'],
      anticipatedChanges: 'No major changes; steady predictable cashflows anticipated',
      neededWithin12Months: 'No',
      hasOver50PercentSavingsInvested: true,
    },
    investmentGoals: [
      {
        id: 'GOAL-5',
        category: 'Income',
        description: 'Regular monthly cashflow to supplement pension with capital safety',
        targetAmount: 30000000,
        targetYear: 2030,
        priority: 'High',
        investmentApproach: 'Lump Sum',
      },
    ],
    riskAnswers: {
      D1: 0, // Age > 60 (score 1) -> Triggers O6 if >50% savings invested
      D2: 2, // 3-5 yrs (score 3)
      D3: 4, // Pension (score 5)
      D4: 4, // 0 debt (score 5)
      D5: 4, // >6 mos (score 5)
      D6: 2, // 21-35% (score 3)
      D7: 2, // Moderate (score 3)
      D8: 1, // Regular income (score 2)
      D9: 1, // Up to 5% (score 2)
      D10: 2, // Hold anxiously (score 3)
      D11: 1, // Modest return (score 2)
      D12: 1, // Mostly debt (score 2)
    },
    bankAccounts: [
      {
        id: 'BANK-4',
        accountHolderName: 'Sunita Kashyap',
        bankName: 'Axis Bank Ltd',
        accountNumberMasked: 'XXXXXXXXXX7741',
        ifscCode: 'UTIB0000122',
        accountType: 'Savings',
        verificationStatus: 'Verified',
        pennyDropStatus: 'Success',
        isPrimary: true,
      },
    ],
    nominees: [
      {
        id: 'NOM-3',
        name: 'Harish Kashyap',
        relationship: 'Spouse',
        dateOfBirth: '1958-02-14',
        sharePercentage: 100,
        isMinor: false,
        contactNumber: '+91 98112 33490',
      },
    ],
    documents: [
      {
        id: 'DOC-7',
        documentType: 'PAN Card',
        fileName: 'PAN_SKashyap.pdf',
        uploadDate: '2026-10-28',
        status: 'Verified',
        fileSize: '1.1 MB',
      },
    ],
    consentGiven: true,
    consentTimestamp: '2026-10-29 15:40:00',
    eSignStatus: 'Completed',
    directPlanPreference: 'Regular',
    suitabilityReviewed: true,
    suitabilityDecision: 'Approved',
    suitabilityComments: 'Suitable for Conservative Hybrid / Debt Funds aligned with Level 2 profile.',
    assignedAdviser: 'Rohit Kulkarni, CFA',
    assignedSalesAgent: 'Ramesh Verma',
    crmStage: 'Onboarding Completed',
    leadSource: 'Senior Citizen Wealth Workshop',
    priority: 'Medium',
    lastActivity: 'Suitability Review approved by Rohit Kulkarni',
    notes: [
      {
        id: 'N-4',
        author: 'Rohit Kulkarni',
        text: 'Client is 65 years old. Overrides O6 checked. Profile confirmed as Moderately Conservative (Level 2).',
        date: '2026-10-29',
      },
    ],
    auditLogs: [
      {
        id: 'A-5',
        action: 'Onboarding Completed',
        performedBy: 'System',
        timestamp: '2026-10-29 16:00:00',
        details: 'Full investor onboarding completed with verified KYC, risk profile, consent, and suitability sign-off.',
      },
    ],
  },
];

// Initialize risk result on each investor
INITIAL_INVESTORS.forEach((inv) => {
  inv.riskResult = calculateRiskProfile(inv.riskAnswers, inv.financialProfile);
});

// Centralized reactive state store
class InvestingStore {
  private investors: Investor[] = [...INITIAL_INVESTORS];
  private activeInvestorId: string = INITIAL_INVESTORS[0].id;
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getInvestors(): Investor[] {
    return this.investors;
  }

  public getActiveInvestor(): Investor {
    return this.investors.find((i) => i.id === this.activeInvestorId) || this.investors[0];
  }

  public setActiveInvestorId(id: string) {
    this.activeInvestorId = id;
    this.notify();
  }

  public updateInvestor(id: string, updates: Partial<Investor>) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== id) return inv;
      const updated = { ...inv, ...updates };
      // Recalculate risk if answers or financial profile changed
      if (updates.riskAnswers || updates.financialProfile) {
        updated.riskResult = calculateRiskProfile(
          updated.riskAnswers,
          updated.financialProfile,
          updated.riskResult?.adviserAdjustment
        );
      }
      return updated;
    });
    this.notify();
  }

  public updateKYCStatus(
    id: string,
    status: KYCStatus,
    adminRemarks?: string,
    performedBy = 'Compliance Admin'
  ) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== id) return inv;
      const log = {
        id: `A-${Date.now()}`,
        action: `KYC Status changed to ${status}`,
        performedBy,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: adminRemarks || `KYC updated by ${performedBy}`,
      };
      let crmStage: CRMPipelineStage = inv.crmStage;
      if (status === 'Verified') {
        crmStage = 'Financial Profile Pending';
      } else if (status === 'Additional Information Required' || status === 'Under Review') {
        crmStage = 'KYC Under Review';
      }

      return {
        ...inv,
        kycStatus: status,
        crmStage,
        lastActivity: `KYC updated to ${status} by ${performedBy}`,
        auditLogs: [log, ...inv.auditLogs],
      };
    });
    this.notify();
  }

  public updateAMLClassification(
    id: string,
    classification: 'Low' | 'Medium' | 'High',
    notes?: string,
    performedBy = 'Compliance Officer'
  ) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== id) return inv;
      const log = {
        id: `A-${Date.now()}`,
        action: `AML classification updated to ${classification}`,
        performedBy,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: notes || `AML review conducted`,
      };
      return {
        ...inv,
        amlClassification: classification,
        lastActivity: `AML classification updated to ${classification}`,
        auditLogs: [log, ...inv.auditLogs],
      };
    });
    this.notify();
  }

  public submitSuitabilityDecision(
    id: string,
    decision: 'Approved' | 'Flagged for Consultation',
    comments: string,
    adviserName = 'Rohit Kulkarni, CFA'
  ) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== id) return inv;
      const log = {
        id: `A-${Date.now()}`,
        action: `Suitability Review: ${decision}`,
        performedBy: adviserName,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: comments,
      };
      return {
        ...inv,
        suitabilityReviewed: true,
        suitabilityDecision: decision,
        suitabilityComments: comments,
        onboardingProgress: decision === 'Approved' ? 100 : inv.onboardingProgress,
        currentStage: decision === 'Approved' ? 'Completed' : inv.currentStage,
        crmStage: decision === 'Approved' ? 'Onboarding Completed' : inv.crmStage,
        lastActivity: `Suitability review marked as ${decision}`,
        auditLogs: [log, ...inv.auditLogs],
      };
    });
    this.notify();
  }

  public applyAdviserRiskOverride(
    id: string,
    targetProfile: InvestmentRiskProfile,
    reason: string,
    adviserName = 'Rohit Kulkarni, CFA'
  ) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== id) return inv;
      const recalculated = calculateRiskProfile(inv.riskAnswers, inv.financialProfile, {
        adjustedProfile: targetProfile,
        reason,
        adviserName,
      });
      const log = {
        id: `A-${Date.now()}`,
        action: `Adviser lowered risk profile to ${targetProfile}`,
        performedBy: adviserName,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: `Reason: ${reason}`,
      };
      return {
        ...inv,
        riskResult: recalculated,
        lastActivity: `Adviser lowered risk profile to ${targetProfile}`,
        auditLogs: [log, ...inv.auditLogs],
      };
    });
    this.notify();
  }

  public updateCRMPipelineStage(id: string, newStage: CRMPipelineStage) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== id) return inv;
      return {
        ...inv,
        crmStage: newStage,
        lastActivity: `Moved to pipeline stage: ${newStage}`,
      };
    });
    this.notify();
  }

  public addActivityOrTask(
    investorId: string,
    type: 'Note' | 'Call' | 'Meeting' | 'FollowUp',
    text: string,
    author: string,
    dueDate?: string
  ) {
    this.investors = this.investors.map((inv) => {
      if (inv.id !== investorId) return inv;
      const noteItem = {
        id: `N-${Date.now()}`,
        author: `${author} (${type})`,
        text: dueDate ? `${text} [Due: ${dueDate}]` : text,
        date: new Date().toISOString().split('T')[0],
      };
      return {
        ...inv,
        nextFollowUpDate: dueDate || inv.nextFollowUpDate,
        lastActivity: `${type} recorded by ${author}`,
        notes: [noteItem, ...inv.notes],
      };
    });
    this.notify();
  }
}

export const investingStore = new InvestingStore();
