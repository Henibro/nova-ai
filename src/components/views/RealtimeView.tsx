import React, { useState } from 'react';
import {
  Radio,
  Users,
  Zap,
  Activity,
  Sparkles,
  MousePointer,
  FileText,
  CreditCard,
  UserPlus,
  CheckCircle2,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  ChevronRight,
  X,
  Code,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import type { TelemetryEvent } from '../../types/analytics';

export const RealtimeView: React.FC = () => {
  const { ws, emitTestEvent, activeProject } = useAether();
  const [selectedEvent, setSelectedEvent] = useState<TelemetryEvent | null>(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async (name: string, props: Record<string, any>) => {
    setSimulating(true);
    await emitTestEvent(name, props);
    setTimeout(() => setSimulating(false), 300);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Huge Real-Time Meter */}
      <div className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  Live Streaming Telemetry
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex items-baseline space-x-3 mt-1">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white">
                  {ws.activeVisitors}
                </span>
                <span className="text-sm sm:text-base text-neutral-400 font-medium">
                  current active visitors on site
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 border-l border-neutral-800 pl-6">
            <div>
              <div className="text-xs text-neutral-400 font-medium">Telemetry Rate</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 flex items-center space-x-1.5 mt-0.5">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>{ws.eventsPerMinute}</span>
                <span className="text-xs text-neutral-500 font-normal">ev/min</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-neutral-400 font-medium">WS Channel</div>
              <div className="text-xs font-mono text-cyan-400 flex items-center space-x-1.5 mt-1.5 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>/ws?projectId={activeProject.id.slice(0, 14)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Quick Action Toolbar */}
      <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <span>Interactive Telemetry Injector (Test Live Flow):</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              handleSimulate('page_view', {
                path: '/pricing',
                referrer: 'google.com',
                title: 'Pricing & Plans',
              })
            }
            disabled={simulating}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>Page View (/pricing)</span>
          </button>

          <button
            onClick={() =>
              handleSimulate('button_click', {
                buttonId: 'btn_upgrade_pro',
                location: 'pricing_table',
                label: 'Upgrade to Team Pro',
              })
            }
            disabled={simulating}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            <MousePointer className="w-3.5 h-3.5 text-cyan-500" />
            <span>Click (Upgrade Button)</span>
          </button>

          <button
            onClick={() =>
              handleSimulate('signup_completed', {
                plan: 'pro_monthly',
                method: 'email_password',
                onboardingStep: 4,
              })
            }
            disabled={simulating}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Signup Event</span>
          </button>

          <button
            onClick={() =>
              handleSimulate('checkout_completed', {
                amount: 49.0,
                currency: 'USD',
                plan: 'enterprise_tier',
              })
            }
            disabled={simulating}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Conversion (Checkout $49)</span>
          </button>
        </div>
      </div>

      {/* Grid: Top Active Pages & Real-Time Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Active Pages Right Now */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs h-fit space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Active Pages Right Now
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Where active users are currently located
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            {ws.topPages.map((item, idx) => (
              <div
                key={item.path}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/60 dark:border-neutral-800/40"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-xs font-mono text-neutral-400 w-4">{idx + 1}</span>
                  <span className="font-mono text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {item.path}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-full font-mono text-xs font-bold border border-cyan-500/20">
                  <Users className="w-3 h-3" />
                  <span>{item.activeCount}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 text-xs text-neutral-500 space-y-1">
            <div className="font-semibold text-neutral-700 dark:text-neutral-300">
              Ephemeral In-Memory Tracking
            </div>
            <p className="text-[11px] leading-relaxed">
              Active sessions time out after 5 minutes of inactivity. IPs are salted and hashed on
              the fly.
            </p>
          </div>
        </div>

        {/* Live Streaming Events Feed */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Live Ingested Telemetry Feed
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                {ws.liveEvents.length} events buffered
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Streaming updates</span>
            </div>
          </div>

          {/* Event Stream List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {ws.liveEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                Listening on WebSocket... click &quot;Simulate Telemetry Click&quot; above to push an event.
              </div>
            ) : (
              ws.liveEvents.map((evt) => {
                const DeviceIcon =
                  evt.deviceType === 'desktop'
                    ? Laptop
                    : evt.deviceType === 'mobile'
                    ? Smartphone
                    : Tablet;

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200/60 dark:border-neutral-800/50 hover:border-cyan-500/50 hover:bg-neutral-100/80 dark:hover:bg-neutral-900 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          evt.eventName.includes('checkout') || evt.eventName.includes('signup')
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : evt.eventName.includes('click')
                            ? 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/30'
                            : 'bg-blue-500/15 text-blue-500 border border-blue-500/30'
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                            {evt.eventName}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">
                          {evt.pageUrl}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-neutral-400 font-mono">
                        <DeviceIcon className="w-3.5 h-3.5" />
                        <span>{evt.browser}</span>
                        <span>•</span>
                        <span>{evt.country}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-cyan-500 transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Selected Event Inspect Drawer Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Telemetry Event Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase">Event Name</span>
                  <div className="font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                    {selectedEvent.eventName}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase">Timestamp</span>
                  <div className="font-mono text-neutral-700 dark:text-neutral-300 mt-0.5">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase">Anonymized Visitor Hash</span>
                <div className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 break-all mt-0.5">
                  {selectedEvent.visitorHash}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400">Device</span>
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 capitalize mt-0.5">
                    {selectedEvent.deviceType}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400">Browser</span>
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {selectedEvent.browser}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400">Country</span>
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 mt-0.5">
                    {selectedEvent.country}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                  Payload Properties (JSON)
                </span>
                <pre className="p-3 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-[11px] overflow-x-auto border border-neutral-800">
                  {JSON.stringify(selectedEvent.properties, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
