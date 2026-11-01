/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Save,
  ShieldAlert,
} from 'lucide-react';
import { QUESTION_BANK } from '../../data/questionBank';
import { Investor, RiskCalculationResult } from '../../types/investor';
import { calculateRiskProfile } from '../../utils/riskCalculation';
import { StatusBadge } from '../common/StatusBadge';

interface RiskAssessmentViewProps {
  investor: Investor;
  onSaveAnswers: (answers: Record<string, number>) => void;
  onComplete: () => void;
}

export const RiskAssessmentView: React.FC<RiskAssessmentViewProps> = ({
  investor,
  onSaveAnswers,
  onComplete,
}) => {
  // Scored questions only: D1 to D12
  const riskQuestions = QUESTION_BANK.filter((q) => q.isScored);

  // User state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(
    investor.riskAnswers || {}
  );
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showInconsistencyWarning, setShowInconsistencyWarning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentQ = riskQuestions[currentIndex];
  const totalQuestions = riskQuestions.length;
  const currentAnswer = selectedAnswers[currentQ?.id];

  const handleSelectOption = (optionIndex: number) => {
    setValidationError(null);
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentAnswer === undefined || currentAnswer === null) {
      setValidationError('Please select an option before proceeding to the next question.');
      return;
    }
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished all 12 questions -> Go to review screen
      setIsReviewMode(true);
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    onSaveAnswers(selectedAnswers);
    alert('Progress saved. You can continue this assessment anytime.');
  };

  // Submit assessment
  const handleFinalSubmit = () => {
    // Check if any unanswered
    const unanswered = riskQuestions.filter((q) => selectedAnswers[q.id] === undefined);
    if (unanswered.length > 0) {
      setValidationError(
        `Please complete all 12 questions. Unanswered: ${unanswered.map((u) => u.code).join(', ')}`
      );
      setIsReviewMode(false);
      setCurrentIndex(riskQuestions.findIndex((q) => q.id === unanswered[0].id));
      return;
    }

    // Run risk calculation
    const result = calculateRiskProfile(selectedAnswers, investor.financialProfile);

    // If severe inconsistency, show warning once
    if (result.isInconsistent && !showInconsistencyWarning) {
      setShowInconsistencyWarning(true);
      return;
    }

    onSaveAnswers(selectedAnswers);
    onComplete();
  };

  const answeredCount = riskQuestions.filter((q) => selectedAnswers[q.id] !== undefined).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // ==========================================
  // REVIEW MODE SCREEN
  // ==========================================
  if (isReviewMode) {
    const previewResult = calculateRiskProfile(selectedAnswers, investor.financialProfile);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Step 5 of 8: Review & Confirm
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Investor Risk Assessment – Summary Review
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Verify your answers to all 12 Risk Capacity (D1–D6) and Risk Willingness (D7–D12) questions before final scoring.
              </p>
            </div>
            <button
              onClick={() => setIsReviewMode(false)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" /> Edit Answers
            </button>
          </div>

          {/* Inconsistency banner if triggered */}
          {previewResult.isInconsistent && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-xs text-amber-800">
                  Divergence Noted Between Capacity & Willingness
                </div>
                <div className="text-xs text-amber-700 mt-0.5">
                  {previewResult.inconsistencyMessage} Per fiduciary rules, the lower of the two levels will determine your maximum risk tolerance.
                </div>
              </div>
            </div>
          )}

          {/* Answers Grid */}
          <div className="mt-6 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Submitted Responses (12 Questions)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskQuestions.map((q, idx) => {
                const ansIdx = selectedAnswers[q.id];
                const opt = ansIdx !== undefined ? q.options[ansIdx] : null;

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsReviewMode(false);
                    }}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                        {q.code} • {q.section}
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-blue-600 font-medium">
                        Click to change
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 line-clamp-2">
                      {q.wording}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{opt ? opt.text : <span className="text-rose-500 font-normal">Not answered</span>}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setIsReviewMode(false);
              }}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2"
            >
              Back to Question 1
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleSaveDraft}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <Save className="w-4 h-4" /> Save Draft
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
              >
                <Sparkles className="w-4 h-4" /> Calculate Risk Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // SINGLE-QUESTION INTERACTIVE VIEW
  // ==========================================
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">
              Section: <strong className="text-blue-700">{currentQ.section}</strong>
            </span>
          </div>
          <span className="font-semibold text-slate-600">
            {answeredCount} of {totalQuestions} Answered ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Category Pill */}
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
            <span>{currentQ.code}:</span> {currentQ.category}
          </span>
          <button
            onClick={() => setIsReviewMode(true)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Review all 12 answers
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Question Text */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <span>{currentQ.code}</span>
            <span>•</span>
            <span>{currentQ.section}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQ.wording}
          </h2>
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{currentQ.helpText}</span>
          </div>
        </div>

        {/* Validation error if tried to advance without answer */}
        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 5 Answer Options (No scores shown to customer as per document requirement) */}
        <div className="mt-6 space-y-3">
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = currentAnswer === optIndex;
            return (
              <label
                key={optIndex}
                onClick={() => handleSelectOption(optIndex)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-950 font-medium'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="flex-1 text-sm leading-relaxed">
                  {opt.text}
                </div>
              </label>
            );
          })}
        </div>

        {/* Navigation & Controls */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
              currentIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              <Save className="w-4 h-4" /> Save & Exit
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Review Answers' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
