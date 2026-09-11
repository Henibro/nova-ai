import React, { useState, useEffect } from 'react';
import {
  FileText,
  Share2,
  Laptop,
  Compass,
  Layers,
  Globe,
  Search,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { TrafficHeatmap } from '../charts/TrafficHeatmap';
import {
  fetchPages,
  fetchReferrers,
  fetchDevices,
  fetchBrowsers,
  fetchOS,
  fetchCountries,
} from '../../services/aetherApi';
import type { BreakdownItem } from '../../types/analytics';

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'pages' | 'referrers' | 'devices' | 'browsers' | 'os' | 'countries'
  >('pages');

  const [dataMap, setDataMap] = useState<Record<string, BreakdownItem[]>>({
    pages: [],
    referrers: [],
    devices: [],
    browsers: [],
    os: [],
    countries: [],
  });

  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetchPages(),
      fetchReferrers(),
      fetchDevices(),
      fetchBrowsers(),
      fetchOS(),
      fetchCountries(),
    ]).then(([pages, referrers, devices, browsers, os, countries]) => {
      setDataMap({
        pages,
        referrers,
        devices,
        browsers,
        os,
        countries,
      });
    });
  }, []);

  const currentItems = dataMap[activeTab] || [];
  const filtered = currentItems.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'pages', label: 'Pages & Paths', icon: FileText },
    { id: 'referrers', label: 'Acquisition Referrers', icon: Share2 },
    { id: 'devices', label: 'Device Formats', icon: Laptop },
    { id: 'browsers', label: 'Browsers', icon: Compass },
    { id: 'os', label: 'Operating Systems', icon: Layers },
    { id: 'countries', label: 'Countries & Geo', icon: Globe },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Heatmap Section */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Visitor Density Matrix (Heatmap)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Telemetry distribution across days of week and 24-hour cycles
          </p>
        </div>
        <TrafficHeatmap />
      </div>

      {/* Dimensional Breakdown Matrix */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-medium">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Dimension Name</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
                <th className="py-2.5 px-3 text-right">Share (%)</th>
                <th className="py-2.5 px-3 w-48">Distribution Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400 font-sans">
                    No items found matching your filter
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={item.name}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-neutral-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                      {item.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-neutral-900 dark:text-white">
                      {(item.visitors ?? item.pageViews ?? item.value ?? 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-600 dark:text-cyan-400 font-semibold">
                      {item.percentage}%
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
