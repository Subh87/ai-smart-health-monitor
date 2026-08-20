import React from 'react';
import { useDemoMode } from '../context/DemoModeContext';
import { Activity, Radio } from 'lucide-react';

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl shadow-inner">
      <button
        type="button"
        onClick={() => toggleDemoMode(false)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          !isDemoMode
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Radio className={`w-3.5 h-3.5 ${!isDemoMode ? 'text-emerald-400 animate-pulse' : ''}`} />
        <span>REAL DEVICE</span>
      </button>

      <button
        type="button"
        onClick={() => toggleDemoMode(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isDemoMode
            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Activity className={`w-3.5 h-3.5 ${isDemoMode ? 'text-teal-400 animate-spin' : ''}`} />
        <span>DEMO MODE</span>
      </button>
    </div>
  );
};
