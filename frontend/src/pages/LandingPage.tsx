import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>NASSCOM AI / College Project Platform</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              CREDIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">ASSISTANT</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-slate-200">
              Understand your credit health. Build better financial habits.
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              An AI-powered platform that helps you understand your credit profile, identify financial bottlenecks, and build a practical roadmap toward healthier credit habits in the Indian financial ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <button
                    onClick={handleDemo}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-base transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-amber-300" />
                    <span>Try Demo Mode (Aarav Sharma)</span>
                  </button>
                </>
              )}
            </div>

            <div className="pt-6 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated DTI & Utilization Calculations</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google Gemini 5-Step Action Plan</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Database Historical Progress Charts</span>
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Comprehensive Credit Health Features
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Everything you need to monitor, analyze, and optimize your financial metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Credit Health Dashboard</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Track your credit score, utilization ratio, debt-to-income (DTI) percentage, and total debt commitments with clean visual indicators.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. AI Financial Guidance</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Get personalized 5-step educational recommendations and interactive Q&A generated by Google Gemini AI tailored to your submitted data.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Progress Tracking</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Visualize changes in your credit score and debt metrics over time using Recharts line charts backed by actual database snapshots.
            </p>
          </div>

        </div>

        {/* Disclaimer Banner */}
        <div className="mt-12 bg-indigo-50/80 border border-indigo-100 rounded-2xl p-6 text-center max-w-3xl mx-auto">
          <p className="text-xs text-indigo-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600 inline mr-1 -mt-0.5" />
            <strong>Disclaimer:</strong> Credit Assistant provides educational information and does not determine official credit scores or provide regulated financial advice.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};
