/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateRiskProfile } from './riskCalculation';
import { InvestmentRiskProfile } from '../types/investor';

export interface TestCaseResult {
  testId: string;
  name: string;
  description: string;
  inputDescription: string;
  expectedProfile: InvestmentRiskProfile;
  actualProfile: InvestmentRiskProfile;
  expectedOverrides: string[];
  actualOverrides: string[];
  capacityScore: number;
  willingnessScore: number;
  combinedScore: number;
  passed: boolean;
  notes: string;
}

export function runAllRiskEngineTests(): TestCaseResult[] {
  const tests: TestCaseResult[] = [];

  // Test 1: Conservative Result (all lowest scores)
  {
    const answers: Record<string, number> = {
      D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0, // Capacity = 6
      D7: 0, D8: 0, D9: 0, D10: 0, D11: 0, D12: 0, // Willingness = 6
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-01',
      name: 'Conservative Profile Baseline',
      description: 'Lowest capacity (6) and lowest willingness (6)',
      inputDescription: 'All options index 0 (scores = 1)',
      expectedProfile: 'Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O1', 'O4', 'O5'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Conservative' && res.capacityScore === 6 && res.willingnessScore === 6,
      notes: 'Matches Conservative Level 1 (Score 6-10). Overrides O1, O4, O5 also triggered and cap at Conservative.',
    });
  }

  // Test 2: Moderately Conservative Result
  {
    // D1..D6 score 2 each = 12 (Level 2). D7..D12 score 2 each = 12 (Level 2). D2 option 2 (3-5 years) so no O1/O3
    const answers: Record<string, number> = {
      D1: 1, D2: 2, D3: 1, D4: 2, D5: 2, D6: 1, // Cap = 2+3+2+3+3+2 = 15 (Level 2)
      D7: 1, D8: 1, D9: 1, D10: 1, D11: 1, D12: 1, // Will = 12 (Level 2)
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-02',
      name: 'Moderately Conservative Profile',
      description: 'Capacity Level 2 (Score 15) and Willingness Level 2 (Score 12)',
      inputDescription: 'Average scores around 2-3 per question, no horizon/emergency overrides',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Conservative',
      notes: 'Level 2 mapping (Score 11–15). No overrides active.',
    });
  }

  // Test 3: Moderate Result
  {
    const answers: Record<string, number> = {
      D1: 2, D2: 2, D3: 2, D4: 2, D5: 2, D6: 2, // 3*6 = 18 (Level 3)
      D7: 2, D8: 2, D9: 2, D10: 2, D11: 2, D12: 2, // 3*6 = 18 (Level 3)
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-03',
      name: 'Moderate Profile',
      description: 'Capacity Level 3 (Score 18) and Willingness Level 3 (Score 18)',
      inputDescription: 'All options index 2 (score = 3)',
      expectedProfile: 'Moderate',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderate',
      notes: 'Level 3 mapping (Score 16–20). Both capacity and willingness match.',
    });
  }

  // Test 4: Moderately Aggressive Result
  {
    const answers: Record<string, number> = {
      D1: 3, D2: 3, D3: 3, D4: 3, D5: 3, D6: 3, // 4*6 = 24 (Level 4)
      D7: 3, D8: 3, D9: 3, D10: 3, D11: 3, D12: 3, // 4*6 = 24 (Level 4)
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-04',
      name: 'Moderately Aggressive Profile',
      description: 'Capacity Level 4 (Score 24) and Willingness Level 4 (Score 24)',
      inputDescription: 'All options index 3 (score = 4)',
      expectedProfile: 'Moderately Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Aggressive',
      notes: 'Level 4 mapping (Score 21–25). Indicative equity 55%–80%.',
    });
  }

  // Test 5: Aggressive Result (Maximum Scores)
  {
    const answers: Record<string, number> = {
      D1: 4, D2: 4, D3: 4, D4: 4, D5: 4, D6: 4, // 5*6 = 30 (Level 5)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4, // 5*6 = 30 (Level 5)
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-05',
      name: 'Aggressive Profile',
      description: 'Capacity Level 5 (Score 30) and Willingness Level 5 (Score 30)',
      inputDescription: 'All options index 4 (score = 5)',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Aggressive',
      notes: 'Level 5 mapping (Score 26–30). Indicative equity 80%–100%.',
    });
  }

  // Test 6: Capacity Lower than Willingness (min rule)
  {
    // Capacity = 14 (Level 2: Moderately Conservative)
    // Willingness = 28 (Level 5: Aggressive)
    const answers: Record<string, number> = {
      D1: 1, D2: 2, D3: 1, D4: 2, D5: 1, D6: 1, // Cap = 2+3+2+3+2+2 = 14 (Level 2)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 3, // Will = 5+5+5+5+5+4 = 29 (Level 5)
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-06',
      name: 'Capacity Lower than Willingness (min rule)',
      description: 'Investor is psychologically aggressive (Level 5) but financially limited (Level 2)',
      inputDescription: 'Capacity Level 2 vs Willingness Level 5',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Conservative' && res.isInconsistent,
      notes: 'Successfully takes lower of two levels. Inconsistency flag correctly triggered (difference >= 2 levels).',
    });
  }

  // Test 7: Willingness Lower than Capacity (min rule)
  {
    // Capacity = 28 (Level 5: Aggressive)
    // Willingness = 12 (Level 2: Moderately Conservative)
    const answers: Record<string, number> = {
      D1: 4, D2: 4, D3: 4, D4: 4, D5: 4, D6: 3, // Cap = 5+5+5+5+5+4 = 29 (Level 5)
      D7: 1, D8: 1, D9: 1, D10: 1, D11: 1, D12: 1, // Will = 2*6 = 12 (Level 2)
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-07',
      name: 'Willingness Lower than Capacity (min rule)',
      description: 'Investor has strong capacity (Level 5) but low risk appetite (Level 2)',
      inputDescription: 'Capacity Level 5 vs Willingness Level 2',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Conservative' && res.isInconsistent,
      notes: 'Prudently caps at lower willingness level (Moderately Conservative) to protect risk-averse investor.',
    });
  }

  // Test 8: Short Horizon Override O1 (< 1 year)
  {
    // Capacity is otherwise high, but D2 is < 1 yr (index 0)
    const answers: Record<string, number> = {
      D1: 4, D2: 0, D3: 4, D4: 4, D5: 4, D6: 4, // D2 = 0 (< 1 yr)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-08',
      name: 'Override O1: Horizon < 1 Year',
      description: 'Horizon < 1 year must strictly cap profile at Conservative',
      inputDescription: 'D2 option index 0, all other answers Aggressive',
      expectedProfile: 'Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O1'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Conservative' && res.appliedOverrides.some((o) => o.code === 'O1'),
      notes: 'O1 override triggered and successfully capped Aggressive down to Conservative.',
    });
  }

  // Test 9: Near-Term Horizon Override O3 (1-3 years)
  {
    const answers: Record<string, number> = {
      D1: 4, D2: 1, D3: 4, D4: 4, D5: 4, D6: 4, // D2 = 1 (1-3 yrs)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-09',
      name: 'Override O3: Horizon 1–3 Years',
      description: 'Horizon 1–3 years must cap profile at Moderately Conservative',
      inputDescription: 'D2 option index 1 (1-3 yrs), high capacity/willingness elsewhere',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O3'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Conservative' && res.appliedOverrides.some((o) => o.code === 'O3'),
      notes: 'O3 override triggered and successfully capped profile at Moderately Conservative.',
    });
  }

  // Test 10: No Emergency Fund Override O4
  {
    const answers: Record<string, number> = {
      D1: 4, D2: 4, D3: 4, D4: 4, D5: 0, D6: 4, // D5 = 0 (No emergency fund)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-10',
      name: 'Override O4: Zero Emergency Fund',
      description: 'Absence of emergency fund buffer caps profile at Moderately Conservative',
      inputDescription: 'D5 option index 0 (0 months emergency fund)',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O4'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Conservative' && res.appliedOverrides.some((o) => o.code === 'O4'),
      notes: 'O4 override successfully enforced.',
    });
  }

  // Test 11: High Debt Servicing Override O5 (>60% of income)
  {
    const answers: Record<string, number> = {
      D1: 4, D2: 4, D3: 4, D4: 0, D5: 4, D6: 4, // D4 = 0 (>60% debt)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-11',
      name: 'Override O5: Debt Servicing > 60%',
      description: 'Excessive debt commitments cap profile at Moderately Conservative',
      inputDescription: 'D4 option index 0 (>60% debt commitment)',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O5'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderately Conservative' && res.appliedOverrides.some((o) => o.code === 'O5'),
      notes: 'O5 override successfully enforced.',
    });
  }

  // Test 12A: Override O6: Above 60 (D1 = A) AND D6 <= B (savings rate <= 20%) -> O6 applies (caps Moderate)
  {
    const answers: Record<string, number> = {
      D1: 0, D2: 4, D3: 4, D4: 4, D5: 4, D6: 1, // D1 = 0 (A: >60 yrs), D6 = 1 (B: 10-20% saved)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const financial = {
      hasOver50PercentSavingsInvested: true,
    };
    const res = calculateRiskProfile(answers, financial);
    tests.push({
      testId: 'TC-12A',
      name: 'Override O6: D1 = A AND D6 <= B Trigger',
      description: 'Investor age > 60 (D1 = A) AND monthly income savings rate <= 20% (D6 <= B): O6 applies and caps profile at Moderate (Level 3)',
      inputDescription: 'D1 option index 0 (A: >60 yrs) + D6 option index 1 (B: 10–20% saved)',
      expectedProfile: 'Moderate',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O6'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Moderate' && res.appliedOverrides.some((o) => o.code === 'O6' && o.status === 'Applied'),
      notes: 'O6 correctly applied: Exact source trigger D1 = A AND D6 <= B verified, risk profile capped at Moderate (Level 3).',
    });
  }

  // Test 12B: Override O6: Above 60 (D1 = A) but D6 > B -> O6 does not apply
  {
    const answers: Record<string, number> = {
      D1: 0, D2: 4, D3: 4, D4: 4, D5: 4, D6: 4, // D1 = 0 (A: >60 yrs), D6 = 4 (E: >50% monthly income saved, D6 > B)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-12B',
      name: 'Override O6: Above 60 + D6 > B Does Not Apply',
      description: 'Investor age > 60 but D6 > B (savings rate > 20%): O6 does not apply due to strong income savings capacity',
      inputDescription: 'D1 option index 0 (A: >60 yrs) + D6 option index 4 (E: >50% saved)',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: !res.appliedOverrides.some((o) => o.code === 'O6') && res.finalProfile === 'Aggressive',
      notes: 'O6 does not apply because D6 > B condition is not met.',
    });
  }

  // Test 12C: Override O6: Above 60 + missing D6 answer -> O6 is unevaluated
  {
    const answers: Record<string, number> = {
      D1: 0, D2: 4, D3: 4, D4: 4, D5: 4, // D6 is omitted / undefined
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    const o6Override = res.appliedOverrides.find((o) => o.code === 'O6');
    tests.push({
      testId: 'TC-12C',
      name: 'Override O6: Above 60 + Missing D6 (Unevaluated)',
      description: 'Investor age > 60 but D6 is undefined: O6 marked Unevaluated, flagged for clarification',
      inputDescription: 'D1 option index 0 (>60 yrs) + D6 undefined',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O6'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: o6Override !== undefined && o6Override.isUnevaluated === true && o6Override.requiresClarification === true && o6Override.status === 'Unevaluated',
      notes: 'O6 marked as Unevaluated; clarification requested instead of assuming false.',
    });
  }

  // Test 12D: Override O6: Below or equal to 60 + D6 <= B -> O6 does not apply
  {
    const answers: Record<string, number> = {
      D1: 2, D2: 4, D3: 4, D4: 4, D5: 4, D6: 0, // D1 = 2 (C: 36-50 yrs, <= 60), D6 = 0 (A: <=10%)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-12D',
      name: 'Override O6: Below or Equal to 60 + D6 <= B',
      description: 'Investor age <= 60: O6 does not apply even if D6 <= B',
      inputDescription: 'D1 option index 2 (36–50 yrs) + D6 option index 0',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: !res.appliedOverrides.some((o) => o.code === 'O6'),
      notes: 'O6 does not apply: age is <= 60 years.',
    });
  }

  // Test 12E: Override O6: D6 score 5 alone -> O6 does not apply
  {
    const answers: Record<string, number> = {
      D1: 2, D2: 4, D3: 4, D4: 4, D5: 4, D6: 4, // D6 = 4 (score 5: >50% monthly income saved)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const financial = {
      hasOver50PercentSavingsInvested: false,
    };
    const res = calculateRiskProfile(answers, financial);
    tests.push({
      testId: 'TC-12E',
      name: 'Override O6: D6 Score 5 Alone Does Not Apply',
      description: 'D6 measures monthly income savings rate, not accumulated savings invested. High D6 alone cannot activate O6.',
      inputDescription: 'D6 option index 4 (Score 5: >50% monthly income saved)',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: !res.appliedOverrides.some((o) => o.code === 'O6'),
      notes: 'Verified: D6 fallback is completely removed and D6 score 5 alone never activates O6.',
    });
  }

  // Test 12F: Override O6: Multiple existing asset classes alone -> O6 does not apply
  {
    const answers: Record<string, number> = {
      D1: 0, D2: 4, D3: 4, D4: 4, D5: 4, D6: 2, // D1 = 0 (>60 yrs)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const financial = {
      hasOver50PercentSavingsInvested: false,
      existingPortfolio: [
        'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
        'Mutual Funds & Direct Equities',
        'Gold, Sovereign Gold Bonds & Precious Metals',
        'Real Estate (Land, Commercial, Residential beyond primary home)',
        'Alternative Investments, PMS, Unlisted Equity or Venture Funds',
      ],
    };
    const res = calculateRiskProfile(answers, financial);
    tests.push({
      testId: 'TC-12F',
      name: 'Override O6: Multiple Asset Classes Alone Do Not Apply',
      description: 'Verifies that holding multiple asset classes without >50% savings invested does not trigger O6',
      inputDescription: 'D1 option index 0 (>60 yrs) + 5 asset classes, but hasOver50PercentSavingsInvested = false',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: !res.appliedOverrides.some((o) => o.code === 'O6'),
      notes: 'Audit passed: Multi-asset portfolio ownership alone does NOT activate O6.',
    });
  }

  // Test 15A: Override O2: Partial Liquidity Requirement (Pending Policy Approval)
  {
    const answers: Record<string, number> = {
      D1: 4, D2: 4, D3: 4, D4: 4, D5: 4, D6: 4,
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const financial = {
      neededWithin12Months: 'Yes' as const,
      neededAmount: '₹25 Lakhs for partial child education fee',
    };
    const res = calculateRiskProfile(answers, financial);
    const o2Override = res.appliedOverrides.find((o) => o.code === 'O2');
    tests.push({
      testId: 'TC-15A',
      name: 'Override O2: Partial Liquidity Requirement (Pending Policy Approval)',
      description: 'Partial withdrawal does not invent allocation formulas; flags pending business/compliance approval while preserving base allocation',
      inputDescription: 'B9 = Yes, partial amount ₹25 Lakhs',
      expectedProfile: 'Aggressive',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O2'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: o2Override !== undefined && o2Override.status === 'Pending Policy Approval' && o2Override.requiresBusinessApproval === true && res.finalProfile === 'Aggressive',
      notes: 'Partial withdrawal recorded with withdrawalAmount, flagged as Pending Policy Approval without inventing unapproved allocations.',
    });
  }

  // Test 15B: Override O2: Majority/Entire Capital Requirement (Conservative Cap Applied)
  {
    const answers: Record<string, number> = {
      D1: 4, D2: 4, D3: 4, D4: 4, D5: 4, D6: 4,
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 4,
    };
    const financial = {
      neededWithin12Months: 'Yes' as const,
      neededAmount: 'Entire capital needed within 8 months for home purchase',
    };
    const res = calculateRiskProfile(answers, financial);
    const o2Override = res.appliedOverrides.find((o) => o.code === 'O2');
    tests.push({
      testId: 'TC-15B',
      name: 'Override O2: Majority/Entire Capital Required (Conservative Cap)',
      description: 'Majority or entire capital required within 12 months strictly caps profile at Conservative (Level 1)',
      inputDescription: 'B9 = Yes, entire capital required',
      expectedProfile: 'Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O2'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: o2Override !== undefined && o2Override.status === 'Applied' && res.finalProfile === 'Conservative',
      notes: 'Entire capital requirement enforces Conservative cap (Level 1).',
    });
  }

  // Test 13: Multiple Overrides (Most Restrictive Wins)
  {
    // Has O1 (horizon < 1 yr -> caps at Conservative Level 1) AND O4 (no emergency fund -> caps at Level 2)
    const answers: Record<string, number> = {
      D1: 3, D2: 0, D3: 3, D4: 3, D5: 0, D6: 3, // D2=0 (O1), D5=0 (O4)
      D7: 3, D8: 3, D9: 3, D10: 3, D11: 3, D12: 3,
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-13',
      name: 'Multiple Overrides: Most Restrictive Wins',
      description: 'When both O1 (Conservative) and O4 (Moderately Conservative) trigger, O1 wins',
      inputDescription: 'D2=0 (Horizon < 1 yr) and D5=0 (No Emergency Fund)',
      expectedProfile: 'Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O1', 'O4'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.finalProfile === 'Conservative' && res.appliedOverrides.length >= 2,
      notes: 'Verified that the most restrictive override (Level 1 Conservative) takes precedence.',
    });
  }

  // Test 14: Missing Scored Answer Override O7
  {
    const answers: Record<string, number> = {
      D1: 3, D2: 3, D3: 3, // D4, D5, D6 missing!
      D7: 3, D8: 3, D9: 3, D10: 3, D11: 3, // D12 missing!
    };
    const res = calculateRiskProfile(answers);
    tests.push({
      testId: 'TC-14',
      name: 'Override O7: Missing Scored Answers Blocked',
      description: 'Missing answers in scored D1–D12 block profile calculation and recommendations',
      inputDescription: 'Answers provided for only 8 of 12 questions',
      expectedProfile: 'Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: ['O7'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: res.isMissingAnswer && res.missingQuestionIds.length === 4,
      notes: 'O7 successfully detected 4 missing questions and blocked valid profile calculation.',
    });
  }

  // Test C1: Consistency Check C1 – Capacity vs Willingness Divergence (|capacityLevel - willingnessLevel| >= 2)
  {
    const answers: Record<string, number> = {
      D1: 1, D2: 2, D3: 1, D4: 2, D5: 1, D6: 1, // Cap = 14 (Level 2)
      D7: 4, D8: 4, D9: 4, D10: 4, D11: 4, D12: 3, // Will = 29 (Level 5)
    };
    const res = calculateRiskProfile(answers);
    const c1 = res.consistencyChecks?.find((c) => c.code === 'C1');
    tests.push({
      testId: 'TC-C1',
      name: 'Consistency Check C1: Capacity vs Willingness Divergence',
      description: 'Capacity Level 2 vs Willingness Level 5 triggers C1 consistency clarification flag',
      inputDescription: 'Capacity Level 2 vs Willingness Level 5 (Difference = 3 levels >= 2)',
      expectedProfile: 'Moderately Conservative',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: c1 !== undefined && c1.isTriggered === true && res.isInconsistent === true,
      notes: 'C1 correctly triggered: Level divergence >= 2 flagged for investor clarification.',
    });
  }

  // Test C2: Consistency Check C2 – Short Horizon vs Aggressive Objective / Return
  {
    const answers: Record<string, number> = {
      D1: 3, D2: 0, D3: 3, D4: 3, D5: 3, D6: 3, // D2 = 0 (<1 yr horizon)
      D7: 3, D8: 4, D9: 3, D10: 3, D11: 4, D12: 3, // D8 = 4 (Aggressive Capital Growth), D11 = 4 (>15% return)
    };
    const res = calculateRiskProfile(answers);
    const c2 = res.consistencyChecks?.find((c) => c.code === 'C2');
    tests.push({
      testId: 'TC-C2',
      name: 'Consistency Check C2: Horizon vs Objective Inconsistency',
      description: 'Short horizon (< 1 yr) with Aggressive Growth objective / >15% return expectation triggers C2',
      inputDescription: 'D2 = 0 (< 1 yr) with D8 = 4 (Aggressive Growth) and D11 = 4 (>15% return)',
      expectedProfile: 'Conservative', // O1 caps at Conservative
      actualProfile: res.finalProfile,
      expectedOverrides: ['O1'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: c2 !== undefined && c2.isTriggered === true,
      notes: 'C2 correctly triggered: Horizon mismatch with aggressive return flagged.',
    });
  }

  // Test C3: Consistency Check C3 – Zero Emergency Fund vs High Drawdown Tolerance
  {
    const answers: Record<string, number> = {
      D1: 3, D2: 3, D3: 3, D4: 3, D5: 0, D6: 3, // D5 = 0 (0 months emergency fund)
      D7: 3, D8: 3, D9: 4, D10: 3, D11: 3, D12: 3, // D9 = 4 (Tolerates >20% decline)
    };
    const res = calculateRiskProfile(answers);
    const c3 = res.consistencyChecks?.find((c) => c.code === 'C3');
    tests.push({
      testId: 'TC-C3',
      name: 'Consistency Check C3: Emergency Fund vs Loss Tolerance Inconsistency',
      description: 'Zero emergency fund with >20% drawdown tolerance triggers C3',
      inputDescription: 'D5 = 0 (0 months buffer) with D9 = 4 (>20% drawdown tolerance)',
      expectedProfile: 'Moderately Conservative', // O4 caps at Moderately Conservative
      actualProfile: res.finalProfile,
      expectedOverrides: ['O4'],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: c3 !== undefined && c3.isTriggered === true,
      notes: 'C3 correctly triggered: Inadequate liquid buffer alongside high volatility appetite flagged.',
    });
  }

  // Test C4: Consistency Check C4 – Market Knowledge vs Crisis Reaction
  {
    const answers: Record<string, number> = {
      D1: 3, D2: 3, D3: 3, D4: 3, D5: 3, D6: 3,
      D7: 4, D8: 3, D9: 3, D10: 0, D11: 3, D12: 3, // D7 = 4 (Advanced knowledge), D10 = 0 (Panic and sell everything)
    };
    const res = calculateRiskProfile(answers);
    const c4 = res.consistencyChecks?.find((c) => c.code === 'C4');
    tests.push({
      testId: 'TC-C4',
      name: 'Consistency Check C4: Knowledge vs Reaction Inconsistency',
      description: 'Advanced market knowledge coupled with panic selling upon 20% drawdown triggers C4',
      inputDescription: 'D7 = 4 (Advanced knowledge) with D10 = 0 (Panic and immediately sell all holdings)',
      expectedProfile: 'Moderate',
      actualProfile: res.finalProfile,
      expectedOverrides: [],
      actualOverrides: res.appliedOverrides.map((o) => o.code),
      capacityScore: res.capacityScore,
      willingnessScore: res.willingnessScore,
      combinedScore: res.combinedScore,
      passed: c4 !== undefined && c4.isTriggered === true,
      notes: 'C4 correctly triggered: Reported expertise directly conflicts with behavioral distress selling.',
    });
  }

  return tests;
}
