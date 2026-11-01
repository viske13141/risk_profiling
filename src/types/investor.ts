/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'customer' | 'admin' | 'crm' | 'sales';

export type InvestorCategory = 'Individual' | 'HUF' | 'Company' | 'Trust' | 'Partnership';

export type KYCStatus =
  | 'Not Started'
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Additional Information Required';

export type AMLClassification = 'Low' | 'Medium' | 'High';

export type InvestmentRiskProfile =
  | 'Conservative'
  | 'Moderately Conservative'
  | 'Moderate'
  | 'Moderately Aggressive'
  | 'Aggressive';

export type OnboardingStage =
  | 'Investor Details'
  | 'Identity KYC'
  | 'Financial Profile'
  | 'Investment Goals'
  | 'Risk Assessment'
  | 'Risk Calculation'
  | 'Confirmation & Consent'
  | 'Suitability Review'
  | 'Completed';

export type CRMPipelineStage =
  | 'New Investor Lead'
  | 'Contacted'
  | 'Interested'
  | 'Registration Pending'
  | 'KYC Pending'
  | 'KYC Under Review'
  | 'Financial Profile Pending'
  | 'Risk Profiling Pending'
  | 'Consent Pending'
  | 'Onboarding Completed'
  | 'Converted'
  | 'Dropped / Lost';

export interface BankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  accountType: 'Savings' | 'Current' | 'NRE' | 'NRO';
  verificationStatus: 'Verified' | 'Pending' | 'Failed';
  pennyDropStatus: 'Success' | 'Pending' | 'Failed';
  isPrimary: boolean;
}

export interface Nominee {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  sharePercentage: number;
  isMinor: boolean;
  guardianName?: string;
  contactNumber: string;
}

export interface UploadedDocument {
  id: string;
  documentType: 'PAN Card' | 'Aadhaar Card' | 'Bank Proof' | 'Photograph' | 'Address Proof' | 'Board Resolution' | 'Partnership Deed';
  fileName: string;
  uploadDate: string;
  status: 'Verified' | 'Under Review' | 'Rejected' | 'Additional Information Required';
  remarks?: string;
  fileSize: string;
}

export interface InvestmentGoal {
  id: string;
  category:
    | 'Retirement'
    | 'Education'
    | 'Marriage'
    | 'Home / Vehicle'
    | 'Wealth Creation'
    | 'Income'
    | 'Tax Saving'
    | 'Short-term Cash Parking';
  description: string;
  targetAmount: number;
  targetYear: number;
  priority: 'High' | 'Medium' | 'Low';
  investmentApproach: 'SIP' | 'Lump Sum' | 'Both';
  monthlyContribution?: number;
}

export interface RiskAssessmentAnswer {
  questionId: string;
  selectedOptionIndex: number; // 0 to 4
  score: number; // 1 to 5
}

export interface ConsistencyCheckResult {
  code: 'C1' | 'C2' | 'C3' | 'C4';
  title: string;
  description: string;
  severity: 'Warning' | 'Clarification Required';
  isTriggered: boolean;
  details?: string;
}

export interface RiskCalculationResult {
  capacityScore: number; // 6 to 30
  willingnessScore: number; // 6 to 30
  combinedScore: number; // 12 to 60 (for reporting only)
  capacityLevel: number; // 1 to 5
  willingnessLevel: number; // 1 to 5
  capacityCategory: InvestmentRiskProfile;
  willingnessCategory: InvestmentRiskProfile;
  baseProfile: InvestmentRiskProfile;
  finalProfile: InvestmentRiskProfile;
  appliedOverrides: {
    code: string;
    title: string;
    description: string;
    impact: string;
    requiresBusinessApproval?: boolean;
    requiresClarification?: boolean;
    isUnevaluated?: boolean;
    status?: 'Applied' | 'Unevaluated' | 'Pending Policy Approval';
    withdrawalAmount?: string;
    evidenceNotes?: string;
  }[];
  isInconsistent: boolean;
  inconsistencyMessage?: string;
  consistencyChecks?: ConsistencyCheckResult[];
  isMissingAnswer: boolean;
  missingQuestionIds: string[];
  adviserAdjustment?: {
    originalProfile: InvestmentRiskProfile;
    adjustedProfile: InvestmentRiskProfile;
    reason: string;
    adviserName: string;
    timestamp: string;
  };
  assessmentDate: string;
  nextReassessmentDate: string;
  reassessmentStatus: 'Valid' | 'Due Soon' | 'Overdue';
}

