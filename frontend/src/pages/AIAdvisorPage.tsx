import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import type { AIAnalysis } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AIAdvisorPanel } from '../components/AIAdvisorPanel';
import { AIChatPanel } from '../components/AIChatPanel';

export const AIAdvisorPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalysis = async (forceRefresh: boolean = false) => {
    setLoading(true);
    try {
      const res = await api.getAIAnalysis(forceRefresh);
      setAnalysis(res);
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-955 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Google Gemini AI Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Credit Advisor & Guidance Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Personalized 5-step educational action plans and interactive Q&A based on your submitted metrics.
            </p>
          </div>

          <button
            onClick={() => fetchAnalysis(true)}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Generate New Analysis</span>
          </button>
        </div>

        {/* 2 Column Layout: Left = AI Assessment, Right = Interactive Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7">
            <AIAdvisorPanel
              analysis={analysis}
              isLoading={loading}
              onRefresh={() => fetchAnalysis(true)}
            />
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <AIChatPanel />
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
