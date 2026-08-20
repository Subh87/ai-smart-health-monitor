export type HealthStatusType = 'NORMAL' | 'ATTENTION' | 'CHECK READING';

export interface ReadingRecord {
  id: string;
  deviceId: string;
  userId?: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  status: HealthStatusType;
  createdAt: string;
}

export interface ThresholdAlert {
  id: string;
  deviceId: string;
  userId?: string;
  type: 'HEART_RATE' | 'SPO2' | 'TEMPERATURE';
  value: number;
  threshold: string;
  status: 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
  createdAt: string;
}

export interface AIAnalysisResult {
  summary: string;
  explanations: string[];
  recheckRecommended: boolean;
  safetyGuidance: string;
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  deviceId: string;
}

export interface DeviceStatus {
  deviceId: string;
  isOnline: boolean;
  lastPing: string;
  rssi?: number;
  firmwareVersion?: string;
  demoMode?: boolean;
}
