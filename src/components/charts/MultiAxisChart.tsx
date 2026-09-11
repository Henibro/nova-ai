import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { TimeSeriesPoint } from '../../types/analytics';
import { useAether } from '../../context/AetherContext';

interface MultiAxisChartProps {
  data: TimeSeriesPoint[];
}

export const MultiAxisChart: React.FC<MultiAxisChartProps> = ({ data }) => {
  const { theme } = useAether();

  const [metrics, setMetrics] = useState({
    visitors: true,
    pageViews: true,
    conversions: true,
    bounceRate: false,
  });

  const toggleMetric = (key: keyof typeof metrics) => {
    setMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDark = theme === 'dark';

  return (
    <div className="w-full">
      {/* Metric Toggles Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={metrics.visitors}
              onChange={() => toggleMetric('visitors')}
              className="rounded text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
            />
            <span className="flex items-center space-x-1.5 text-neutral-800 dark:text-neutral-200">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Visitors</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={metrics.pageViews}
              onChange={() => toggleMetric('pageViews')}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="flex items-center space-x-1.5 text-neutral-800 dark:text-neutral-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Page Views</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={metrics.conversions}
              onChange={() => toggleMetric('conversions')}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="flex items-center space-x-1.5 text-neutral-800 dark:text-neutral-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Conversions</span>
            </span>
          </label>

          <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer select-none">
            <input
              type="checkbox"
              checked={metrics.bounceRate}
              onChange={() => toggleMetric('bounceRate')}
              className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
            />
            <span className="flex items-center space-x-1.5 text-neutral-800 dark:text-neutral-200">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Bounce Rate</span>
            </span>
          </label>
        </div>

        <div className="text-[11px] text-neutral-400 font-mono">
          Interactive Multi-Axis Telemetry
        </div>
      </div>

      {/* Recharts Composed Vector Area / Line Visualization */}
      <div className="h-72 w-full min-h-[288px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <ComposedChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#262626' : '#f3f4f6'}
              vertical={false}
            />

            <XAxis
              dataKey="dateStr"
              stroke={isDark ? '#737373' : '#9ca3af'}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#262626' : '#e5e7eb' }}
            />

            {/* Left Y Axis for Volume */}
            <YAxis
              yAxisId="left"
              stroke={isDark ? '#737373' : '#9ca3af'}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />

            {/* Right Y Axis for Rates/Percentages */}
            {(metrics.conversions || metrics.bounceRate) && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={isDark ? '#737373' : '#9ca3af'}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
              />
            )}

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-3 shadow-xl text-xs space-y-1.5">
                    <div className="font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-1">
                      {label}
                    </div>
                    {payload.map((entry: any) => (
                      <div key={entry.name} className="flex items-center justify-between space-x-4">
                        <span className="flex items-center space-x-1.5 text-neutral-600 dark:text-neutral-400">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="capitalize">{entry.name}</span>
                        </span>
                        <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                          {entry.name === 'bounceRate' ? `${entry.value}%` : entry.value?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            {metrics.pageViews && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="pageViews"
                name="pageViews"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPageViews)"
              />
            )}

            {metrics.visitors && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="visitors"
                name="visitors"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
            )}

            {metrics.conversions && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversions"
                name="conversions"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 5 }}
              />
            )}

            {metrics.bounceRate && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bounceRate"
                name="bounceRate"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
