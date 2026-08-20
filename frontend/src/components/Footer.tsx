import React from 'react';
import { HeartPulse, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-teal-400" />
          <span className="font-semibold text-slate-300">AI Smart Health Monitor</span>
          <span>&bull; Educational IoT Prototype</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-slate-400" /> ESP32 MAX30102</span>
          <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-teal-400" /> Google Gemini AI</span>
        </div>

        <div className="text-slate-500 text-center md:text-right">
          <span>Not for clinical diagnosis &bull; viva-ready engineering demonstration</span>
        </div>
      </div>
    </footer>
  );
};
