import React, { useState } from 'react';
import {
  Calendar,
  RotateCw,
  Download,
  Command,
  Radio,
  Check,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { exportData } from '../../services/aetherApi';
import type { DateRangePreset } from '../../types/analytics';

interface AetherTopbarProps {
  currentRoute: string;
  onOpenCommandPalette: () => void;
  onToggleSidebar: () => void;
}

export const AetherTopbar: React.FC<AetherTopbarProps> = ({
  currentRoute,
  onOpenCommandPalette,
  onToggleSidebar,
}) => {
  const { dateRange, setDateRange, refreshOverview, loading, ws } = useAether();
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard Overview',
    '/realtime': 'Real-Time Telemetry Stream',
    '/analytics': 'Product Analytics & Insights',
    '/events': 'Event Explorer & Telemetry Log',
    '/funnels': 'Conversion Funnel Analysis',
    '/performance': 'Web Performance & Core Web Vitals',
    '/visitors': 'Privacy-Preserving Visitor Insights',
    '/alerts': 'Threshold Alerts & Trigger History',
    '/projects': 'Project & API Key Management',
    '/settings': 'Platform & Privacy Settings',
  };

  const dateOptions: Array<{ id: DateRangePreset; label: string }> = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last_7_days', label: 'Last 7 days' },
    { id: 'last_30_days', label: 'Last 30 days' },
    { id: 'last_90_days', label: 'Last 90 days' },
  ];

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    setExportMenuOpen(false);
    try {
      await exportData(format);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 md:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white tracking-tight">
            {routeTitles[currentRoute] || 'Aether Analytics'}
          </h1>
          <div className="flex items-center space-x-2 text-[11px] text-neutral-600 dark:text-neutral-400">
            <span>Aether</span>
            <span>/</span>
            <span className="capitalize">{currentRoute.replace('/', '') || 'Home'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2.5">
        {/* Live WebSocket Status Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <span
            className={`w-2 h-2 rounded-full ${
              ws.connectionStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : ws.connectionStatus === 'reconnecting'
                ? 'bg-amber-500 animate-ping'
                : 'bg-neutral-400'
            }`}
          />
          <span className="text-neutral-700 dark:text-neutral-300">
            {ws.connectionStatus === 'connected'
              ? '● Live connection'
              : ws.connectionStatus === 'reconnecting'
              ? 'Reconnecting...'
              : 'Disconnected'}
          </span>
          {ws.connectionStatus === 'connected' && (
            <span className="text-[10px] text-neutral-600 dark:text-neutral-400 border-l border-neutral-200 dark:border-neutral-700 pl-1.5 ml-0.5">
              {ws.activeVisitors} active
            </span>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setDateMenuOpen(!dateMenuOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors text-neutral-800 dark:text-neutral-200 shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{dateOptions.find((d) => d.id === dateRange)?.label || 'Date Range'}</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {dateMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 uppercase">
                Date Range
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setDateRange(opt.id);
                    setDateMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                    dateRange === opt.id ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {dateRange === opt.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshOverview}
          disabled={loading}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors shadow-sm"
          title="Refresh Metrics"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-500' : ''}`} />
        </button>

        {/* Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Command Palette (Ctrl + K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">⌘K</span>
        </button>

        {/* Export Button */}
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-1 z-50 text-xs">
              <button
                onClick={() => handleExport('csv')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                Export CSV (.csv)
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                Export JSON (.json)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
