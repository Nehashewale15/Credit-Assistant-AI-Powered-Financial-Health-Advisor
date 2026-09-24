import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Save, AlertCircle, Loader2, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const GOAL_OPTIONS = [
  'Improve credit health',
  'Reduce debt',
  'Prepare for a future loan',
  'Build better financial habits',
  'General financial awareness'
];

export const ProfileSetupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [creditScore, setCreditScore] = useState<number>(650);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(40000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(15000);
  const [monthlyDebt, setMonthlyDebt] = useState<number>(10000);
  const [creditLimit, setCreditLimit] = useState<number>(100000);
  const [outstandingCredit, setOutstandingCredit] = useState<number>(60000);
  const [missedPayments, setMissedPayments] = useState<number>(0);
  const [financialGoal, setFinancialGoal] = useState<string>('Improve credit health');

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const data = await api.getProfile();
        if (data) {
          setIsEdit(true);
          setCreditScore(data.credit_score);
          setMonthlyIncome(data.monthly_income);
          setMonthlyExpenses(data.monthly_expenses);
          setMonthlyDebt(data.monthly_debt);
          setCreditLimit(data.credit_limit);
          setOutstandingCredit(data.outstanding_credit);
          setMissedPayments(data.missed_payments);
          setFinancialGoal(data.financial_goal || 'Improve credit health');
        }
      } catch {
        // No existing profile found (normal for first time setup)
        setIsEdit(false);
      } finally {
        setFetching(false);
      }
    };
    fetchExistingProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (creditScore < 300 || creditScore > 900) {
      setError('Credit score must be between 300 and 900.');
      return;
    }

    if (monthlyIncome <= 0) {
      setError('Monthly income must be greater than ₹0.');
      return;
    }

    setLoading(true);
    try {
      await api.saveProfile(
        {
          credit_score: Number(creditScore),
          monthly_income: Number(monthlyIncome),
          monthly_expenses: Number(monthlyExpenses),
          monthly_debt: Number(monthlyDebt),
          credit_limit: Number(creditLimit),
          outstanding_credit: Number(outstandingCredit),
          missed_payments: Number(missedPayments),
          financial_goal: financialGoal,
        },
        isEdit
      );
      // Navigate to Dashboard after successful submission
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save financial profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {isEdit ? 'Update Financial Profile' : 'Financial Profile Setup'}
                </h1>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Welcome {user?.name}. Provide your credit & debt details for automated calculations.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-800/80 flex items-start space-x-2 text-[11px] text-indigo-200">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> Credit Assistant tracks your user-reported financial figures to compute your Debt-to-Income (DTI) ratio and revolving utilization. It does not calculate official credit-bureau scores.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Credit Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                  1. Credit Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Credit Score (300 - 900)
                    </label>
                    <input
                      type="number"
                      min={300}
                      max={900}
                      value={creditScore}
                      onChange={(e) => setCreditScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Your existing self-reported score</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recent Missed Payments
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={missedPayments}
                      onChange={(e) => setMissedPayments(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Number of late/missed bill payments</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Credit Limit (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Combined limit across all cards</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Outstanding Credit Balance (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={outstandingCredit}
                      onChange={(e) => setOutstandingCredit(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Current used credit card balance</span>
                  </div>
                </div>
              </div>

              {/* Income & Obligations */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                  2. Income & Monthly EMI Obligations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Monthly Income (₹)
                    </label>
                    <input
                      type="number"
                      min={1000}
                      step={1000}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Monthly Debt / EMIs (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={monthlyDebt}
                      onChange={(e) => setMonthlyDebt(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Essential Expenses (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Financial Goal */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3">
                  3. Primary Financial Goal
                </h3>
                <div>
                  <select
                    value={financialGoal}
                    onChange={(e) => setFinancialGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    {GOAL_OPTIONS.map((g, idx) => (
                      <option key={idx} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {isEdit ? 'Saving creates a new historical progress snapshot.' : 'Saves profile and computes initial DTI ratio.'}
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isEdit ? 'Update & Record Snapshot' : 'Save & Calculate Metrics'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
