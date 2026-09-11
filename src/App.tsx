import React, { useState, useEffect } from 'react';
import { AetherProvider, useAether } from './context/AetherContext';
import { AetherSidebar } from './components/layout/AetherSidebar';
import { AetherTopbar } from './components/layout/AetherTopbar';
import { AetherCommandPalette } from './components/common/AetherCommandPalette';
import { AetherAlertToast } from './components/common/AetherAlertToast';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Views
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { RealtimeView } from './components/views/RealtimeView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { EventsView } from './components/views/EventsView';
import { FunnelsView } from './components/views/FunnelsView';
import { PerformanceView } from './components/views/PerformanceView';
import { VisitorsView } from './components/views/VisitorsView';
import { AlertsView } from './components/views/AlertsView';
import { ProjectsView } from './components/views/ProjectsView';
import { SettingsView } from './components/views/SettingsView';

const AetherShell: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Sync route with browser history safely
  useEffect(() => {
    try {
      const path = window.location.pathname;
      if (path && path !== '/') {
        setCurrentRoute(path);
      }
    } catch {
      // ignore if restricted
    }

    const handlePopState = () => {
      try {
        const path = window.location.pathname;
        if (path && path !== '/') {
          setCurrentRoute(path);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    try {
      window.history.pushState({}, '', route);
    } catch {
      // In restricted iframes pushState might fail - state takes priority
    }
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  // If user navigated to root landing page
  if (currentRoute === '/') {
    return (
      <ErrorBoundary>
        <LandingView onNavigate={navigateTo} />
      </ErrorBoundary>
    );
  }

  const renderActiveView = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <DashboardView onNavigate={navigateTo} />;
      case '/realtime':
        return <RealtimeView />;
      case '/analytics':
        return <AnalyticsView />;
      case '/events':
        return <EventsView />;
      case '/funnels':
        return <FunnelsView />;
      case '/performance':
        return <PerformanceView />;
      case '/visitors':
        return <VisitorsView />;
      case '/alerts':
        return <AlertsView />;
      case '/projects':
        return <ProjectsView />;
      case '/settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <AetherSidebar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-0 md:ml-18' : 'ml-0 md:ml-64'
        }`}
      >
        {/* Global Topbar */}
        <AetherTopbar
          currentRoute={currentRoute}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary>
            {renderActiveView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Real-time Global Elements */}
      <AetherCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
      />

      <AetherAlertToast onNavigate={navigateTo} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AetherProvider>
        <AetherShell />
      </AetherProvider>
    </ErrorBoundary>
  );
}
