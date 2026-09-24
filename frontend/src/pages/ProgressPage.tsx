import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, AlertCircle, Loader2, Info } from 'lucide-react';
import { api } from '../services/api';
import type { ProgressData } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ScoreChart } from '../components/ScoreChart';

export const ProgressPage: React.FC = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.getProgress();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold text-slate-500">Loading progress history...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500" />
          <h3 className="text-lg font-bold text-slate-900">Progress Data Unavailable</h3>
          <p className="text-xs text-slate-500">{error || 'Could not fetch history.'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const delta = data.delta;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <History className="w-4 h-4" />
              <span>Historical Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Progress & Snapshot Timeline
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Track how your self-reported credit score, DTI, and utilization evolve across financial updates.
            </p>
          </div>

          <Link
            to="/profile-setup"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start md:self-auto"
          >
            Record New Snapshot
          </Link>
        </div>

        {/* Delta Change Cards */}
        {delta && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Score Change Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Score Change</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {delta.score_change_text}
                </span>
                <span className="text-xs text-slate-400">pts</span>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                Current: <strong>{data.current_score}</strong>
              </p>
            </div>

            {/* Utilization Change Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilization Change</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {delta.utilization_change > 0 ? `+${delta.utilization_change}%` : `${delta.utilization_change}%`}
                </span>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                Current: <strong>{data.current_utilization}%</strong>
              </p>
            </div>

            {/* Debt Change Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">EMI Debt Change</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {delta.debt_change > 0 ? `+₹${delta.debt_change}` : `₹${delta.debt_change}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                Current: <strong>₹{data.current_debt?.toLocaleString('en-IN')}</strong>
              </p>
            </div>

          </div>
        )}

        {/* Score Chart */}
        <ScoreChart history={data.history} />

        {/* Detailed Snapshot Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Recorded Snapshot History</h3>
            <span className="text-xs text-slate-500 font-semibold">{data.snapshots_count} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Credit Score</th>
                  <th className="py-3 px-4">Utilization %</th>
                  <th className="py-3 px-4">DTI Ratio %</th>
                  <th className="py-3 px-4">Monthly Debt (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {data.history.map((snap) => (
                  <tr key={snap.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{snap.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        {snap.score}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{snap.utilization}%</td>
                    <td className="py-3.5 px-4 font-medium">{snap.dti}%</td>
                    <td className="py-3.5 px-4 font-medium">₹{snap.debt.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-400 border-t border-slate-100">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Disclaimer: Credit Assistant records historical user updates. The application does not claim to directly cause score variations or determine official bureau scores.
            </span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
