import React, { useState, useEffect } from 'react';
import {
  ListFilter,
  Search,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Zap,
  Code,
  Laptop,
  Smartphone,
  Tablet,
  Calendar,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { fetchEvents } from '../../services/aetherApi';
import type { TelemetryEvent } from '../../types/analytics';

export const EventsView: React.FC = () => {
  const { activeProject, emitTestEvent, ws } = useAether();
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents(activeProject.id, 100);
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [activeProject.id]);

  // Combine fetched events with incoming ws live events
  const allEvents = [...ws.liveEvents, ...events.filter((e) => !ws.liveEvents.some((l) => l.id === e.id))];

  const filtered = allEvents.filter((e) => {
    const matchesType = selectedType === 'all' || e.eventName === selectedType;
    const matchesSearch =
      e.eventName.toLowerCase().includes(search.toLowerCase()) ||
      e.pageUrl.toLowerCase().includes(search.toLowerCase()) ||
      (e.visitorHash && e.visitorHash.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const eventTypes = [
    'all',
    'page_view',
    'button_click',
    'signup_completed',
    'checkout_completed',
    'form_submitted',
    'search_query',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Action and Filter Header */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <span>Telemetry Event Explorer</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                {filtered.length} events
              </span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Inspect raw event records, custom attributes, and device telemetry
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                emitTestEvent('button_click', { button_name: 'cta_get_started', section: 'hero' })
              }
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Custom Event</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-1.5">
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-colors ${
                  selectedType === type
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by event, URL, or hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Events Stream / Table */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              No telemetry events match your criteria.
            </div>
          ) : (
            filtered.map((evt) => {
              const isExpanded = expandedId === evt.id;
              const DeviceIcon =
                evt.deviceType === 'desktop'
                  ? Laptop
                  : evt.deviceType === 'mobile'
                  ? Smartphone
                  : Tablet;

              return (
                <div
                  key={evt.id}
                  className="rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden transition-all bg-neutral-50/50 dark:bg-neutral-950/40"
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                    className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="p-1 text-neutral-400">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                          evt.eventName.includes('checkout') || evt.eventName.includes('signup')
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : evt.eventName.includes('click')
                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {evt.eventName}
                      </span>

                      <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate">
                        {evt.pageUrl}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 text-xs font-mono text-neutral-500">
                      <div className="hidden sm:flex items-center space-x-1">
                        <DeviceIcon className="w-3.5 h-3.5" />
                        <span>{evt.browser}</span>
                      </div>
                      <span className="hidden md:inline">{evt.country}</span>
                      <span className="text-neutral-400 text-[11px]">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Expanded JSON Inspector */}
                  {isExpanded && (
                    <div className="p-4 bg-neutral-100/60 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 uppercase">Event ID</span>
                          <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200 truncate">
                            {evt.id}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 uppercase">
                            Salted Visitor Hash
                          </span>
                          <div className="font-mono text-cyan-600 dark:text-cyan-400 truncate">
                            {evt.visitorHash}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 uppercase">OS & Platform</span>
                          <div className="font-mono text-neutral-800 dark:text-neutral-200">
                            {evt.os} • {evt.deviceType}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                          Custom Ingested Properties
                        </span>
                        <pre className="p-3 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-[11px] overflow-x-auto border border-neutral-800">
                          {JSON.stringify(evt.properties, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
