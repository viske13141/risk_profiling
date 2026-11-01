/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Calendar,
  IndianRupee,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { InvestmentGoal, Investor } from '../../types/investor';

interface InvestmentGoalsViewProps {
  investor: Investor;
  onSaveGoals: (goals: InvestmentGoal[], preferences: { directPlan: 'Direct' | 'Regular' }) => void;
  onContinue: () => void;
}

export const InvestmentGoalsView: React.FC<InvestmentGoalsViewProps> = ({
  investor,
  onSaveGoals,
  onContinue,
}) => {
  const [goals, setGoals] = useState<InvestmentGoal[]>(
    investor.investmentGoals && investor.investmentGoals.length > 0
      ? investor.investmentGoals
      : [
          {
            id: 'GOAL-NEW-1',
            category: 'Wealth Creation',
            description: 'Long-term diversified wealth accumulation portfolio',
            targetAmount: 50000000,
            targetYear: 2035,
            priority: 'High',
            investmentApproach: 'Both',
            monthlyContribution: 100000,
          },
        ]
  );

  const [directPlanPreference, setDirectPlanPreference] = useState<'Direct' | 'Regular'>(
    investor.directPlanPreference || 'Direct'
  );

  const [advisoryPreference, setAdvisoryPreference] = useState<'Adviser-guided' | 'Self-managed'>(
    'Adviser-guided'
  );

  const [expectedReturn, setExpectedReturn] = useState('11% – 14% p.a. (Market-linked Indicative)');

  // New goal modal state
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<InvestmentGoal['category']>('Retirement');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState<number>(25000000);
  const [newYear, setNewYear] = useState<number>(2032);
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newApproach, setNewApproach] = useState<'SIP' | 'Lump Sum' | 'Both'>('SIP');

  const handleAddGoal = () => {
    if (!newDesc.trim()) return;
    const g: InvestmentGoal = {
      id: `GOAL-${Date.now()}`,
      category: newCategory,
      description: newDesc,
      targetAmount: Number(newAmount),
      targetYear: Number(newYear),
      priority: newPriority,
      investmentApproach: newApproach,
    };
    setGoals([...goals, g]);
    setIsAdding(false);
    setNewDesc('');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals(goals, { directPlan: directPlanPreference });
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Step 4 of 8
              </span>
              <span className="text-xs font-semibold text-slate-500">Goal Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Investor Goals & Execution Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Structure your financial milestones across retirement, education, wealth accumulation, and near-term capital objectives.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> Add Investment Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="mt-6 space-y-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                    {g.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : g.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {g.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400">• Approach: {g.investmentApproach}</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">{g.description}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Target Target</div>
                  <div className="text-sm font-bold text-slate-900">
                    ₹{(g.targetAmount / 100000).toLocaleString('en-IN')} Lakhs
                  </div>
                  <div className="text-[11px] text-slate-500">By Year {g.targetYear}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveGoal(g.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Drawer / Form */}
      {isAdding && (
        <div className="bg-white rounded-2xl border-2 border-blue-300 p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Add New Milestone Goal</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Goal Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              >
                {[
                  'Retirement',
                  'Education',
                  'Marriage',
                  'Home / Vehicle',
                  'Wealth Creation',
                  'Income',
                  'Tax Saving',
                  'Short-term Cash Parking',
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Year</label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Goal Description
              </label>
              <input
                type="text"
                placeholder="e.g. Higher education fund for son at Oxford"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Investment Approach
              </label>
              <select
                value={newApproach}
                onChange={(e) => setNewApproach(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
              >
                <option value="SIP">SIP (Monthly Recurring)</option>
                <option value="Lump Sum">Lump Sum (Single deployment)</option>
                <option value="Both">Both (SIP + Lump Sum)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddGoal}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Add Goal
            </button>
          </div>
        </div>
      )}

      {/* Execution & Investment Preferences Card - 6 Core Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">
            Part C.2: Investment Preferences & Execution Mandate
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Configure your execution mode, plan preference, return expectations, and portfolio constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preference 1: Primary Investment Approach */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              1. Primary Investment Approach
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['SIP', 'Lump Sum', 'Both'] as const).map((approach) => (
                <button
                  key={approach}
                  type="button"
                  onClick={() => setNewApproach(approach)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                    newApproach === approach
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {approach}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Select recurring systematic investment (SIP), one-time deployment, or blended.
            </p>
          </div>

          {/* Preference 2: Expected Annual Return */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              2. Expected Annual Return Expectation
            </label>
            <select
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800"
            >
              <option value="8% – 10% p.a. (Capital Preservation Focus)">8% – 10% p.a. (Capital Preservation Focus)</option>
              <option value="10% – 12% p.a. (Balanced Wealth Growth)">10% – 12% p.a. (Balanced Wealth Growth)</option>
              <option value="12% – 15% p.a. (Aggressive Equity Compounding)">12% – 15% p.a. (Aggressive Equity Compounding)</option>
              <option value="Above 15% p.a. (High Alpha / Volatility Seeking)">Above 15% p.a. (High Alpha / Volatility Seeking)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              *Market-linked indicative expectations. SEBI prohibits return guarantees.
            </p>
          </div>

          {/* Preference 3: Advisory Mode */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              3. Advisory Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="advisory"
                  checked={advisoryPreference === 'Adviser-guided'}
                  onChange={() => setAdvisoryPreference('Adviser-guided')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Adviser-Guided (Assisted Wealth Planning)</div>
                  <div className="text-slate-500 text-[11px]">
                    Periodic rebalancing reviews with SEBI Registered Investment Adviser.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="advisory"
                  checked={advisoryPreference === 'Self-managed'}
                  onChange={() => setAdvisoryPreference('Self-managed')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Self-Directed Execution</div>
                  <div className="text-slate-500 text-[11px]">
                    Execution-only mode based solely on your determined asset allocation.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preference 4: Direct vs Regular Plan Mandate */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              4. Direct vs Regular Plan Mandate
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="directPlan"
                  checked={directPlanPreference === 'Direct'}
                  onChange={() => setDirectPlanPreference('Direct')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Direct Plan (Zero Distributor Commission)</div>
                  <div className="text-slate-500 text-[11px]">
                    Lower expense ratio; fee paid directly to registered investment adviser.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="directPlan"
                  checked={directPlanPreference === 'Regular'}
                  onChange={() => setDirectPlanPreference('Regular')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Regular Plan (Distributor Commission Embedded)</div>
                  <div className="text-slate-500 text-[11px]">
                    Includes trail commissions paid by AMC to distributor/broker.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preference 5: Payout Preferences */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              5. Payout Preferences
            </label>
            <select
              defaultValue="Growth (Cumulative Compounding)"
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800"
            >
              <option value="Growth (Cumulative Compounding)">Growth (Cumulative Compounding)</option>
              <option value="IDCW - Payout (Periodic Income Distribution)">IDCW - Payout (Periodic Income Distribution)</option>
              <option value="IDCW - Reinvestment (Reinvested Distributions)">IDCW - Reinvestment (Reinvested Distributions)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Growth maximizes long-term compounding; IDCW pays periodic distributions.
            </p>
          </div>

          {/* Preference 6: Investment Restrictions & ESG */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              6. Investment Restrictions & ESG Preferences
            </label>
            <select
              defaultValue="Standard Portfolio (No Mandated Restrictions)"
              className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 font-medium text-slate-800"
            >
              <option value="Standard Portfolio (No Mandated Restrictions)">Standard Portfolio (No Mandated Restrictions)</option>
              <option value="ESG Focused (Environmental, Social & Governance)">ESG Focused (Environmental, Social & Governance)</option>
              <option value="Exclusion Screens (Exclude Tobacco, Alcohol, Gambling)">Exclusion Screens (Exclude Tobacco, Alcohol, Gambling)</option>
              <option value="Liquidity Prioritized (Minimal Lock-in / Open-ended Only)">Liquidity Prioritized (Minimal Lock-in / Open-ended Only)</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Apply ethical exclusions, ESG screening, or liquidity-first mandates.
            </p>
          </div>
        </div>

        {/* Regulatory Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-start gap-2.5 border border-slate-200">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Disclosure:</strong> Mutual fund investments and capital market portfolios are subject to market risks.
            Indicative growth rates and target projections do not represent guaranteed or assured returns.
          </span>
        </div>
      </div>

      {/* Footer Submit */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-xs">
        <span className="text-xs text-slate-500">
          Next step: Scored 12-Question Risk Questionnaire (D1–D12)
        </span>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
        >
          <span>Save Goals & Proceed to Risk Assessment</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
