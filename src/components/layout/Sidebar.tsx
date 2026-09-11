import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppRoute } from '../../types';
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  FileText,
  Files,
  CheckSquare,
  Calendar,
  Bot,
  Search,
  Sparkles,
  Users,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentRoute,
    navigate,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileNavOpen,
    setIsMobileNavOpen,
    user,
    logout,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    tasks,
    isDark,
    toggleDarkMode,
  } = useApp();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const pendingTasksCount = tasks.filter((t) => t.status !== 'DONE').length;

  const navItems: Array<{
    name: string;
    route: AppRoute;
    icon: React.ElementType;
    badge?: number | string;
  }> = [
    { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', route: '/chat', icon: MessageSquare, badge: 'AI' },
    { name: 'Projects', route: '/projects', icon: FolderKanban },
    { name: 'Documents', route: '/documents', icon: FileText },
    { name: 'Files', route: '/files', icon: Files },
    { name: 'Tasks', route: '/tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { name: 'Calendar', route: '/calendar', icon: Calendar },
    { name: 'AI Agents', route: '/agents', icon: Bot, badge: '7' },
  ];

  const secondaryNav: Array<{
    name: string;
    route: AppRoute;
    icon: React.ElementType;
  }> = [
    { name: 'Search', route: '/search', icon: Search },
    { name: 'Workflows', route: '/workflows', icon: Sparkles },
    { name: 'Team', route: '/team', icon: Users },
  ];

  const bottomNav: Array<{
    name: string;
    route: AppRoute;
    icon: React.ElementType;
  }> = [
    { name: 'Settings', route: '/settings', icon: Settings },
    { name: 'Billing', route: '/billing', icon: CreditCard },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 border-r
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100
        `}
      >
        {/* Header: Brand & Workspace */}
        <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <button
            id="sidebar-logo-button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 text-left group overflow-hidden focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 text-white font-bold text-lg">
              ✦
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                    Nova AI
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-md">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">Your Intelligent Workspace</p>
              </div>
            )}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            id="sidebar-collapse-toggle"
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Selector Dropdown */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <button
                id="workspace-selector-btn"
                onClick={() => setIsWorkspaceMenuOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-xs font-medium"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{activeWorkspace.name}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isWorkspaceMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isWorkspaceMenuOpen && (
                <div
                  id="workspace-dropdown-menu"
                  className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase text-zinc-400 tracking-wider">
                    Workspaces
                  </p>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      id={`ws-option-${ws.id}`}
                      onClick={() => {
                        setActiveWorkspace(ws);
                        setIsWorkspaceMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        activeWorkspace.id === ws.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {activeWorkspace.id === ws.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                  <button
                    id="btn-create-workspace"
                    onClick={() => {
                      setIsWorkspaceMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 font-medium"
                  >
                    + Manage Workspaces
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <p className="px-2.5 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Workspace
              </p>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Tools */}
          <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
            {!isSidebarCollapsed && (
              <p className="px-2.5 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Tools & Operations
              </p>
            )}
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </div>

          {/* System Nav */}
          <div className="space-y-1 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
            {!isSidebarCollapsed && (
              <p className="px-2.5 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                System
              </p>
            )}
            {bottomNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: User Profile & Quick Actions */}
        <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50">
          {user ? (
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
              <div
                className="flex items-center gap-2.5 truncate cursor-pointer"
                onClick={() => navigate('/settings')}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
                />
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <p className="text-xs font-semibold leading-tight truncate">{user.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                  </div>
                )}
              </div>

              {!isSidebarCollapsed && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    id="sidebar-theme-toggle"
                    onClick={toggleDarkMode}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
                  >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    id="sidebar-logout-button"
                    onClick={logout}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="sidebar-signin-button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              {!isSidebarCollapsed && <span>Sign In</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
