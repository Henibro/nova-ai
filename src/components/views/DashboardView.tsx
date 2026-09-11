import React, { useEffect, useState } from 'react';
import {
  Users,
  Eye,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { MultiAxisChart } from '../charts/MultiAxisChart';
import { fetchPages, fetchReferrers, fetchDevices, fetchCountries } from '../../services/aetherApi';
import type { BreakdownItem } from '../../types/analytics';

export const DashboardView: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { overview, loading, ws, activeProject, emitTestEvent } = useAether();

  const [topPages, setTopPages] = useState<BreakdownItem[]>([]);
  const [referrers, setReferrers] = useState<BreakdownItem[]>([]);
  const [devices, setDevices] = useState<BreakdownItem[]>([]);
  const [countries, setCountries] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    fetchPages().then(setTopPages);
    fetchReferrers().then(setReferrers);
    fetchDevices().then(setDevices);
    fetchCountries().then(setCountries);
  }, [activeProject.id]);

  const metrics = overview?.metrics;

  const kpis = [
    {
      id: 'visitors',
      label: 'Unique Visitors',
      value: metrics?.visitors.formattedValue || '24,892',
      change: metrics?.visitors.changePercentage || 18.4,
      isPositive: (metrics?.visitors.changePercentage || 0) >= 0,
      icon: Users,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      id: 'pageViews',
      label: 'Total Page Views',
      value: metrics?.pageViews.formattedValue || '81,420',
      change: metrics?.pageViews.changePercentage || 22.1,
      isPositive: (metrics?.pageViews.changePercentage || 0) >= 0,
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'sessions',
      label: 'Active Sessions',
      value: metrics?.sessions.formattedValue || '31,204',
      change: metrics?.sessions.changePercentage || 14.6,
      isPositive: (metrics?.sessions.changePercentage || 0) >= 0,
      icon: Activity,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      id: 'events',
      label: 'Ingested Events',
      value: metrics?.events.formattedValue || '142,850',
      change: metrics?.events.changePercentage || 19.8,
      isPositive: (metrics?.events.changePercentage || 0) >= 0,
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'conversionRate',
      label: 'Conversion Rate',
      value: metrics?.conversionRate.formattedValue || '4.82%',
      change: metrics?.conversionRate.changePercentage || 17.0,
      isPositive: (metrics?.conversionRate.changePercentage || 0) >= 0,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'avgDuration',
      label: 'Avg Session Duration',
      value: metrics?.avgDurationSec.formattedValue || '3m 42s',
      change: metrics?.avgDurationSec.changePercentage || 8.3,
      isPositive: (metrics?.avgDurationSec.changePercentage || 0) >= 0,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Realtime Live Pulse Banner */}
      <div className="p-4 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-neutral-900/40 to-blue-950/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                Live Telemetry Stream
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
              <span>{ws.activeVisitors} current active visitors</span>
              <span className="text-neutral-400 dark:text-neutral-500">•</span>
              <span className="text-neutral-400 text-xs font-normal font-mono">
                {ws.eventsPerMinute} events/min
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() =>
              emitTestEvent('button_click', {
                target: 'quick_cta',
                path: '/dashboard',
                timestamp: Date.now(),
              })
            }
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Telemetry Click</span>
          </button>

          <button
            onClick={() => onNavigate('/realtime')}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            <span>Open Real-Time Feed</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {kpi.label}
                </span>
                <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white">
                {kpi.value}
              </div>
              <div className="flex items-center space-x-1 mt-1 text-[11px] font-medium">
                {kpi.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span className={kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'}>
                  {kpi.change > 0 ? `+${kpi.change}%` : `${kpi.change}%`}
                </span>
                <span className="text-neutral-400 text-[10px]">vs prior period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Multi-Axis Chart */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Traffic & Conversion Trends
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive time-series telemetry with multi-axis correlation
            </p>
          </div>
        </div>

        {overview?.timeSeries && overview.timeSeries.length > 0 ? (
          <MultiAxisChart data={overview.timeSeries} />
        ) : (
          <div className="h-64 flex items-center justify-center text-neutral-400 text-xs">
            Loading telemetry series...
          </div>
        )}
      </div>

      {/* Secondary Tables Grid: Top Pages & Referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Pages */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Top Visited Pages
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Ranked by view volume and unique visitors
              </p>
            </div>
            <button
              onClick={() => onNavigate('/analytics')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topPages.slice(0, 5).map((page, idx) => (
              <div
                key={page.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="font-mono text-xs text-neutral-400 w-4">{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold font-mono text-neutral-800 dark:text-neutral-200 truncate">
                      {page.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 shrink-0 text-xs font-mono">
                  <span className="text-neutral-900 dark:text-white font-bold">
                    {(page.pageViews ?? page.visitors ?? page.value ?? 0).toLocaleString()} views
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold w-12 text-right">
                    {page.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Referrers */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Acquisition Sources
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Inbound channels & referrer domains
              </p>
            </div>
            <button
              onClick={() => onNavigate('/analytics')}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {referrers.slice(0, 5).map((ref, idx) => (
              <div
                key={ref.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="font-mono text-xs text-neutral-400 w-4">{idx + 1}</span>
                  <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {ref.name}
                  </div>
                </div>
                <div className="flex items-center space-x-4 shrink-0 text-xs font-mono">
                  <span className="text-neutral-900 dark:text-white font-bold">
                    {(ref.visitors ?? ref.pageViews ?? ref.value ?? 0).toLocaleString()}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold w-12 text-right">
                    {ref.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tertiary Breakdown: Devices & Geographic Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Devices */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Device Breakdown
            </h3>
            <span className="text-xs font-mono text-neutral-500">100% total</span>
          </div>
          <div className="space-y-3">
            {devices.map((dev) => {
              const Icon =
                dev.name === 'Desktop' ? Laptop : dev.name === 'Mobile' ? Smartphone : Tablet;
              return (
                <div key={dev.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {dev.name}
                      </span>
                    </div>
                    <span className="font-mono text-neutral-900 dark:text-white font-semibold">
                      {dev.percentage}% ({((dev.visitors ?? dev.pageViews ?? dev.value ?? 0)).toLocaleString()})
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                      style={{ width: `${dev.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Countries */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Top Geographic Regions
            </h3>
            <span className="text-xs font-mono text-neutral-500">Privacy Anonymized</span>
          </div>
          <div className="space-y-3">
            {countries.slice(0, 4).map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {c.name}
                    </span>
                  </div>
                  <span className="font-mono text-neutral-900 dark:text-white font-semibold">
                    {c.percentage}% ({((c.visitors ?? c.pageViews ?? c.value ?? 0)).toLocaleString()})
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
