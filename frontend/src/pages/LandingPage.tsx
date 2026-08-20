import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Brain,
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-teal-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <DisclaimerBanner />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>ESP32 IoT & Google Gemini AI Integration</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-outfit leading-tight">
            AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">Smart Health Monitoring</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            An ESP32-based IoT health monitor with real-time analytics, pulse oximetry, digital thermometry, and AI-powered non-diagnostic health insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ai-assistant"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold bg-slate-900 border border-slate-700 hover:border-slate-500 text-white flex items-center justify-center gap-2 transition-all hover:bg-slate-800"
            >
              <Brain className="w-4 h-4 text-teal-400" />
              <span>Ask AI Health Assistant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Full-Stack IoT Platform Architecture</h2>
          <p className="text-slate-400 text-sm mt-2">Designed for educational rigor, viva presentations, and real-time responsiveness</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-outfit">1. ESP32 Sensor Edge</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrates MAX30102 PPG optical sensor (Heart Rate & SpO2), DS18B20 digital temperature probe, and 0.96" SSD1306 OLED with Wi-Fi HTTP POST scheduler.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-outfit">2. Node.js & DB Backend</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Express TypeScript REST API validating sensor bounds, calculating educational statuses (NORMAL / ATTENTION), storing history in PostgreSQL with SQLite fallback.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-outfit">3. Google Gemini AI</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Isolated backend service calling Gemini API for non-diagnostic reading explanations, safety guidance, interactive chat Q&A, and doctor discussion questions.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Badges */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Powered By Modern Engineering Stack</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-semibold text-slate-300">
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"><Cpu className="w-4 h-4 text-rose-400" /> ESP32 C++</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"><Activity className="w-4 h-4 text-teal-400" /> React 18 & Vite</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-cyan-400" /> Recharts</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Express & Node.js</span>
            <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"><Brain className="w-4 h-4 text-emerald-400" /> Google Gemini API</span>
          </div>
        </div>
      </section>
    </div>
  );
};