export interface FinancialProfileAnswers {
  dependents: number | string; // B1: Numeric input for number of dependents
  netWorth: string; // B2: The five specified net-worth slabs
  monthlyInvestmentAmount?: number | string; // B3: Monthly investment amount in INR
  monthlyInvestmentComfort?: string; // backwards compatibility
  lumpSumAmount?: number | string; // B4: Lump-sum amount in INR or 'No'
  hasLumpSum?: boolean; // B4: Lump-sum available or No
  lumpSumCapacity?: string; // backwards compatibility
  existingPortfolio: string[]; // B5: Multi-select existing asset categories
  assetPercentages?: Record<string, number>; // B5: with approximate percentage of total savings captured
  hasOutstandingLoans?: boolean; // B6: Yes/No outstanding loans
  monthlyEmiAmount?: number | string; // B6: total monthly EMI amount
  existingDebtEmi?: string; // backwards compatibility
  insuranceStatus?: 'Term life' | 'Health' | 'Both' | 'Neither'; // B7: Term life / Health / Both / Neither
  insuranceCoverage?: string[]; // backwards compatibility
  hasAnticipatedChanges?: boolean; // B8: Yes with description / No
  anticipatedChangesDescription?: string; // B8 description
  anticipatedChanges?: string; // backwards compatibility
  neededWithin12Months: 'Yes' | 'No' | 'Unsure'; // B9: Yes / No for possibility of withdrawing most of money within 12 months
  neededAmount?: string; // B9 withdrawal amount if Yes
  b9SelectedOption?: string;
  hasOver50PercentSavingsInvested?: boolean; // Reconciled from B5 asset percentages & D6
}

export interface KYCData {
  investorCategory: InvestorCategory;
  legalFullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  panNumberMasked: string;
  aadhaarMasked: string;
  parentSpouseName: string;
  maritalStatus: 'Single' | 'Married' | 'Other';
  nationality: string;
  residentialStatus: 'Resident Individual' | 'Non-Resident Indian (NRI)' | 'Person of Indian Origin (PIO)';
  mobileNumber: string;
  isMobileOtpVerified: boolean;
  emailAddress: string;
  isEmailVerified: boolean;
  correspondenceAddress: string;
  permanentAddress: string;
  occupation: string;
  annualIncomeSlab: string;
  sourceOfWealth: string;
  pepDeclaration: 'No' | 'Yes - Politically Exposed' | 'Yes - Related to PEP';
  fatcaDeclaration: 'Tax Resident of India Only' | 'Tax Resident of Other Countries';
  countryOfBirth: string;
  beneficialOwnershipDeclared: boolean;
  kraStatus: 'Verified (NDML)' | 'Under Process' | 'Not Found';
  ckycStatus: 'KYC Verified' | 'Pending Download' | 'Exempt';
}

export interface Investor {
  id: string;
  leadId: string;
  name: string;
  email: string;
  phone: string;
  investorCategory: InvestorCategory;
  registrationDate: string;
  onboardingProgress: number; // 0 to 100
  currentStage: OnboardingStage;
  kycStatus: KYCStatus;
  amlClassification: AMLClassification;
  kycData: KYCData;
  financialProfile: FinancialProfileAnswers;
  investmentGoals: InvestmentGoal[];
  riskAnswers: Record<string, number>; // questionId -> option index 0-4
  riskResult?: RiskCalculationResult;
  bankAccounts: BankAccount[];
  nominees: Nominee[];
  documents: UploadedDocument[];
  consentGiven: boolean;
  consentTimestamp?: string;
  eSignStatus: 'Not Signed' | 'Pending' | 'Completed';
  directPlanPreference: 'Direct' | 'Regular';
  suitabilityReviewed: boolean;
  suitabilityDecision?: 'Approved' | 'Flagged for Consultation' | 'Pending Review';
  suitabilityComments?: string;
  assignedAdviser: string;
  assignedSalesAgent: string;
  crmStage: CRMPipelineStage;
  leadSource: string;
  priority: 'High' | 'Medium' | 'Low';
  lastActivity: string;
  nextFollowUpDate?: string;
  notes: { id: string; author: string; text: string; date: string }[];
  auditLogs: { id: string; action: string; performedBy: string; timestamp: string; details: string }[];
}
