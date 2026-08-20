import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: (enable?: boolean) => Promise<void>;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('demo_mode') === 'true';
  });

  const toggleDemoMode = async (enable?: boolean) => {
    const targetState = enable !== undefined ? enable : !isDemoMode;
    setIsDemoMode(targetState);
    localStorage.setItem('demo_mode', String(targetState));

    try {
      await apiClient.toggleDemoMode(targetState);
    } catch (error) {
      console.warn('Failed to communicate demo toggle to backend, continuing local simulation.');
    }
  };

  useEffect(() => {
    // Sync initial state with backend if demo mode was stored as active
    if (isDemoMode) {
      apiClient.toggleDemoMode(true).catch(() => {});
    }
  }, []);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (!context) throw new Error('useDemoMode must be used within DemoModeProvider');
  return context;
};
