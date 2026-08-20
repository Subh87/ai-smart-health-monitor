import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { AlertTriangle, Bell, Info, ShieldAlert, RefreshCw } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, refreshData } = useHealthData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Educational Alerts System</h1>
          <p className="text-xs text-slate-400">Threshold-based flags for measurement rechecking</p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <DisclaimerBanner />

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <Bell className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white font-outfit">No Threshold Alerts Flagged</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              All recent physiological readings are within normal threshold parameters.
            </p>
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`glass-card p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                alt.status === 'WARNING'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-xl ${alt.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400' : 'bg-teal-500/10 text-teal-400'}`}>
                  {alt.status === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-outfit">{alt.type} Flag</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      Threshold: {alt.threshold}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] font-mono text-slate-400 block">
                  {new Date(alt.createdAt).toLocaleString()}
                </span>
                <span className="text-[10px] text-teal-400 font-semibold block mt-1">
                  Instruction: Re-verify in 5 mins
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
