import React, { createContext, useContext, useState, useCallback } from 'react';

interface AnalyticsContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
