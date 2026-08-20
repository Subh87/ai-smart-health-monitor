import axios from 'axios';
import { ReadingRecord, ThresholdAlert, AIAnalysisResult, DeviceStatus, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Health check
  async getHealth() {
    const res = await api.get('/health');
    return res.data;
  },

  // Auth
  async register(data: { email: string; password: string; name: string; deviceId?: string }) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  // Readings
  async getLatestReading(deviceId?: string): Promise<{ reading: ReadingRecord }> {
    const res = await api.get('/readings/latest', { params: { deviceId } });
    return res.data;
  },

  async getHistory(deviceId?: string, range: '24h' | '7d' | '30d' = '24h', limit: number = 100): Promise<{ history: ReadingRecord[]; count: number }> {
    const res = await api.get('/readings/history', { params: { deviceId, range, limit } });
    return res.data;
  },

  async postReading(reading: { deviceId: string; heartRate: number; spo2: number; temperature: number }): Promise<{ success: boolean; data: ReadingRecord }> {
    const res = await api.post('/readings', reading);
    return res.data;
  },

  async getAlerts(deviceId?: string): Promise<{ alerts: ThresholdAlert[]; count: number }> {
    const res = await api.get('/alerts', { params: { deviceId } });
    return res.data;
  },

  getExportCsvUrl(deviceId?: string, range: string = '30d'): string {
    const token = localStorage.getItem('auth_token');
    return `${API_BASE_URL}/export/csv?range=${range}${deviceId ? `&deviceId=${deviceId}` : ''}${token ? `&token=${token}` : ''}`;
  },

  // AI Analytics & Chat (Google Gemini)
  async analyzeReadings(payload: { heartRate: number; spo2: number; temperature: number; symptoms?: string; deviceId?: string }): Promise<AIAnalysisResult> {
    const res = await api.post('/ai/analyze', payload);
    return res.data;
  },

  async chatAssistant(payload: { message: string; deviceId?: string }): Promise<{ reply: string; disclaimer: string }> {
    const res = await api.post('/ai/chat', payload);
    return res.data;
  },

  // Device & Demo Mode
  async getDeviceStatus(deviceId?: string): Promise<DeviceStatus> {
    const res = await api.get('/device/status', { params: { deviceId } });
    return res.data;
  },

  async toggleDemoMode(enable: boolean, deviceId?: string): Promise<{ success: boolean; demoMode: boolean; message: string }> {
    const res = await api.post('/demo/toggle', { enable, deviceId });
    return res.data;
  }
};
