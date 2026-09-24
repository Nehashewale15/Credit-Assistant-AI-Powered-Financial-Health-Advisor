import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, CreditCard } from 'lucide-react';
import type { UtilizationBreakdown } from '../types';

interface UtilizationChartProps {
  breakdown?: UtilizationBreakdown;
}

export const UtilizationChart: React.FC<UtilizationChartProps> = ({ breakdown }) => {
  if (!breakdown || breakdown.credit_limit <= 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="text-slate-800 font-semibold text-base mb-1">No Credit Limit Set</h4>
        <p className="text-slate-500 text-xs max-w-xs">
          Provide your total revolving credit card limit to visualize your credit utilization breakdown.
        </p>
      </div>
    );
  }

  const used = breakdown.used_credit;
  const available = breakdown.available_credit;
  const utilizationPct = breakdown.utilization_percentage;

  const data = [
    { name: 'Used Credit', value: used, color: utilizationPct > 70 ? '#ef4444' : utilizationPct > 30 ? '#f59e0b' : '#3b82f6' },
    { name: 'Available Credit', value: available, color: '#10b981' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <span>Credit Utilization Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Revolving Credit Used vs Available Credit Limit
          </p>
        </div>
        <span
          className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
            utilizationPct > 70
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : utilizationPct > 30
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {utilizationPct}% Utilization
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-bold text-slate-400 uppercase">Limit</span>
            <span className="text-sm font-extrabold text-slate-800">
              ₹{(breakdown.credit_limit / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <span className="text-xs font-semibold text-slate-700">Used Credit</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 block">
                ₹{used.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">{utilizationPct}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs font-semibold text-slate-700">Available Credit</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 block">
                ₹{available.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {(100 - utilizationPct).toFixed(1)}% Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
