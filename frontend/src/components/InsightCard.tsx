import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import type { InsightItem } from '../types';

interface InsightCardProps {
  insight: InsightItem;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIconAndStyle = () => {
    switch (insight.severity) {
      case 'critical':
        return {
          icon: AlertTriangle,
          cardBorder: 'border-rose-200 bg-rose-50/30',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          iconBg: 'bg-rose-100 text-rose-600',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          cardBorder: 'border-amber-200 bg-amber-50/30',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          iconBg: 'bg-amber-100 text-amber-600',
        };
      default:
        return {
          icon: CheckCircle,
          cardBorder: 'border-emerald-200 bg-emerald-50/30',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          iconBg: 'bg-emerald-100 text-emerald-600',
        };
    }
  };

  const { icon: Icon, cardBorder, badgeBg, iconBg } = getIconAndStyle();

  return (
    <div className={`rounded-2xl p-5 border ${cardBorder} bg-white shadow-xs space-y-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">{insight.title}</h4>
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badgeBg}`}>
          {insight.severity}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Why it matters:</span>
          <p className="text-slate-700 mt-0.5">{insight.why_it_matters}</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Observation:</span>
          <p className="text-slate-800 font-medium mt-0.5">{insight.simple_explanation}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-start space-x-2 text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border-indigo-100">
        <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-indigo-700 block uppercase tracking-wide">Suggested Educational Action:</span>
          <p className="text-xs text-indigo-900 font-medium mt-0.5">{insight.suggested_action}</p>
        </div>
      </div>
    </div>
  );
};
