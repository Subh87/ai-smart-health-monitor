import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { Settings, User as UserIcon, Cpu, Brain, CheckCircle2, ShieldCheck, Moon, Sun } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateDeviceId } = useAuth();
  const [deviceIdInput, setDeviceIdInput] = useState(user?.deviceId || 'ESP32-HEALTH-001');
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [checkingApi, setCheckingApi] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeviceId(deviceIdInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testApiConnection = async () => {
    setCheckingApi(true);
    try {
      const res = await apiClient.getHealth();
      setApiStatus(`Connected! Server DB: ${res.dbMode.toUpperCase()} | AI: ${res.aiConfigured ? 'Active' : 'Fallback Engine'}`);
    } catch (error) {
      setApiStatus('API Server connection failed. Check backend server on port 5000.');
    } finally {
      setCheckingApi(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">Platform Settings</h1>
        <p className="text-xs text-slate-400">Configure profile, device mapping, API connectivity, and threshold limits</p>
      </div>

      {/* User Profile Tile */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-teal-400" />
          <span>User Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Name</span>
            <span className="font-semibold text-white">{user?.name || 'Demo User'}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Email</span>
            <span className="font-semibold text-white">{user?.email || 'demo@healthmonitor.local'}</span>
          </div>
        </div>
      </div>

      {/* Device ID Settings */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <Cpu className="w-4 h-4 text-teal-400" />
          <span>ESP32 Device Identifier</span>
        </h2>

        <form onSubmit={handleSaveDevice} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Target Device ID</label>
            <input
              type="text"
              value={deviceIdInput}
              onChange={(e) => setDeviceIdInput(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Save Device ID
            </button>
            {saved && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* API Connectivity Check */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Backend API & AI Service Diagnostics</span>
        </h2>

        <div className="space-y-3">
          <button
            type="button"
            onClick={testApiConnection}
            disabled={checkingApi}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-white transition-colors"
          >
            {checkingApi ? 'Testing Connection...' : 'Test Backend Connection'}
          </button>

          {apiStatus && (
            <p className={`text-xs p-3 rounded-xl border ${
              apiStatus.startsWith('Connected')
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}>
              {apiStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
