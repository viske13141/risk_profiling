/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QUESTION_BANK } from '../data/questionBank';
import {
  ConsistencyCheckResult,
  FinancialProfileAnswers,
  InvestmentRiskProfile,
  RiskCalculationResult,
} from '../types/investor';

export const LEVEL_TO_PROFILE: Record<number, InvestmentRiskProfile> = {
  1: 'Conservative',
  2: 'Moderately Conservative',
  3: 'Moderate',
  4: 'Moderately Aggressive',
  5: 'Aggressive',
};

export const PROFILE_TO_LEVEL: Record<InvestmentRiskProfile, number> = {
  Conservative: 1,
  'Moderately Conservative': 2,
  Moderate: 3,
  'Moderately Aggressive': 4,
  Aggressive: 5,
};

export const INDICATIVE_ALLOCATIONS: Record<
  InvestmentRiskProfile,
  { equityRange: string; debtRange: string; description: string; schemes: string[] }
> = {
  Conservative: {
    equityRange: '0% – 10%',
    debtRange: '90% – 100%',
    description: 'Capital preservation priority. Primarily invested in low-volatility fixed income, liquid, and banking & PSU debt funds.',
    schemes: ['Liquid Funds', 'Overnight Funds', 'Ultra Short Duration Funds', 'Arbitrage Funds (0% equity directional risk)'],
  },
  'Moderately Conservative': {
    equityRange: '10% – 30%',
    debtRange: '70% – 90%',
    description: 'Income generation with limited capital appreciation. Moderate buffer against inflation with low volatility.',
    schemes: ['Conservative Hybrid Funds', 'Short Duration Debt Funds', 'Corporate Bond Funds', 'Equity Savings Funds'],
  },
  Moderate: {
    equityRange: '30% – 55%',
    debtRange: '45% – 70%',
    description: 'Balanced approach between capital growth and fixed income stability across market cycles.',
    schemes: ['Dynamic Asset Allocation / Balanced Advantage Funds', 'Balanced Hybrid Funds', 'Multi-Asset Allocation Funds'],
  },
  'Moderately Aggressive': {
    equityRange: '55% – 80%',
    debtRange: '20% – 45%',
    description: 'Long-term wealth accumulation through predominantly equity exposure with modest debt dampening.',
    schemes: ['Aggressive Hybrid Funds', 'Large & Mid Cap Equity Funds', 'Flexi Cap Equity Funds', 'Large Cap Index Funds'],
  },
  Aggressive: {
    equityRange: '80% – 100%',
    debtRange: '0% – 20%',
    description: 'Maximum long-term compounding with high appetite for market drawdowns and cyclical equity volatility.',
    schemes: ['Mid Cap Equity Funds', 'Small Cap Equity Funds', 'Sectoral & Thematic Funds', 'International / Focused Funds'],
  },
};

/**
 * Maps raw section score (6 to 30) to risk level (1 to 5)
 */
export function mapScoreToLevel(score: number): number {
  if (score <= 10) return 1;
  if (score <= 15) return 2;
  if (score <= 20) return 3;
  if (score <= 25) return 4;
  return 5;
}

/**
 * Evaluates O1 - O7 overrides and calculates the final risk profile
 */
