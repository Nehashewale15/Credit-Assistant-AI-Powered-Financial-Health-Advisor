import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>CREDIT ASSISTANT</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              An educational AI platform for tracking user-reported financial metrics, understanding debt ratios, and building healthier credit habits in India.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-1 text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <span>Educational & Bureau Disclaimer</span>
            </div>
            <p className="text-slate-300 leading-normal text-[11px]">
              Credit Assistant does <strong>NOT</strong> generate or calculate official CIBIL, Experian, or credit-bureau scores. All information is calculated from user-submitted metrics and provided solely for educational self-monitoring.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Privacy & Security Notice</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              This is an academic / NASSCOM AI project. Never enter highly sensitive authentication credentials such as banking PINs, net-banking passwords, CVV, or OTPs.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Credit Assistant. College / NASSCOM AI Project.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Educational Use Only</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
