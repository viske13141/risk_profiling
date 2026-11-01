/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PieChart,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Info,
  IndianRupee,
  Plus,
  Minus,
} from 'lucide-react';
import { QUESTION_BANK } from '../../data/questionBank';
import { FinancialProfileAnswers, Investor } from '../../types/investor';

interface FinancialProfileViewProps {
  investor: Investor;
  onSave: (answers: FinancialProfileAnswers) => void;
  onContinue: () => void;
}

const ASSET_CLASSES = [
  'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
  'Mutual Funds & Direct Equities',
  'Real Estate (Land, Commercial, Residential beyond primary home)',
  'Gold, Sovereign Gold Bonds & Precious Metals',
  'EPF, PPF, NPS & Guaranteed Government Retirement Schemes',
  'Alternative Investments, PMS, Unlisted Equity or Venture Funds',
];

const MARKET_ASSETS = [
  'Mutual Funds & Direct Equities',
  'Real Estate (Land, Commercial, Residential beyond primary home)',
  'Alternative Investments, PMS, Unlisted Equity or Venture Funds',
];

export const FinancialProfileView: React.FC<FinancialProfileViewProps> = ({
  investor,
  onSave,
  onContinue,
}) => {
  const bQuestions = QUESTION_BANK.filter((q) => !q.isScored);

  // Initialize state conforming strictly to source document response formats
  const initialProfile = investor.financialProfile;

  const [dependentsNum, setDependentsNum] = useState<number>(() => {
    if (typeof initialProfile?.dependents === 'number') return initialProfile.dependents;
    if (typeof initialProfile?.dependents === 'string') {
      const match = initialProfile.dependents.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 1;
  });

  const [netWorth, setNetWorth] = useState<string>(
    initialProfile?.netWorth || '₹1 Crore to ₹5 Crores'
  );

  const [monthlyAmount, setMonthlyAmount] = useState<number>(() => {
    if (typeof initialProfile?.monthlyInvestmentAmount === 'number') {
      return initialProfile.monthlyInvestmentAmount;
    }
    return 50000;
  });

  const [hasLumpSum, setHasLumpSum] = useState<boolean>(() => {
    if (typeof initialProfile?.hasLumpSum === 'boolean') return initialProfile.hasLumpSum;
    return initialProfile?.lumpSumAmount !== 'No' && initialProfile?.lumpSumAmount !== undefined;
  });

  const [lumpSumAmount, setLumpSumAmount] = useState<number>(() => {
    if (typeof initialProfile?.lumpSumAmount === 'number') return initialProfile.lumpSumAmount;
    return 1000000;
  });

  const [existingPortfolio, setExistingPortfolio] = useState<string[]>(
    initialProfile?.existingPortfolio || [
      'Mutual Funds & Direct Equities',
      'Bank Fixed Deposits, Recurring Deposits & Liquid Cash',
    ]
  );

  const [assetPercentages, setAssetPercentages] = useState<Record<string, number>>(() => {
    if (initialProfile?.assetPercentages) return initialProfile.assetPercentages;
    return {
      'Mutual Funds & Direct Equities': 60,
      'Bank Fixed Deposits, Recurring Deposits & Liquid Cash': 40,
    };
  });

  const [hasLoans, setHasLoans] = useState<boolean>(() => {
    if (typeof initialProfile?.hasOutstandingLoans === 'boolean') {
      return initialProfile.hasOutstandingLoans;
    }
    return false;
  });

  const [monthlyEmi, setMonthlyEmi] = useState<number>(() => {
    if (typeof initialProfile?.monthlyEmiAmount === 'number') {
      return initialProfile.monthlyEmiAmount;
    }
    return 0;
  });

  const [insuranceStatus, setInsuranceStatus] = useState<'Term life' | 'Health' | 'Both' | 'Neither'>(() => {
    if (initialProfile?.insuranceStatus) return initialProfile.insuranceStatus;
    return 'Both';
  });

  const [hasChanges, setHasChanges] = useState<boolean>(() => {
    if (typeof initialProfile?.hasAnticipatedChanges === 'boolean') {
      return initialProfile.hasAnticipatedChanges;
    }
    return false;
  });

  const [changesDesc, setChangesDesc] = useState<string>(
    initialProfile?.anticipatedChangesDescription || ''
  );

  const [neededWithin12Months, setNeededWithin12Months] = useState<'Yes' | 'No'>(
    initialProfile?.neededWithin12Months === 'Yes' ? 'Yes' : 'No'
  );

  const [neededAmount, setNeededAmount] = useState<string>(
    initialProfile?.neededAmount || ''
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate market asset percentage
  const totalPercentage = Object.values(assetPercentages).reduce((a, b) => a + (b || 0), 0);
  const marketPercentage = Object.entries(assetPercentages).reduce((sum, [asset, pct]) => {
    return MARKET_ASSETS.includes(asset) ? sum + (pct || 0) : sum;
  }, 0);
  const isOver50PercentInvested = marketPercentage > 50;

  const handleToggleAsset = (asset: string) => {
    if (existingPortfolio.includes(asset)) {
      setExistingPortfolio(existingPortfolio.filter((a) => a !== asset));
      const nextPct = { ...assetPercentages };
      delete nextPct[asset];
      setAssetPercentages(nextPct);
    } else {
      setExistingPortfolio([...existingPortfolio, asset]);
      setAssetPercentages({
        ...assetPercentages,
        [asset]: 10,
      });
    }
  };

  const handlePercentageChange = (asset: string, val: number) => {
    setAssetPercentages({
      ...assetPercentages,
      [asset]: Math.max(0, Math.min(100, val)),
    });
  };

  const getFormData = (): FinancialProfileAnswers => {
    return {
      dependents: dependentsNum,
      netWorth,
      monthlyInvestmentAmount: monthlyAmount,
      monthlyInvestmentComfort: `₹${monthlyAmount.toLocaleString('en-IN')} per month`,
      hasLumpSum,
      lumpSumAmount: hasLumpSum ? lumpSumAmount : 'No',
      lumpSumCapacity: hasLumpSum ? `₹${lumpSumAmount.toLocaleString('en-IN')}` : 'No lump-sum',
      existingPortfolio,
      assetPercentages,
      hasOutstandingLoans: hasLoans,
      monthlyEmiAmount: hasLoans ? monthlyEmi : 0,
      existingDebtEmi: hasLoans ? `₹${monthlyEmi.toLocaleString('en-IN')} / month` : 'Nil / No active debt',
      insuranceStatus,
      insuranceCoverage: [insuranceStatus],
      hasAnticipatedChanges: hasChanges,
      anticipatedChangesDescription: hasChanges ? changesDesc : 'None',
      anticipatedChanges: hasChanges ? changesDesc : 'No major changes anticipated',
      neededWithin12Months,
      neededAmount: neededWithin12Months === 'Yes' ? neededAmount : '',
      b9SelectedOption: neededWithin12Months === 'Yes' ? 'Yes' : 'No',
      hasOver50PercentSavingsInvested: isOver50PercentInvested,
    };
  };

  const handleSaveDraft = () => {
    onSave(getFormData());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(getFormData());
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Step 3 of 8 • Section B
              </span>
              <span className="text-xs font-semibold text-slate-500">Unscored Financial Profile</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Investor Financial Profile Questionnaire (B1 – B9)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Exact source-document response formats: numeric values, amounts in INR, net-worth slabs, asset allocation percentages, and conditional loan/liquidity declarations.
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
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
            >
              Save & Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Financial profile successfully saved to your investor record.</span>
          </div>
        )}
      </div>

      {/* Questions B1 to B9 */}
      <div className="space-y-6">
        {/* B1: Numeric Input for Number of Dependents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                B1 • Number of Dependents
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                How many financial dependents rely on your income?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact format: Numeric integer input. Includes children, elderly parents, non-earning spouse.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              Numeric Input
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                type="button"
                onClick={() => setDependentsNum(Math.max(0, dependentsNum - 1))}
                className="p-3 text-slate-600 hover:bg-slate-100 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="0"
                max="20"
                value={dependentsNum}
                onChange={(e) => setDependentsNum(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-16 text-center font-bold text-base text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setDependentsNum(dependentsNum + 1)}
                className="p-3 text-slate-600 hover:bg-slate-100 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2 text-xs">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDependentsNum(num)}
                  className={`px-3 py-1.5 rounded-lg border transition font-medium ${
                    dependentsNum === num
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {num === 4 ? '4+ dependents' : `${num} ${num === 1 ? 'dependent' : 'dependents'}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* B2: The Five Specified Net-Worth Slabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                B2 • Net Worth Slabs
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                What is your estimated total net worth (excluding your primary residence)?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact format: The five specified net-worth slabs.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              5 Specified Slabs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              'Below ₹25 Lakhs',
              '₹25 Lakhs to ₹1 Crore',
              '₹1 Crore to ₹5 Crores',
              '₹5 Crores to ₹15 Crores',
              'Above ₹15 Crores',
            ].map((slab) => (
              <label
                key={slab}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition text-xs ${
                  netWorth === slab
                    ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-900 ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="netWorth"
                  value={slab}
                  checked={netWorth === slab}
                  onChange={() => setNetWorth(slab)}
                  className="text-blue-600"
                />
                <span>{slab}</span>
              </label>
            ))}
          </div>
        </div>

        {/* B3 & B4: Monthly Investment in INR & Lump-Sum in INR or No */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* B3: Monthly Investment Amount in INR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  B3 • Monthly Investment Amount (INR)
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Monthly surplus available for regular investment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exact format: Monthly investment amount in INR.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 50000"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[10000, 25000, 50000, 100000, 250000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMonthlyAmount(val)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    ₹{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* B4: Lump-Sum Amount in INR or No */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  B4 • Lump-Sum Capacity
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Lump-sum amount available for deployment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exact format: Lump-sum amount in INR or No.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hasLumpSum"
                    checked={!hasLumpSum}
                    onChange={() => setHasLumpSum(false)}
                    className="text-blue-600"
                  />
                  <span>No (Zero lump sum)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hasLumpSum"
                    checked={hasLumpSum}
                    onChange={() => setHasLumpSum(true)}
                    className="text-blue-600"
                  />
                  <span>Yes, amount available</span>
                </label>
              </div>

              {hasLumpSum && (
                <div className="relative animate-in fade-in">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="50000"
                    min="0"
                    value={lumpSumAmount}
                    onChange={(e) => setLumpSumAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 1000000"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* B5: Multi-Select Existing Asset Categories with Percentage of Total Savings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                B5 • Existing Portfolio Asset Categories & Percentages
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Which asset categories do you hold, and approximate percentage of total savings?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact format: Multi-select existing asset categories, with approximate percentage of total savings captured.
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">Total Allocation:</span>{' '}
              <strong className={totalPercentage === 100 ? 'text-emerald-600' : 'text-blue-600'}>
                {totalPercentage}%
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            {ASSET_CLASSES.map((asset) => {
              const isChecked = existingPortfolio.includes(asset);
              const isMarket = MARKET_ASSETS.includes(asset);
              return (
                <div
                  key={asset}
                  className={`p-3.5 rounded-xl border transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isChecked
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <label
                    onClick={() => handleToggleAsset(asset)}
                    className="flex items-center gap-3 cursor-pointer select-none flex-1"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded text-blue-600"
                    />
                    <div>
                      <span className="font-semibold text-slate-900">{asset}</span>
                      {isMarket && (
                        <span className="ml-2 text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                          Market Asset
                        </span>
                      )}
                    </div>
                  </label>

                  {isChecked && (
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span className="text-[11px] text-slate-500">Share of savings:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={assetPercentages[asset] ?? 0}
                        onChange={(e) => handlePercentageChange(asset, parseInt(e.target.value, 10) || 0)}
                        className="w-16 text-center font-bold text-xs bg-white border border-slate-300 rounded-lg p-1.5"
                      />
                      <span className="text-xs font-bold text-slate-600">%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* O6 Derived Exposure Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-600">
              Derived Market-Linked Exposure (Equities, Real Estate, Alternatives):{' '}
              <strong className={isOver50PercentInvested ? 'text-amber-700' : 'text-slate-800'}>
                {marketPercentage}%
              </strong>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isOver50PercentInvested
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {isOver50PercentInvested ? '>50% Savings in Market Assets' : '≤50% Market Exposure'}
            </span>
          </div>
        </div>

        {/* B6 & B7: Yes/No Loans with Total Monthly EMI & Exact Insurance (Term/Health/Both/Neither) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* B6: Yes/No Outstanding Loans, with Total Monthly EMI Amount */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                B6 • Loan & Debt Obligations
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Outstanding loans & debt liabilities
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact format: Yes/No outstanding loans, with total monthly EMI amount.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hasLoans"
                    checked={!hasLoans}
                    onChange={() => setHasLoans(false)}
                    className="text-blue-600"
                  />
                  <span>No outstanding loans</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="hasLoans"
                    checked={hasLoans}
                    onChange={() => setHasLoans(true)}
                    className="text-blue-600"
                  />
                  <span>Yes, active loans</span>
                </label>
              </div>

              {hasLoans && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="block text-[11px] font-semibold text-slate-700">
                    Total Monthly EMI Amount (INR):
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="2000"
                      min="0"
                      value={monthlyEmi}
                      onChange={(e) => setMonthlyEmi(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 35000"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* B7: Term Life / Health / Both / Neither */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                B7 • Insurance Coverage
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Adequate personal insurance coverage
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact format: Term life / Health / Both / Neither.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['Term life', 'Health', 'Both', 'Neither'] as const).map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    insuranceStatus === opt
                      ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900 ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="insuranceStatus"
                    value={opt}
                    checked={insuranceStatus === opt}
                    onChange={() => setInsuranceStatus(opt)}
                    className="text-blue-600"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* B8: Yes with description / No */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              B8 • Expected Income / Expense Changes (1–3 Years)
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              Do you anticipate significant life events or major income/expense changes?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact format: Yes with description / No.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="radio"
                  name="hasChanges"
                  checked={!hasChanges}
                  onChange={() => setHasChanges(false)}
                  className="text-blue-600"
                />
                <span>No major changes anticipated</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="radio"
                  name="hasChanges"
                  checked={hasChanges}
                  onChange={() => setHasChanges(true)}
                  className="text-blue-600"
                />
                <span>Yes, anticipating major life event / cashflow changes</span>
              </label>
            </div>

            {hasChanges && (
              <div className="animate-in fade-in space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Describe anticipated life event, income transition, or major planned expense:
                </label>
                <textarea
                  rows={2}
                  value={changesDesc}
                  onChange={(e) => setChangesDesc(e.target.value)}
                  placeholder="e.g. Planning child's international university education in 2028; expecting business dividend payout in Q3..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* B9: Yes / No for possibility of withdrawing most of the money within 12 months (Triggers O2) */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-xs space-y-4 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  B9 • 12-Month Liquidity Requirement
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  Affects Override O2
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Is there any possibility of withdrawing most of the money within 12 months?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Exact format: Yes / No for the possibility of withdrawing most of the money within 12 months.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="radio"
                  name="neededWithin12Months"
                  checked={neededWithin12Months === 'No'}
                  onChange={() => setNeededWithin12Months('No')}
                  className="text-blue-600"
                />
                <span>No, money is intended for medium-to-long term compounding</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="radio"
                  name="neededWithin12Months"
                  checked={neededWithin12Months === 'Yes'}
                  onChange={() => setNeededWithin12Months('Yes')}
                  className="text-blue-600"
                />
                <span>Yes, possibility of withdrawing money within 12 months</span>
              </label>
            </div>

            {neededWithin12Months === 'Yes' && (
              <div className="mt-3 p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-800">
                  Specify estimated withdrawal amount or percentage needed within 12 months:
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹25 Lakhs for home renovation / partial fee payment"
                  value={neededAmount}
                  onChange={(e) => setNeededAmount(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">
                  Note: In accordance with Override O2, the profile is capped at Conservative for the amount likely to be withdrawn (pending operational policy approval).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Submit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
        >
          Save Progress
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
        >
          <span>Confirm & Continue to Investment Goals</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
