import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Project,
  DateRangePreset,
  GlobalFilter,
  OverviewMetrics,
  TimeSeriesPoint,
  AlertRule,
  AlertLog,
} from '../types/analytics';
import {
  fetchOverview,
  fetchProjects,
  fetchAlerts,
  sendTelemetryEvent,
} from '../services/aetherApi';
import { useWebSocketTelemetry } from '../hooks/useWebSocketTelemetry';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'ANALYST';
}

interface AetherContextType {
  user: User;
  activeProject: Project;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  switchProject: (projectId: string) => void;
  dateRange: DateRangePreset;
  setDateRange: (range: DateRangePreset) => void;
  globalFilter: GlobalFilter;
  setGlobalFilter: React.Dispatch<React.SetStateAction<GlobalFilter>>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  overview: { metrics: OverviewMetrics; timeSeries: TimeSeriesPoint[] } | null;
  loading: boolean;
  refreshOverview: () => Promise<void>;
  alerts: AlertRule[];
  alertLogs: AlertLog[];
  refreshAlerts: () => Promise<void>;
  ws: ReturnType<typeof useWebSocketTelemetry>;
  emitTestEvent: (name: string, props?: Record<string, any>) => Promise<void>;
}

const defaultProject: Project = {
  id: 'project_aether_demo',
  name: 'Aether Cloud (Production)',
  domain: 'aetheranalytics.io',
  apiKey: 'aether_live_948f29d10e82c19a2b8e',
  createdAt: '2026-01-10T08:00:00Z',
  retentionDays: 90,
  ipAnonymization: true,
  cookieFree: true,
  honorDNT: true,
  totalEvents: 142850,
};

const AetherContext = createContext<AetherContextType | undefined>(undefined);

export const AetherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<User>({
    id: 'usr_owner_01',
    name: 'Henok Alem',
    email: 'alemh2112@gmail.com',
    role: 'OWNER',
  });

  const [projects, setProjects] = useState<Project[]>([defaultProject]);
  const [activeProject, setActiveProject] = useState<Project>(defaultProject);
  const [dateRange, setDateRange] = useState<DateRangePreset>('last_7_days');
  const [globalFilter, setGlobalFilter] = useState<GlobalFilter>({
    dateRange: 'last_7_days',
    device: 'all',
    browser: 'all',
    country: 'all',
    eventType: 'all',
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [overview, setOverview] = useState<{ metrics: OverviewMetrics; timeSeries: TimeSeriesPoint[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);

  const ws = useWebSocketTelemetry(activeProject.id);

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const refreshOverview = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOverview(activeProject.id, dateRange);
      setOverview(data);
    } catch (err) {
      console.error('Error fetching overview', err);
    } finally {
      setLoading(false);
    }
  }, [activeProject.id, dateRange]);

  const refreshAlerts = useCallback(async () => {
    try {
      const data = await fetchAlerts(activeProject.id);
      setAlerts(data.alerts || []);
      setAlertLogs(data.history || []);
    } catch (err) {
      console.error('Error fetching alerts', err);
    }
  }, [activeProject.id]);

  useEffect(() => {
    fetchProjects().then((projs) => {
      if (projs.length > 0) {
        setProjects(projs);
        setActiveProject(projs[0]);
      }
    });
    refreshAlerts();
  }, [refreshAlerts]);

  useEffect(() => {
    refreshOverview();
  }, [refreshOverview]);

  const switchProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setActiveProject(found);
    }
  };

  const emitTestEvent = async (name: string, props: Record<string, any> = {}) => {
    await sendTelemetryEvent({
      projectId: activeProject.id,
      eventName: name,
      properties: props,
      pageUrl: window.location.pathname,
    });
  };

  return (
    <AetherContext.Provider
      value={{
        user,
        activeProject,
        projects,
        setProjects,
        switchProject,
        dateRange,
        setDateRange,
        globalFilter,
        setGlobalFilter,
        theme,
        toggleTheme,
        isDemoMode,
        toggleDemoMode,
        overview,
        loading,
        refreshOverview,
        alerts,
        alertLogs,
        refreshAlerts,
        ws,
        emitTestEvent,
      }}
    >
      {children}
    </AetherContext.Provider>
  );
};

export function useAether() {
  const context = useContext(AetherContext);
  if (!context) {
    throw new Error('useAether must be used within an AetherProvider');
  }
  return context;
}
