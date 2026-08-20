import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HealthDataProvider } from './context/HealthDataContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { HistoryPage } from './pages/HistoryPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AlertsPage } from './pages/AlertsPage';
import { DevicePage } from './pages/DevicePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <HealthDataProvider>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
              <Navbar />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/live" element={<LiveMonitoringPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/ai-analysis" element={<AIAnalysisPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/alerts" element={<AlertsPage />} />
                    <Route path="/device" element={<DevicePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </ErrorBoundary>
              </main>

              <Footer />
            </div>
          </HealthDataProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
