import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { Cpu, Radio, Wifi, ShieldCheck, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

export const DevicePage: React.FC = () => {
  const { deviceStatus, refreshData } = useHealthData();
  const [activeTab, setActiveTab] = useState<'status' | 'hardware'>('status');

  const isOnline = deviceStatus?.isOnline ?? false;
  const rssi = deviceStatus?.rssi ?? -65;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">ESP32 Hardware Management</h1>
          <p className="text-xs text-slate-400">Microcontroller status, RSSI signal, and physical wiring instructions</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'status' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Device Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hardware')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hardware' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hardware Wiring Guide
          </button>
        </div>
      </div>

      {activeTab === 'status' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hardware Specifications Tile */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Microcontroller Metadata</span>
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>ESP32 Wi-Fi / BLE</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs text-slate-300 py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Device Identifier</span>
                <span className="font-mono font-bold text-teal-400">{deviceStatus?.deviceId || 'ESP32-HEALTH-001'}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Firmware Architecture</span>
                <span className="font-mono text-slate-200">v1.0.0 (Arduino C++)</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Supported Telemetry</span>
                <span className="font-mono text-emerald-400">Heart Rate, SpO2, Temp</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 py-2">
                <span className="text-slate-400">Sampling Rate</span>
                <span className="font-mono text-slate-200">Real-time Stream / 5s Polling</span>
              </div>
            </div>
          </div>

          {/* Sensor Attachment Checklist */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-outfit">Sensor Hardware Checklist</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>MAX30102 PPG Optical Sensor</span>
                </div>
                <span className="text-slate-500 font-mono">I2C 0x57</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>DS18B20 Digital Thermometer</span>
                </div>
                <span className="text-slate-500 font-mono">GPIO 4</span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>0.96" SSD1306 OLED Display</span>
                </div>
                <span className="text-slate-500 font-mono">I2C 0x3C</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Hardware Wiring Guide Tab */
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-outfit">ESP32 Pin Connection Table</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Component Pin</th>
                  <th className="py-3 px-4">ESP32 Pin</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="py-3 px-4 font-bold text-white">MAX30102</td>
                  <td className="py-3 px-4">VCC, GND, SDA, SCL</td>
                  <td className="py-3 px-4 font-mono text-teal-400">3.3V, GND, GPIO 21, GPIO 22</td>
                  <td className="py-3 px-4 text-slate-400">Pulse Oximeter & HR (I2C)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">SSD1306 OLED</td>
                  <td className="py-3 px-4">VCC, GND, SDA, SCL</td>
                  <td className="py-3 px-4 font-mono text-teal-400">3.3V, GND, GPIO 21, GPIO 22</td>
                  <td className="py-3 px-4 text-slate-400">0.96" 128x64 Graphic Screen</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white">DS18B20</td>
                  <td className="py-3 px-4">VCC, GND, DATA</td>
                  <td className="py-3 px-4 font-mono text-amber-400">3.3V, GND, GPIO 4</td>
                  <td className="py-3 px-4 text-slate-400">Attach 4.7kΩ pull-up resistor between DATA and 3.3V</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
