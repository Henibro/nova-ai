import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, RefreshCw, Smartphone, Laptop, Tablet, Globe } from 'lucide-react';
import { fetchDevices, fetchBrowsers, fetchOS, fetchCountries } from '../../services/aetherApi';
import type { BreakdownItem } from '../../types/analytics';

export const VisitorsView: React.FC = () => {
  const [devices, setDevices] = useState<BreakdownItem[]>([]);
  const [browsers, setBrowsers] = useState<BreakdownItem[]>([]);
  const [os, setOS] = useState<BreakdownItem[]>([]);
  const [countries, setCountries] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    fetchDevices().then(setDevices);
    fetchBrowsers().then(setBrowsers);
    fetchOS().then(setOS);
    fetchCountries().then(setCountries);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Privacy Architecture Notice */}
      <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20 backdrop-blur-md flex items-start space-x-4">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Salted One-Way Anonymization Guarantee
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Aether Analytics uses a cryptographically salted daily rotating SHA-256 hash
            combining <code>DailySalt + IP + UserAgent</code>. Raw IP addresses are scrubbed
            before reaching storage. No tracking cookies or persistent identifiers are placed on the
            visitor’s device.
          </p>
        </div>
      </div>

      {/* Visitor Profile Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Unique Visitors</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            24,892
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-1">
            +18.4% vs prior 7 days
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">New vs Returning Ratio</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            71.4% / 28.6%
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">17,772 new / 7,120 returning</div>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Avg Pages per Visitor</span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">
            3.27 pages
          </div>
          <div className="text-[11px] text-cyan-500 font-semibold mt-1">
            Healthy exploration depth
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Operating Systems */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Operating Systems
          </h3>
          <div className="space-y-3">
            {os.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {item.name}
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white font-semibold">
                    {item.percentage}% ({((item.visitors ?? item.pageViews ?? item.value ?? 0)).toLocaleString()})
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Browsers
          </h3>
          <div className="space-y-3">
            {browsers.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {item.name}
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white font-semibold">
                    {item.percentage}% ({((item.visitors ?? item.pageViews ?? item.value ?? 0)).toLocaleString()})
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
