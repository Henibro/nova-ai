import React from 'react';
import {
  Activity,
  BarChart3,
  Radio,
  ListFilter,
  GitFork,
  Gauge,
  Users,
  Bell,
  FolderGit2,
  Settings,
  ChevronDown,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';

interface AetherSidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const AetherSidebar: React.FC<AetherSidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
}) => {
  const {
    activeProject,
    projects,
    switchProject,
    theme,
    toggleTheme,
    isDemoMode,
    toggleDemoMode,
    user,
    ws,
  } = useAether();

  const [projectMenuOpen, setProjectMenuOpen] = React.useState(false);

  const navItems = [
    { id: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: '/realtime', label: 'Real-time', icon: Radio, badge: ws.activeVisitors.toString(), isPulse: true },
    { id: '/analytics', label: 'Analytics', icon: Activity },
    { id: '/events', label: 'Events', icon: ListFilter },
    { id: '/funnels', label: 'Funnels', icon: GitFork },
    { id: '/performance', label: 'Performance', icon: Gauge },
    { id: '/visitors', label: 'Visitors', icon: Users },
    { id: '/alerts', label: 'Alerts', icon: Bell },
  ];

  const secondaryItems = [
    { id: '/projects', label: 'Projects', icon: FolderGit2 },
    { id: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col border-r transition-all duration-300 ${
        collapsed ? 'w-18' : 'w-64'
      } ${
        theme === 'dark'
          ? 'bg-neutral-950 border-neutral-800 text-neutral-200'
          : 'bg-white border-neutral-200 text-neutral-800'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-200 dark:border-neutral-800/80 justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center space-x-3 text-left focus:outline-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/10 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                  Aether
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  Telemetry
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Privacy Analytics</p>
            </div>
          )}
        </button>
      </div>

      {/* Project Selector */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-neutral-200 dark:border-neutral-800/60 relative">
          <button
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors text-left"
          >
            <div className="flex items-center space-x-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate font-semibold text-neutral-800 dark:text-neutral-200">
                {activeProject.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1" />
          </button>

          {projectMenuOpen && (
            <div className="absolute top-14 left-3 right-3 z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
                Switch Project
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    switchProject(proj.id);
                    setProjectMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                    proj.id === activeProject.id ? 'text-cyan-600 dark:text-cyan-400 font-medium' : ''
                  }`}
                >
                  <span className="truncate">{proj.name}</span>
                  {proj.id === activeProject.id && (
                    <span className="text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded text-cyan-600 dark:text-cyan-400">
                      Active
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-neutral-200 dark:border-neutral-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProjectMenuOpen(false);
                    onNavigate('/projects');
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  + Manage Projects
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Navigation Items */}
      <div className="flex-1 px-3 py-3 overflow-y-auto space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 text-neutral-600 dark:text-neutral-400">
          Analytics
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-neutral-500'}`} />
                {!collapsed && <span>{item.label}</span>}
              </div>
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex items-center space-x-1 ${
                    item.isPulse
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {item.isPulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />}
                  <span>{item.badge}</span>
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-3 pb-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 text-neutral-600 dark:text-neutral-400">
            System
          </div>
        </div>

        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-neutral-500'}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Privacy Guarantee Badge */}
      {!collapsed && (
        <div className="px-3 py-2">
          <div className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-snug">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                100% Privacy-Preserving
              </span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[10px] mt-0.5">
                No cookies. Salted IP anonymization before storage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800/80 space-y-2">
        {!collapsed && (
          <div className="flex items-center justify-between text-xs px-1">
            <button
              onClick={toggleDemoMode}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[11px] font-semibold border transition-all ${
                isDemoMode
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isDemoMode ? 'Demo Data' : 'Live Data'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-7 h-7 rounded-full bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
              {user.name.charAt(0)}
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <div className="text-xs font-semibold truncate text-neutral-900 dark:text-white">
                  {user.name}
                </div>
                <div className="text-[10px] text-neutral-400 truncate">{user.role}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => onNavigate('/login')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
