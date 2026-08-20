import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  HeartPulse,
  History,
  Brain,
  MessageSquareText,
  Bell,
  Cpu,
  Settings,
  Menu,
  X,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { DemoModeToggle } from './DemoModeToggle';
import { useAuth } from '../context/AuthContext';

export const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Activity className="w-4 h-4" /> },
  { label: 'Live Monitoring', path: '/live', icon: <HeartPulse className="w-4 h-4" /> },
  { label: 'History', path: '/history', icon: <History className="w-4 h-4" /> },
  { label: 'AI Analysis', path: '/ai-analysis', icon: <Brain className="w-4 h-4" /> },
  { label: 'AI Assistant', path: '/ai-assistant', icon: <MessageSquareText className="w-4 h-4" /> },
  { label: 'Alerts', path: '/alerts', icon: <Bell className="w-4 h-4" /> },
  { label: 'Device', path: '/device', icon: <Cpu className="w-4 h-4" /> },
  { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white font-outfit block">
                AI Smart<span className="text-teal-400">Health</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:block">
                ESP32 & Gemini AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Control Bar */}
          <div className="flex items-center gap-3">
            <DemoModeToggle />

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
                <div className="text-right">
                  <span className="text-xs font-semibold text-white block">{user?.name || 'User'}</span>
                  <span className="text-[10px] text-slate-400 block">{user?.deviceId || 'ESP32'}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{isAuthenticated ? `Logged in as ${user?.email}` : 'Not logged in'}</span>
            {isAuthenticated ? (
              <button type="button" onClick={logout} className="text-rose-400 hover:underline">
                Log out
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-teal-400 hover:underline">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
