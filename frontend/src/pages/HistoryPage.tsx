import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { MultiTrendChart } from '../components/Charts/MultiTrendChart';
import { StatusBadge } from '../components/StatusBadge';
import { ReportExportModal } from '../components/ReportExportModal';
import { Download, Filter, FileText, Wifi } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { history, range, setRange, sseConnected } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredHistory = history.filter(
    (item) =>
      item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.createdAt.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Modal */}
      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit flex items-center gap-3">
            <span>Reading History Log</span>
            {sseConnected && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-normal animate-pulse">
                <Wifi className="w-3 h-3" /> Live SSE Stream
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400">Comprehensive dataset of recorded physiological parameters</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold transition-all shadow-md shadow-emerald-950/40"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Generate Health Report / PDF</span>
          </button>
        </div>
      </div>

      {/* Multi-Metric Comparison Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-outfit">Multi-Parametric Overlay Chart</h2>

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

        <MultiTrendChart data={history} />
      </div>

      {/* Filterable Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white font-outfit">Telemetry Log Entries ({filteredHistory.length})</h3>

          <div className="w-full sm:w-64 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search status or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Heart Rate</th>
                <th className="py-3 px-4">SpO2</th>
                <th className="py-3 px-4">Temperature</th>
                <th className="py-3 px-4">Educational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No historical telemetry entries recorded yet.
                  </td>
                </tr>
              ) : (
                filteredHistory.slice().reverse().map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-400">{item.heartRate} BPM</td>
                    <td className="py-3 px-4 font-bold text-teal-400">{item.spo2}%</td>
                    <td className="py-3 px-4 font-bold text-amber-400">{item.temperature}°C</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
