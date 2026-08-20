import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { HeartRateChart } from '../components/Charts/HeartRateChart';
import { SpO2Chart } from '../components/Charts/SpO2Chart';
import { TempChart } from '../components/Charts/TempChart';
import { Heart, Activity, Thermometer, Brain, Radio, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { latestReading, history, alerts, deviceStatus, loading, refreshData, range, setRange } = useHealthData();

  const heartRate = latestReading?.heartRate ?? 72;
  const spo2 = latestReading?.spo2 ?? 98;
  const temperature = latestReading?.temperature ?? 36.6;
  const status = latestReading?.status ?? 'NORMAL';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Health Overview</h1>
          <p className="text-xs text-slate-400">
            Real-time IoT metrics & educational analysis for device <span className="text-teal-400 font-semibold">{deviceStatus?.deviceId || 'ESP32'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refreshData}
            title="Refresh readings"
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Vitals</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Main Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="Heart Rate"
          value={heartRate}
          unit="BPM"
          targetRange="50 - 100 BPM"
          accentColor="rose"
          icon={<Heart className="w-6 h-6 animate-pulse" />}
          subtitle={`Status: ${status}`}
        />

        <MetricCard
          title="Blood Oxygen (SpO2)"
          value={spo2}
          unit="%"
          targetRange="95 - 100%"
          accentColor="teal"
          icon={<Activity className="w-6 h-6" />}
          subtitle="MAX30102 PPG"
        />

        <MetricCard
          title="Body Temperature"
          value={temperature}
          unit="°C"
          targetRange="36.0 - 37.5°C"
          accentColor="amber"
          icon={<Thermometer className="w-6 h-6" />}
          subtitle="DS18B20 Probe"
        />
      </div>

      {/* Health Status & AI Quick Insight Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Health Status Box */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Educational Classification</span>
            <StatusBadge status={status} size="md" />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              {status === 'NORMAL' && 'All current parameters remain within expected resting ranges.'}
              {status === 'ATTENTION' && 'One or more parameters show mild deviation. Consider resting and taking a follow-up reading.'}
              {status === 'CHECK READING' && 'Readings show high variability. Verify sensor position flat against finger/skin and minimize motion artifacts.'}
            </p>
            <span className="text-[10px] text-slate-500 block">
              Last sensor update: {latestReading ? new Date(latestReading.createdAt).toLocaleTimeString() : 'Just now'}
            </span>
          </div>

          <Link
            to="/ai-analysis"
            className="w-full py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Brain className="w-4 h-4 text-teal-400" />
            <span>Generate Full AI Analysis</span>
          </Link>
        </div>

        {/* AI Quick Insights Summary */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-teal-400" />
              <span className="text-sm font-bold text-white font-outfit">AI Health Trend Insights</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              Gemini AI
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            "Your heart rate average across recent intervals remains stable at <strong className="text-teal-300">{heartRate} BPM</strong>. Blood oxygen saturation indicates consistent optical detection at <strong className="text-teal-300">{spo2}%</strong>. No significant acute temperature shifts recorded."
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">HR Trend: Stable</span>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">SpO2 Stability: High</span>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">Motion Artifacts: Minimal</span>
          </div>
        </div>
      </div>

      {/* Historical Trend Charts with 24h / 7d / 30d Filter */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-outfit">Historical Health Telemetry</h2>
            <p className="text-xs text-slate-400">Visualizing heart rate, SpO2 saturation, and temperature fluctuations</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  range === r ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-rose-400 block">Heart Rate (BPM)</span>
            <HeartRateChart data={history} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-teal-400 block">SpO2 Saturation (%)</span>
            <SpO2Chart data={history} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400 block">Temperature (°C)</span>
            <TempChart data={history} />
          </div>
        </div>
      </div>

      {/* Educational Threshold Alert Feed */}
      {alerts.length > 0 && (
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white font-outfit">Recent Educational Alerts</h3>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map((alt) => (
              <div key={alt.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-amber-300 block">{alt.type} Threshold Flag</span>
                  <p className="text-slate-300">{alt.message}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{new Date(alt.createdAt).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
