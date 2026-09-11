import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Play,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  X,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import {
  createAlert,
  toggleAlert,
  testAlert,
  deleteAlert,
} from '../../services/aetherApi';
import type { AlertRule } from '../../types/analytics';

export const AlertsView: React.FC = () => {
  const { alerts, alertLogs, refreshAlerts, activeProject } = useAether();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  // New alert form state
  const [name, setName] = useState('');
  const [metric, setMetric] = useState('visitors');
  const [condition, setCondition] = useState<'gt' | 'lt'>('gt');
  const [threshold, setThreshold] = useState<number>(50);
  const [timeWindowMin, setTimeWindowMin] = useState<number>(15);

  const handleToggle = async (id: string) => {
    await toggleAlert(id);
    await refreshAlerts();
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      await testAlert(id);
      await refreshAlerts();
    } finally {
      setTimeout(() => setTestingId(null), 600);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAlert(id);
    await refreshAlerts();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await createAlert({
      projectId: activeProject.id,
      name,
      metric: metric as any,
      condition: condition as any,
      threshold: Number(threshold),
      timeWindowMin: Number(timeWindowMin),
      notificationMethod: 'dashboard',
      enabled: true,
    });

    await refreshAlerts();
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <Bell className="w-4 h-4 text-cyan-500" />
            <span>Telemetry Alerts & Thresholds</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {alerts.length} Rules Active
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Automated alerts dispatched via real-time WebSocket when metrics exceed limits
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Configured Threshold Rules
        </h3>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-xl ${
                    alert.enabled
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white">
                      {alert.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        alert.enabled
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {alert.enabled ? 'ACTIVE' : 'MUTED'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                    When <strong>{alert.metric}</strong> is{' '}
                    <strong>{alert.condition.toUpperCase()}</strong> {alert.threshold} in{' '}
                    {alert.timeWindowMin}m
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTest(alert.id)}
                  disabled={testingId === alert.id}
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  title="Fire test alert over WebSocket"
                >
                  <Play className={`w-3 h-3 ${testingId === alert.id ? 'animate-spin' : ''}`} />
                  <span>Test Fire</span>
                </button>

                <button
                  onClick={() => handleToggle(alert.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {alert.enabled ? 'Disable' : 'Enable'}
                </button>

                <button
                  onClick={() => handleDelete(alert.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Triggered History Log */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Triggered Alerts History
        </h3>

        <div className="space-y-2">
          {alertLogs.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No alert triggers recorded yet. Use &ldquo;Test Fire&rdquo; above to simulate an alert.
            </div>
          ) : (
            alertLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/80 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-sans font-semibold text-neutral-900 dark:text-white">
                    {log.alertName}
                  </span>
                  <span className="text-neutral-500">
                    Crossed threshold {log.threshold} with value{' '}
                    <strong className="text-amber-500">{log.currentValue}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  {new Date(log.triggeredAt || log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Create Alert Rule
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Alert Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traffic Spike Alert"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Metric
                  </label>
                  <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="visitors">Active Visitors</option>
                    <option value="events_per_min">Events Per Minute</option>
                    <option value="bounce_rate">Bounce Rate (%)</option>
                    <option value="conversion_rate">Conversion Rate (%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="gt">Greater than (&gt;)</option>
                    <option value="lt">Less than (&lt;)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Threshold Value
                  </label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Time Window (min)
                  </label>
                  <input
                    type="number"
                    value={timeWindowMin}
                    onChange={(e) => setTimeWindowMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Alert Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
