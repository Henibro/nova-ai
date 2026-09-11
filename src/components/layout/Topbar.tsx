import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Plus,
  FolderKanban,
  CheckSquare,
  FileText,
  Upload,
  Sun,
  Moon,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    currentRoute,
    routeParam,
    navigate,
    setIsMobileNavOpen,
    setIsCommandPaletteOpen,
    isDark,
    toggleDarkMode,
    activeProjectContext,
    setActiveProjectContext,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    user,
    projects,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  // Find active project if routeParam is present
  const currentProject = projects.find((p) => p.id === routeParam);

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-16 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="btn-mobile-nav-toggle"
          onClick={() => setIsMobileNavOpen(true)}
          className="p-2 -ml-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
          <button
            id="breadcrumb-root"
            onClick={() => navigate('/dashboard')}
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Nova
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="capitalize text-zinc-900 dark:text-zinc-100 font-semibold truncate">
            {currentRoute.replace('/', '') || 'Dashboard'}
          </span>
          {currentProject && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="text-indigo-600 dark:text-indigo-400 truncate font-semibold">
                {currentProject.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Center: Global Search & Command Center Trigger */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <button
          id="global-search-command-btn"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/70 hover:border-zinc-300 dark:hover:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
            <span className="group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
              Ask Nova anything or search workspace...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded border border-zinc-300 dark:border-zinc-700">
              Ctrl+K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Active AI Context Pill */}
        {activeProjectContext && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
            <span className="truncate max-w-[140px]">Context: {activeProjectContext.name}</span>
            <button
              onClick={() => setActiveProjectContext(null)}
              className="hover:text-indigo-950 dark:hover:text-white ml-1"
              title="Clear context"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Quick Create Button */}
        <div className="relative">
          <button
            id="btn-quick-create-dropdown"
            onClick={() => setIsQuickCreateOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-medium transition-all shadow-xs shadow-indigo-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New</span>
          </button>

          {isQuickCreateOpen && (
            <div
              id="quick-create-menu"
              className="absolute right-0 mt-2 w-48 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95"
            >
              <button
                id="quick-create-task"
                onClick={() => {
                  setIsQuickCreateOpen(false);
                  navigate('/tasks');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-left transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>New Task</span>
              </button>
              <button
                id="quick-create-doc"
                onClick={() => {
                  setIsQuickCreateOpen(false);
                  navigate('/documents');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-left transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>New Document</span>
              </button>
              <button
                id="quick-create-project"
                onClick={() => {
                  setIsQuickCreateOpen(false);
                  navigate('/projects');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-left transition-colors"
              >
                <FolderKanban className="w-4 h-4 text-indigo-500" />
                <span>New Project</span>
              </button>
              <button
                id="quick-upload-file"
                onClick={() => {
                  setIsQuickCreateOpen(false);
                  navigate('/files');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-left transition-colors"
              >
                <Upload className="w-4 h-4 text-amber-500" />
                <span>Upload File</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          id="btn-topbar-theme-toggle"
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
          title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="btn-notifications-trigger"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
            )}
          </button>

          {isNotificationsOpen && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 sm:w-96 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95"
            >
              <div className="flex items-center justify-between p-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                    Notifications
                  </h4>
                  {unreadNotificationCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    id="btn-mark-all-read"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/50 py-1">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-zinc-400">No notifications yet.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkRoute) {
                          navigate(notif.linkRoute as any);
                          setIsNotificationsOpen(false);
                        }
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        notif.read
                          ? 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400'
                          : 'bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold leading-tight">{notif.title}</p>
                        <span className="text-[10px] text-zinc-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {user ? (
          <button
            id="topbar-avatar-btn"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
            />
          </button>
        ) : (
          <button
            id="topbar-signin-btn"
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
