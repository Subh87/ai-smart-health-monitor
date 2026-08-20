import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ReadingRecord, ThresholdAlert, DeviceStatus } from '../types';
import { apiClient } from '../services/apiClient';
import { useAuth } from './AuthContext';
import { useDemoMode } from './DemoModeContext';

interface HealthDataContextType {
  latestReading: ReadingRecord | null;
  history: ReadingRecord[];
  alerts: ThresholdAlert[];
  deviceStatus: DeviceStatus | null;
  loading: boolean;
  error: string | null;
  sseConnected: boolean;
  refreshData: () => Promise<void>;
  range: '24h' | '7d' | '30d';
  setRange: (r: '24h' | '7d' | '30d') => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();
  const deviceId = user?.deviceId || import.meta.env.VITE_DEFAULT_DEVICE_ID || 'ESP32-HEALTH-001';

  const [latestReading, setLatestReading] = useState<ReadingRecord | null>(null);
  const [history, setHistory] = useState<ReadingRecord[]>([]);
  const [alerts, setAlerts] = useState<ThresholdAlert[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>(null);
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState<boolean>(false);

  const fetchAll = useCallback(async () => {
    try {
      const [latestRes, historyRes, alertsRes, statusRes] = await Promise.allSettled([
        apiClient.getLatestReading(deviceId),
        apiClient.getHistory(deviceId, range, 100),
        apiClient.getAlerts(deviceId),
        apiClient.getDeviceStatus(deviceId)
      ]);

      if (latestRes.status === 'fulfilled') {
        setLatestReading(latestRes.value.reading);
      }
      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value.history);
      }
      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value.alerts);
      }
      if (statusRes.status === 'fulfilled') {
        setDeviceStatus(statusRes.value);
      }
      setError(null);
    } catch (err: any) {
      console.warn('Failed to fetch health data:', err);
      setError('Unable to sync with health backend server.');
    } finally {
      setLoading(false);
    }
  }, [deviceId, range]);

  // Establish SSE real-time telemetry stream connection
  useEffect(() => {
    const token = localStorage.getItem('health_auth_token');
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const sseUrl = `${backendUrl}/readings/stream${token ? `?token=${token}` : ''}`;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        setSseConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'READING_ADDED' && payload.reading) {
            setLatestReading(payload.reading);
            setHistory((prev) => [...prev, payload.reading]);
            if (payload.alerts && payload.alerts.length > 0) {
              setAlerts((prev) => [...payload.alerts, ...prev]);
            }
          }
        } catch (e) {
          // Parse error fallback
        }
      };

      eventSource.onerror = () => {
        setSseConnected(false);
        eventSource?.close();
      };
    } catch (e) {
      setSseConnected(false);
    }

    return () => {
      eventSource?.close();
    };
  }, [deviceId]);

  // Periodic polling fallback for live monitoring (every 4s demo / 8s live)
  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => {
      fetchAll();
    }, isDemoMode ? 4000 : 8000);

    return () => clearInterval(interval);
  }, [fetchAll, isDemoMode]);

  return (
    <HealthDataContext.Provider
      value={{
        latestReading,
        history,
        alerts,
        deviceStatus,
        loading,
        error,
        sseConnected,
        refreshData: fetchAll,
        range,
        setRange
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) throw new Error('useHealthData must be used within HealthDataProvider');
  return context;
};
