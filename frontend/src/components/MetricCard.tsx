import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  explanation: string;
  icon: LucideIcon;
  badgeText: string;
  badgeType: 'neutral' | 'success' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  explanation,
  icon: Icon,
  badgeText,
  badgeType,
}) => {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 line-clamp-1 pr-2" title={explanation}>
          {explanation}
        </p>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${getBadgeStyle()}`}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
};
