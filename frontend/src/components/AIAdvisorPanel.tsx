import React from 'react';
import { Sparkles, CheckCircle2, ListOrdered, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import type { AIAnalysis } from '../types';

interface AIAdvisorPanelProps {
  analysis: AIAnalysis | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AIAdvisorPanel: React.FC<AIAdvisorPanelProps> = ({
  analysis,
  isLoading,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold text-lg">Analyzing your credit profile...</h4>
          <p className="text-slate-500 text-xs mt-1">
            Evaluating your debt-to-income ratio, revolving credit utilization, and generating personalized 5-step guidance using Google Gemini AI.
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-slate-900 font-bold text-lg">Get AI Credit Analysis</h4>
          <p className="text-slate-500 text-xs max-w-md mx-auto mt-1">
            Click below to generate a comprehensive educational assessment of your credit health powered by Google Gemini AI.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Assessment</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Google Gemini Educational Advisor</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">AI Credit Health Analysis</h3>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Section A: Current Credit Health Summary */}
      <div className="p-6 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1.5">
          <FileText className="w-4 h-4" />
          <span>A. Current Credit Health Summary</span>
        </h4>
        <p className="text-slate-800 text-sm leading-relaxed font-medium bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/60">
          {analysis.summary}
        </p>
      </div>

      {/* Section B: Key Factors */}
      <div className="p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>B. Key Factors to Monitor</span>
        </h4>
        <ul className="grid grid-cols-1 gap-2.5">
          {analysis.key_factors.map((factor, idx) => (
            <li key={idx} className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-800">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <span className="font-medium">{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section C: 5-Step Action Plan */}
      <div className="p-6 space-y-3 bg-slate-50/50">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1.5">
          <ListOrdered className="w-4 h-4" />
          <span>C. 5-Step Educational Action Plan</span>
        </h4>
        <div className="space-y-3">
          {analysis.action_plan.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {step.replace(/^Step \d+:\s*/i, '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Personalized Explanation & Disclaimer */}
      <div className="p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center space-x-1.5">
          <FileText className="w-4 h-4" />
          <span>D. Detailed Educational Explanation</span>
        </h4>
        <div className="text-slate-700 text-xs leading-relaxed whitespace-pre-line space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          {analysis.explanation}
        </div>

        <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-500">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            This AI output is provided for educational self-guidance. Credit Assistant does not calculate official CIBIL credit scores.
          </span>
        </div>
      </div>

    </div>
  );
};
