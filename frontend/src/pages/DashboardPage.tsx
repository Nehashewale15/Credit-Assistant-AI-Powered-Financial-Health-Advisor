import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Percent,
  PieChart as PieIcon,
  IndianRupee,
  Sparkles,
  AlertCircle,
  Loader2,
  Edit3,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import type { DashboardData } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MetricCard } from '../components/MetricCard';
import { ScoreChart } from '../components/ScoreChart';
import { UtilizationChart } from '../components/UtilizationChart';
import { InsightCard } from '../components/InsightCard';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getDashboard();
        setData(res);
        if (!res.has_profile) {
          navigate('/profile-setup');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-xs font-semibold text-slate-500">Loading your financial dashboard...</span>
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
          <h3 className="text-lg font-bold text-slate-900">Dashboard Unavailable</h3>
          <p className="text-xs text-slate-500">{error || 'Could not fetch financial profile.'}</p>
          <Link
            to="/profile-setup"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-xs"
          >
            Setup Financial Profile
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getScoreBadge = (score?: number) => {
    if (!score) return { text: 'No Data', type: 'neutral' as const };
    if (score >= 750) return { text: 'Strong Track', type: 'success' as const };
    if (score >= 650) return { text: 'Moderate', type: 'warning' as const };
    return { text: 'Needs Attention', type: 'danger' as const };
  };

  const getUtilBadge = (util?: number) => {
    if (util === undefined) return { text: 'No Data', type: 'neutral' as const };
    if (util <= 30) return { text: 'Healthy (<30%)', type: 'success' as const };
    if (util <= 70) return { text: 'Moderate Utilization', type: 'warning' as const };
    return { text: 'High Utilization', type: 'danger' as const };
  };

  const getDtiBadge = (dti?: number) => {
    if (dti === undefined) return { text: 'No Data', type: 'neutral' as const };
    if (dti <= 35) return { text: 'Healthy (<35%)', type: 'success' as const };
    if (dti <= 50) return { text: 'Moderate EMI Burden', type: 'warning' as const };
    return { text: 'High DTI (>50%)', type: 'danger' as const };
  };

  const scoreBadge = getScoreBadge(data.credit_score);
  const utilBadge = getUtilBadge(data.utilization);
  const dtiBadge = getDtiBadge(data.dti);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
              Financial Overview & Metrics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {data.user_name}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Goal: <strong className="text-white font-semibold">{data.financial_goal}</strong>.
              {data.delta && data.delta.score_change !== 0 ? (
                <span className="ml-2 text-indigo-300">
                  Latest Score Change: <strong>{data.delta.score_change_text} pts</strong>
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile-setup"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Data</span>
            </Link>

            <Link
              to="/ai-advisor"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get AI Credit Analysis</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Credit Score"
            value={data.credit_score || 'N/A'}
            explanation="User-reported score (300-900 range)"
            icon={CreditCard}
            badgeText={scoreBadge.text}
            badgeType={scoreBadge.type}
          />

          <MetricCard
            title="Credit Utilization"
            value={data.utilization !== undefined ? `${data.utilization}%` : 'N/A'}
            explanation="Revolving card balance ÷ total credit limit"
            icon={Percent}
            badgeText={utilBadge.text}
            badgeType={utilBadge.type}
          />

          <MetricCard
            title="Debt-to-Income (DTI)"
            value={data.dti !== undefined ? `${data.dti}%` : 'N/A'}
            explanation="Monthly EMI payments ÷ gross monthly income"
            icon={PieIcon}
            badgeText={dtiBadge.text}
            badgeType={dtiBadge.type}
          />

          <MetricCard
            title="Monthly Debt (EMIs)"
            value={data.monthly_debt !== undefined ? `₹${data.monthly_debt.toLocaleString('en-IN')}` : 'N/A'}
            explanation="Total monthly fixed loan & card EMI commitments"
            icon={IndianRupee}
            badgeText="Fixed EMI"
            badgeType="neutral"
          />
        </div>

        {/* Charts Section: Line Chart & Donut Chart side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ScoreChart history={data.score_history} />
          <UtilizationChart breakdown={data.utilization_breakdown} />
        </div>

        {/* Bottlenecks & Insights Section ("Your Credit Health Insights") */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>Your Credit Health Insights</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically identified potential bottlenecks and observations based on your submitted metrics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Prompt section to AI Advisor */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Google Gemini Educational Advisor</span>
            </span>
            <h3 className="text-2xl font-bold tracking-tight">Need personalized 5-step financial guidance?</h3>
            <p className="text-xs text-indigo-200 max-w-xl">
              Let Google Gemini AI analyze your DTI, credit utilization, and debt structure to generate a customized 5-step action plan and answer interactive questions.
            </p>
          </div>

          <Link
            to="/ai-advisor"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
          >
            Open AI Advisor Panel →
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};
