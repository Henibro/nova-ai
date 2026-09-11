import React, { useEffect, useState } from 'react';
import { Gauge, CheckCircle2, AlertTriangle, XCircle, Info, Zap } from 'lucide-react';
import { fetchPerformance } from '../../services/aetherApi';
import type { WebVitalMetric } from '../../types/analytics';

export const PerformanceView: React.FC = () => {
  const [vitals, setVitals] = useState<WebVitalMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance().then((data) => {
      setVitals(data);
      setLoading(false);
    });
  }, []);

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'good':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Good</span>
          </span>
        );
      case 'needs-improvement':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Review</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Poor</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-cyan-500" />
            <span>Core Web Vitals & Telemetry Performance</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Real user performance measurements (RUM) collected via Web Performance API
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-neutral-500 font-mono">
          <span>Target: 75th percentile (p75)</span>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vitals.map((item) => (
          <div
            key={item.name}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400">
                {item.name}
              </span>
              {getRatingBadge(item.rating)}
            </div>

            <div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {item.label}
              </div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
                {item.p75 ?? item.value} {item.unit}
              </div>
            </div>

            {/* Threshold Progress */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>Good: &le;{item.thresholds?.good ?? 200}{item.unit}</span>
                <span>Poor: &gt;{item.thresholds?.poor ?? 500}{item.unit}</span>
              </div>
              <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: '60%' }} />
                <div className="h-full bg-amber-500" style={{ width: '25%' }} />
                <div className="h-full bg-rose-500" style={{ width: '15%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>75th Percentile:</span>
              <span className="font-bold text-neutral-700 dark:text-neutral-300">
                {item.p75 ?? item.value} {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* RUM Client Integration Explanation */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white">
          <Info className="w-4 h-4 text-cyan-500" />
          <span>Automated Core Web Vitals Telemetry</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The Aether tracking SDK automatically listens to <code>PerformanceObserver</code> events for
          LCP, INP, CLS, FCP, and TTFB. Metrics are buffered and beaconed to <code>/api/events</code>{' '}
          using <code>navigator.sendBeacon</code> during idle periods or page unload, ensuring zero
          impact on runtime user experience.
        </p>
      </div>
    </div>
  );
};
