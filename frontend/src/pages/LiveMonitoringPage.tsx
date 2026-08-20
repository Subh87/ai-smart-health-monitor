import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { StatusBadge } from '../components/StatusBadge';
import { HeartPulse, Activity, Thermometer, Radio, Zap, RefreshCw } from 'lucide-react';

export const LiveMonitoringPage: React.FC = () => {
  const { latestReading, deviceStatus, refreshData, loading } = useHealthData();

  const heartRate = latestReading?.heartRate ?? 74;
  const spo2 = latestReading?.spo2 ?? 98;
  const temperature = latestReading?.temperature ?? 36.6;
  const status = latestReading?.status ?? 'NORMAL';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Live Telemetry Stream</h1>
          <p className="text-xs text-slate-400">Continuous optical pulse & temperature monitoring feed</p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <DisclaimerBanner />

      {/* PPG Waveform Animation Simulation */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500 animate-pulse" />
            <span className="text-sm font-bold text-white font-outfit">PPG Pulse Waveform (MAX30102 Optical Stream)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-400">STREAM ACTIVE</span>
          </div>
        </div>

        {/* Animated Simulated Wave Canvas */}
        <div className="h-32 bg-slate-950 rounded-xl border border-slate-800/80 p-4 relative overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <svg className="w-full h-full text-rose-500 stroke-current fill-none stroke-2" viewBox="0 0 500 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,50 35,50 T45,10 T55,90 T65,50 T100,50 Q125,50 135,50 T145,10 T155,90 T165,50 T200,50 Q225,50 235,50 T245,10 T255,90 T265,50 T300,50 Q325,50 335,50 T345,10 T355,90 T365,50 T400,50 Q425,50 435,50 T445,10 T455,90 T465,50 T500,50">
              <animateTransform attributeName="transform" type="translate" from="0,0" to="-200,0" dur="2s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      </div>

      {/* Live Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* HR Dial */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Heart Rate Gauge</span>
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center rounded-full border-4 border-rose-500/20 bg-rose-500/5 glow-rose">
            <div className="text-center space-y-1">
              <HeartPulse className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
              <span className="text-4xl font-extrabold text-white font-outfit block">{heartRate}</span>
              <span className="text-xs text-rose-300 font-semibold">BPM</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Target Range: 50 – 100 BPM</p>
        </div>

        {/* SpO2 Dial */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SpO2 Oxygen Gauge</span>
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center rounded-full border-4 border-teal-500/20 bg-teal-500/5 glow-teal">
            <div className="text-center space-y-1">
              <Activity className="w-8 h-8 text-teal-400 mx-auto" />
              <span className="text-4xl font-extrabold text-white font-outfit block">{spo2}</span>
              <span className="text-xs text-teal-300 font-semibold">% Saturation</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Target Range: 95 – 100%</p>
        </div>

        {/* Temp Dial */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Body Temperature Gauge</span>
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center rounded-full border-4 border-amber-500/20 bg-amber-500/5 glow-amber">
            <div className="text-center space-y-1">
              <Thermometer className="w-8 h-8 text-amber-400 mx-auto" />
              <span className="text-4xl font-extrabold text-white font-outfit block">{temperature}</span>
              <span className="text-xs text-amber-300 font-semibold">°Celsius</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Target Range: 36.0 – 37.5°C</p>
        </div>

      </div>
    </div>
  );
};
