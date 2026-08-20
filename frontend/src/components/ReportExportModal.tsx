import React from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { apiClient } from '../services/apiClient';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ isOpen, onClose }) => {
  const { history, alerts, latestReading, range } = useHealthData();

  if (!isOpen) return null;

  const totalReadings = history.length;
  const avgHeartRate = totalReadings > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.heartRate, 0) / totalReadings) : 0;
  const avgSpo2 = totalReadings > 0 ? (history.reduce((acc, curr) => acc + curr.spo2, 0) / totalReadings).toFixed(1) : 0;
  const avgTemp = totalReadings > 0 ? (history.reduce((acc, curr) => acc + curr.temperature, 0) / totalReadings).toFixed(1) : 0;

  const handleDownloadCsv = () => {
    const csvUrl = apiClient.getExportCsvUrl(latestReading?.deviceId, range);
    window.open(csvUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-6 text-slate-100 print:bg-white print:text-black print:p-0 print:shadow-none print:w-full">
        
        {/* Header (Hidden when printing or styled nicely) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 print:border-black">
          <div>
            <h2 className="text-xl font-bold text-emerald-400 print:text-black flex items-center gap-2">
              📋 Educational Health Telemetry Summary Report
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">Generated on {new Date().toLocaleString()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 print:hidden"
          >
            ✕
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs print:bg-amber-50 print:text-amber-900 print:border-amber-300">
          <strong>⚠️ EDUCATIONAL DISCLAIMER:</strong> This summary report is produced by an educational IoT prototype system and is <strong>NOT a medical diagnostic document</strong>. Always consult a licensed healthcare professional for clinical decisions.
        </div>

        {/* Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-400 print:text-slate-600">Total Telemetry Samples</span>
            <p className="text-2xl font-bold text-white print:text-black">{totalReadings}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-400 print:text-slate-600">Avg Heart Rate</span>
            <p className="text-2xl font-bold text-rose-400 print:text-rose-700">{avgHeartRate} <span className="text-xs font-normal">BPM</span></p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-400 print:text-slate-600">Avg Oxygen Saturation</span>
            <p className="text-2xl font-bold text-cyan-400 print:text-cyan-700">{avgSpo2} <span className="text-xs font-normal">%</span></p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-xs text-slate-400 print:text-slate-600">Avg Body Temp</span>
            <p className="text-2xl font-bold text-amber-400 print:text-amber-700">{avgTemp} <span className="text-xs font-normal">°C</span></p>
          </div>
        </div>

        {/* Telemetry Log Excerpt */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-slate-200 print:text-black">Recent Telemetry Samples</h3>
          <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-slate-300">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/60 text-slate-300 print:bg-slate-100 print:text-black">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Heart Rate</th>
                  <th className="p-2.5">SpO2</th>
                  <th className="p-2.5">Temp</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {history.slice(0, 8).map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/30">
                    <td className="p-2.5 text-slate-400 print:text-slate-700">{new Date(record.createdAt).toLocaleString()}</td>
                    <td className="p-2.5 font-medium">{record.heartRate} BPM</td>
                    <td className="p-2.5 font-medium">{record.spo2}%</td>
                    <td className="p-2.5 font-medium">{record.temperature}°C</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        record.status === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800 print:hidden">
          <button
            onClick={handleDownloadCsv}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            📥 Download Raw CSV Log
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
          >
            🖨️ Save as PDF / Print Report
          </button>
        </div>

      </div>
    </div>
  );
};
