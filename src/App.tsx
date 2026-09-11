import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';

// Views
import { LandingPage } from './views/LandingPage';
import { AuthViews } from './views/AuthViews';
import { DashboardView } from './views/DashboardView';
import { ChatView } from './views/ChatView';
import { ProjectsView } from './views/ProjectsView';
import { DocumentsView } from './views/DocumentsView';
import { FilesView } from './views/FilesView';
import { TasksView } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { AgentsView } from './views/AgentsView';
import { SearchView } from './views/SearchView';
import { SettingsView } from './views/SettingsView';
import { BillingView } from './views/BillingView';

const WorkspaceShell: React.FC = () => {
  const { currentRoute, isSidebarCollapsed } = useApp();

  const renderActiveView = () => {
    switch (currentRoute) {
      case '/dashboard':
        return <DashboardView />;
      case '/chat':
        return <ChatView />;
      case '/projects':
        return <ProjectsView />;
      case '/documents':
        return <DocumentsView />;
      case '/files':
        return <FilesView />;
      case '/tasks':
        return <TasksView />;
      case '/calendar':
        return <CalendarView />;
      case '/agents':
        return <AgentsView />;
      case '/search':
        return <SearchView />;
      case '/settings':
        return <SettingsView />;
      case '/billing':
        return <BillingView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Global Topbar */}
      <Topbar />

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Dynamic Route View */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
        >
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const { currentRoute, isAuthenticated } = useApp();

  // Public Landing Page
  if (currentRoute === '/') {
    return <LandingPage />;
  }

  // Auth Pages
  if (currentRoute === '/login') {
    return <AuthViews initialMode="signin" />;
  }
  if (currentRoute === '/register') {
    return <AuthViews initialMode="signup" />;
  }
  if (currentRoute === '/forgot-password') {
    return <AuthViews initialMode="forgot" />;
  }

  // Workspace Application Shell
  return <WorkspaceShell />;
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer />
      <CommandPalette />
    </AppProvider>
  );
}