export function calculateRiskProfile(
  answers: Record<string, number>, // questionId -> option index 0-4
  financialProfile?: Partial<FinancialProfileAnswers>,
  adviserAdjustment?: {
    adjustedProfile: InvestmentRiskProfile;
    reason: string;
    adviserName: string;
  }
): RiskCalculationResult {
  // Check O7: Missing scored answer
  const scoredQuestionIds = [
    'D1', 'D2', 'D3', 'D4', 'D5', 'D6',
    'D7', 'D8', 'D9', 'D10', 'D11', 'D12',
  ];

  const missingQuestionIds: string[] = [];
  scoredQuestionIds.forEach((id) => {
    if (answers[id] === undefined || answers[id] === null) {
      missingQuestionIds.push(id);
    }
  });

  const isMissingAnswer = missingQuestionIds.length > 0;

  // Capacity Score: D1 to D6
  let capacityScore = 0;
  for (let i = 1; i <= 6; i++) {
    const qId = `D${i}`;
    const optIdx = answers[qId];
    if (optIdx !== undefined) {
      const q = QUESTION_BANK.find((qb) => qb.id === qId);
      const opt = q?.options[optIdx];
      capacityScore += opt?.score ?? 1;
    }
  }

  // Willingness Score: D7 to D12
  let willingnessScore = 0;
  for (let i = 7; i <= 12; i++) {
    const qId = `D${i}`;
    const optIdx = answers[qId];
    if (optIdx !== undefined) {
      const q = QUESTION_BANK.find((qb) => qb.id === qId);
      const opt = q?.options[optIdx];
      willingnessScore += opt?.score ?? 1;
    }
  }

  const combinedScore = capacityScore + willingnessScore;

  const capacityLevel = isMissingAnswer ? 1 : mapScoreToLevel(capacityScore);
  const willingnessLevel = isMissingAnswer ? 1 : mapScoreToLevel(willingnessScore);

  const capacityCategory = LEVEL_TO_PROFILE[capacityLevel];
  const willingnessCategory = LEVEL_TO_PROFILE[willingnessLevel];

  // Base Profile: Take the lower of Capacity Level and Willingness Level
  const baseLevel = Math.min(capacityLevel, willingnessLevel);
  const baseProfile = LEVEL_TO_PROFILE[baseLevel];

  // Evaluate Overrides O1 to O7
  const appliedOverrides: RiskCalculationResult['appliedOverrides'] = [];

  let cappedLevel = baseLevel;

  // O7: Missing Answer Override
  if (isMissingAnswer) {
    appliedOverrides.push({
      code: 'O7',
      title: 'Missing Scored Question Answers',
      description: `Incomplete questionnaire: ${missingQuestionIds.length} mandatory scored questions are unanswered (${missingQuestionIds.join(', ')}).`,
      impact: 'Blocks profile calculation and prevents any product suitability recommendations.',
    });
    cappedLevel = 1; // blocked
  }

  // O1: Horizon below 1 year (D2 option index 0, score 1)
  if (answers['D2'] === 0) {
    appliedOverrides.push({
      code: 'O1',
      title: 'Ultra Short Investment Horizon (< 1 year)',
      description: 'Investment horizon is less than one year. Short-term funds must avoid market drawdown risk.',
      impact: 'Caps investment profile at Conservative (Level 1).',
    });
    cappedLevel = Math.min(cappedLevel, 1);
  }

  // O2: Money needed within 12 months (from B9)
  // Framework Rule: Money likely to be needed within 12 months caps the profile at Conservative
  // FOR THE AMOUNT LIKELY TO BE WITHDRAWN.
  // TASK 2 IMPLEMENTATION:
  // - Record the required withdrawal amount.
  // - Flag the case as requiring business and compliance approval.
  // - Show the proposed Conservative liquid-sleeve approach as pending approval.
  // - Do NOT automatically create a second portfolio or change asset allocations.
  // - Do NOT invent a withdrawal allocation formula.
  // - For majority (>50%) or entire capital required: apply the documented Conservative cap (Level 1).
  if (financialProfile?.neededWithin12Months === 'Yes') {
    const b9Option = financialProfile?.b9SelectedOption || '';
    const withdrawalAmount = financialProfile?.neededAmount || b9Option || 'Specified amount';
    const isMajorityOrFull =
      b9Option.toLowerCase().includes('majority') ||
      b9Option.toLowerCase().includes('>50%') ||
      financialProfile?.neededAmount?.toLowerCase().includes('entire') ||
      financialProfile?.neededAmount?.toLowerCase().includes('majority') ||
      financialProfile?.neededAmount?.toLowerCase().includes('>50%');

    if (isMajorityOrFull) {
      appliedOverrides.push({
        code: 'O2',
        title: '12-Month Liquidity Requirement (Majority/Entire Capital)',
        description: `Majority or entire capital required within 12 months (${withdrawalAmount}). Full account capital preservation mandated.`,
        impact: 'Caps overall investment profile at Conservative (Level 1).',
        status: 'Applied',
        withdrawalAmount,
        evidenceNotes: `B9 Response: Yes (${withdrawalAmount}) - Majority/Entire capital needed within 12 months.`,
      });
      cappedLevel = Math.min(cappedLevel, 1);
    } else {
      appliedOverrides.push({
        code: 'O2',
        title: '12-Month Partial Liquidity Requirement (Pending Policy Approval)',
        description: `Client declared partial funds required within 12 months: ${withdrawalAmount}. Framework stipulates capping at Conservative for the amount likely to be withdrawn.`,
        impact: 'Pending Policy Approval: Proposed Conservative liquid sleeve for withdrawal amount requires compliance sign-off. Asset allocation remains unchanged pending approval.',
        requiresBusinessApproval: true,
        status: 'Pending Policy Approval',
        withdrawalAmount,
        evidenceNotes: `B9 Withdrawal Amount: ${withdrawalAmount}. Awaiting operational policy decision on dual-sleeve sub-portfolio vs full account cap.`,
      });
    }
  }

  // O3: Investment horizon of 1–3 years (D2 option index 1, score 2)
  if (answers['D2'] === 1) {
    appliedOverrides.push({
      code: 'O3',
      title: 'Near-Term Horizon (1–3 years)',
      description: 'Investment horizon is 1 to 3 years. Capital recovery buffer is limited.',
      impact: 'Caps investment profile at Moderately Conservative (Level 2).',
      status: 'Applied',
    });
    cappedLevel = Math.min(cappedLevel, 2);
  }

  // O4: No emergency fund (D5 option index 0, score 1)
  if (answers['D5'] === 0) {
    appliedOverrides.push({
      code: 'O4',
      title: 'Zero Emergency Fund Buffer',
      description: 'No liquid emergency reserves available. Higher risk of distress liquidation.',
      impact: 'Caps investment profile at Moderately Conservative (Level 2).',
      status: 'Applied',
    });
    cappedLevel = Math.min(cappedLevel, 2);
  }

  // O5: Debt servicing > 60% of monthly income (D4 option index 0, score 1)
  if (answers['D4'] === 0) {
    appliedOverrides.push({
      code: 'O5',
      title: 'High Debt Obligations (>60% of income)',
      description: 'Over 60% of income is committed to loan EMIs and debt liabilities.',
      impact: 'Caps investment profile at Moderately Conservative (Level 2).',
      status: 'Applied',
    });
    cappedLevel = Math.min(cappedLevel, 2);
  }

  // O6: Age > 60 and D6 <= B (D1 = Option A [index 0], D6 <= Option B [index <= 1])
  // Source trigger: D1 = A AND D6 <= B (monthly income savings rate <= 20%)
  const isD1A = answers['D1'] === 0; // Option A: Above 60 years (Score 1)
  const isD6Missing = answers['D6'] === undefined;
  const isD6LeB = answers['D6'] !== undefined && answers['D6'] <= 1; // Option A (<=10%) or Option B (10-20%)

  if (isD1A) {
    if (isD6Missing) {
      // D6 answer is missing: mark O6 as unevaluated and flag for clarification
      appliedOverrides.push({
        code: 'O6',
        title: 'Senior Investor Asset Exposure (Unevaluated – Clarification Required)',
        description: 'Investor age is above 60 (D1 = A), but D6 monthly income savings rate is unanswered.',
        impact: 'Unevaluated: Pending confirmation of D6 savings deployable rate. Base profile maintained pending clarification.',
        requiresClarification: true,
        isUnevaluated: true,
        status: 'Unevaluated',
        evidenceNotes: 'Evidence: D1 = A (Above 60 years); D6 is missing/unanswered.',
      });
    } else if (isD6LeB) {
      // Exact source trigger met: D1 = A AND D6 <= B
      let reconciliationNote = 'Source trigger confirmed: D1 = A (Above 60 years) AND D6 <= B (Monthly savings deployable <= 20%).';
      if (financialProfile?.hasOver50PercentSavingsInvested === true) {
        reconciliationNote += ' Corroborated by Part B5 (>50% savings deployed in market assets).';
      } else if (financialProfile?.hasOver50PercentSavingsInvested === false) {
        reconciliationNote += ' Reconciled with B5 (<=50% market savings, but low monthly savings buffer mandates Moderate cap).';
      }

      appliedOverrides.push({
        code: 'O6',
        title: 'Senior Investor Asset Exposure (D1 = A & D6 <= B)',
        description: 'Investor is above 60 years old (D1 = Option A) with limited monthly income savings rate (D6 <= Option B, <=20%), demonstrating low capacity to replenish invested capital.',
        impact: 'Caps investment profile at Moderate (Level 3).',
        status: 'Applied',
        evidenceNotes: reconciliationNote,
      });
      cappedLevel = Math.min(cappedLevel, 3);
    } else {
      // D1 = A, but D6 > B (D6 is C, D, or E; score 3, 4, or 5) -> O6 does NOT apply
      // Reconciled: Investor has robust ongoing savings capacity (>20% of monthly income)
    }
  }

  // ==========================================
  // CONSISTENCY CHECKS (C1 – C4)
  // ==========================================
  const consistencyChecks: ConsistencyCheckResult[] = [];

  // C1: Capacity vs. Willingness Divergence (|capacityLevel - willingnessLevel| >= 2)
  const levelDifference = Math.abs(capacityLevel - willingnessLevel);
  const isC1Triggered = levelDifference >= 2;
  consistencyChecks.push({
    code: 'C1',
    title: 'Capacity vs. Willingness Divergence',
    description: `Divergence between risk capacity (Level ${capacityLevel} - ${capacityCategory}) and risk willingness (Level ${willingnessLevel} - ${willingnessCategory}).`,
    severity: isC1Triggered ? 'Clarification Required' : 'Warning',
    isTriggered: isC1Triggered,
    details: isC1Triggered
      ? `Investor capacity is Level ${capacityLevel} while psychological willingness is Level ${willingnessLevel} (divergence of ${levelDifference} levels). Lower level enforced.`
      : undefined,
  });

  // C2: Short Horizon vs. Aggressive Objective / Return Inconsistency
  // Short Horizon: D2 = 0 (< 1 yr) or D2 = 1 (1-3 yrs)
  // Aggressive Objective / Return: D8 = 4 (Aggressive Capital Growth) or D11 = 4 (Max return >15%)
  const isShortHorizon = answers['D2'] !== undefined && answers['D2'] <= 1;
  const isAggressiveObjectiveOrReturn =
    (answers['D8'] !== undefined && answers['D8'] >= 4) ||
    (answers['D11'] !== undefined && answers['D11'] >= 4);
  const isC2Triggered = isShortHorizon && isAggressiveObjectiveOrReturn;
  consistencyChecks.push({
    code: 'C2',
    title: 'Horizon vs. Return Objective Inconsistency',
    description: 'Near-term capital requirement (<3 years) combined with aggressive capital compounding or >15% return expectations.',
    severity: isC2Triggered ? 'Clarification Required' : 'Warning',
    isTriggered: isC2Triggered,
    details: isC2Triggered
      ? 'Short-term holding periods cannot mathematically support high-volatility compounding without severe drawdown risk.'
      : undefined,
  });

  // C3: Emergency Fund vs. Drawdown Tolerance Inconsistency
  // Zero Emergency Fund: D5 = 0 (0 months)
  // High Drawdown Tolerance: D9 = 4 (Can tolerate >20% decline)
  const isZeroEmergencyFund = answers['D5'] === 0;
  const isHighDrawdownTolerance = answers['D9'] !== undefined && answers['D9'] >= 4;
  const isC3Triggered = isZeroEmergencyFund && isHighDrawdownTolerance;
  consistencyChecks.push({
    code: 'C3',
    title: 'Liquidity Buffer vs. Loss Tolerance Inconsistency',
    description: 'Zero liquid emergency reserves (0 months) declared alongside tolerance for >20% portfolio drawdowns.',
    severity: isC3Triggered ? 'Clarification Required' : 'Warning',
    isTriggered: isC3Triggered,
    details: isC3Triggered
      ? 'Absence of liquid cash buffers creates extreme risk of distress liquidation during market declines.'
      : undefined,
  });

  // C4: Knowledge Level vs. Market Crisis Reaction Inconsistency
  // Good/Advanced Knowledge: D7 >= 3 (Good or Advanced knowledge)
  // Panic and Sell: D10 = 0 (Panic and immediately sell all holdings)
  // OR Beginner Knowledge: D7 = 0 with Aggressive Return Expectation D11 = 4
  const isExperiencedKnowledge = answers['D7'] !== undefined && answers['D7'] >= 3;
  const isPanicReaction = answers['D10'] === 0;
  const isBeginnerKnowledge = answers['D7'] === 0;
  const isHighRiskReturn = answers['D11'] !== undefined && answers['D11'] >= 4;
  const isC4Triggered =
    (isExperiencedKnowledge && isPanicReaction) || (isBeginnerKnowledge && isHighRiskReturn);
  consistencyChecks.push({
    code: 'C4',
    title: 'Knowledge vs. Market Reaction Inconsistency',
    description: 'Reported capital markets knowledge conflicts with behavioral reaction to market drawdowns.',
    severity: isC4Triggered ? 'Clarification Required' : 'Warning',
    isTriggered: isC4Triggered,
    details: isC4Triggered
      ? isExperiencedKnowledge && isPanicReaction
        ? 'Investor reported advanced market expertise but indicated panic liquidation upon a 20% decline.'
        : 'Investor reported beginner / zero market experience but chose aggressive high-volatility product returns.'
      : undefined,
  });

  const isInconsistent = consistencyChecks.some((c) => c.isTriggered);
  const triggeredChecks = consistencyChecks.filter((c) => c.isTriggered);
  const inconsistencyMessage = isInconsistent
    ? `Consistency checks flagged: ${triggeredChecks.map((c) => `${c.code} (${c.title})`).join('; ')}. Clarification recommended.`
    : undefined;

  let finalLevel = cappedLevel;

  // Adviser adjustment (can ONLY lower profile)
  let calculatedAdviserAdjustment: RiskCalculationResult['adviserAdjustment'] = undefined;
  if (adviserAdjustment) {
    const targetLevel = PROFILE_TO_LEVEL[adviserAdjustment.adjustedProfile];
    if (targetLevel < finalLevel) {
      calculatedAdviserAdjustment = {
        originalProfile: LEVEL_TO_PROFILE[finalLevel],
        adjustedProfile: adviserAdjustment.adjustedProfile,
        reason: adviserAdjustment.reason,
        adviserName: adviserAdjustment.adviserName,
        timestamp: new Date().toISOString(),
      };
      finalLevel = targetLevel;
    }
  }

  const finalProfile = LEVEL_TO_PROFILE[finalLevel];

  const now = new Date();
  const nextReassessment = new Date();
  nextReassessment.setFullYear(now.getFullYear() + 1);

  return {
    capacityScore,
    willingnessScore,
    combinedScore,
    capacityLevel,
    willingnessLevel,
    capacityCategory,
    willingnessCategory,
    baseProfile,
    finalProfile,
    appliedOverrides,
    isInconsistent,
    inconsistencyMessage,
    consistencyChecks,
    isMissingAnswer,
    missingQuestionIds,
    adviserAdjustment: calculatedAdviserAdjustment,
    assessmentDate: now.toISOString().split('T')[0],
    nextReassessmentDate: nextReassessment.toISOString().split('T')[0],
    reassessmentStatus: 'Valid',
  };
}
