import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, LayoutDashboard, UserCheck, TrendingUp, Sparkles, LogOut, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand Name */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
                CREDIT <span className="text-indigo-600">ASSISTANT</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5">
                AI Credit Health Platform
              </span>
            </div>
          </Link>

          {/* Navigation links for authenticated user */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/ai-advisor"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/ai-advisor')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Advisor</span>
              </Link>

              <Link
                to="/progress"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/progress')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Progress</span>
              </Link>

              <Link
                to="/profile-setup"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/profile-setup')
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </nav>
          ) : null}

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleDemo}
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                  title="Instantly seed and log in as Aarav Sharma"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-600" />
                  <span>Try Demo Mode</span>
                </button>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:block text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  👤 {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
