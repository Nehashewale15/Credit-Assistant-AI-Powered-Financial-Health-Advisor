import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { TrendingUp, History } from 'lucide-react';
import type { ScoreHistoryItem } from '../types';

interface ScoreChartProps {
  history: ScoreHistoryItem[];
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-slate-800 font-semibold text-base mb-1">No Historical Score Entries</h4>
        <p className="text-slate-500 text-xs max-w-sm">
          Complete your initial profile setup to record your first credit score snapshot. Updates over time will populate this line chart.
        </p>
      </div>
    );
  }

  if (history.length === 1) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
          1 Entry Recorded ({history[0].date})
        </span>
        <h4 className="text-slate-800 font-bold text-lg mb-1">
          Current Score: {history[0].score}
        </h4>
        <p className="text-slate-500 text-xs max-w-md">
          You currently have 1 recorded snapshot. Update your financial profile whenever your debt or income changes to plot progress over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Credit Score Progress</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical trend of user-reported scores across recorded database snapshots
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {history.length} Snapshots
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis domain={[300, 900]} stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                color: '#fff',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
              formatter={(val: any) => [`${val} Points`, 'Credit Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#3730a3' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
