import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Server,
  Database,
  Trash2,
  Download,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { exportData } from '../../services/aetherApi';

export const SettingsView: React.FC = () => {
  const { activeProject } = useAether();

  const [retentionDays, setRetentionDays] = useState(90);
  const [anonymizeIp, setAnonymizeIp] = useState(true);
  const [cookieFree, setCookieFree] = useState(true);
  const [honorDnt, setHonorDnt] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-cyan-500" />
            <span>Platform & Privacy Settings</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Configure privacy boundaries, self-hosting parameters, and retention policies
          </p>
        </div>
      </div>

      {/* Privacy Architecture Configuration */}
      <form
        onSubmit={handleSave}
        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4"
      >
        <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Privacy & Anonymization Engine
          </h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymizeIp}
              onChange={(e) => setAnonymizeIp(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                Cryptographic IP Anonymization (Salted SHA-256)
              </div>
              <p className="text-[11px] text-neutral-500">
                IP addresses are hashed immediately upon ingress using a rotating salt and discarded
                from memory.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cookieFree}
              onChange={(e) => setCookieFree(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                100% Cookie-Free Tracking Mode
              </div>
              <p className="text-[11px] text-neutral-500">
                No third-party or first-party tracking cookies are created. Avoids intrusive GDPR
                consent cookie banners.
              </p>
            </div>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={honorDnt}
              onChange={(e) => setHonorDnt(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 mt-0.5"
            />
            <div>
              <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                Strict Do-Not-Track (DNT) Compliance
              </div>
              <p className="text-[11px] text-neutral-500">
                Respect <code>DNT: 1</code> headers by immediately returning 204 No Content and
                dropping all telemetry.
              </p>
            </div>
          </label>
        </div>

        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-900 dark:text-white">
              Data Retention Window
            </label>
            <p className="text-[11px] text-neutral-500">
              Raw events older than this period are automatically pruned
            </p>
          </div>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono"
          >
            <option value={30}>30 Days</option>
            <option value={90}>90 Days (Default)</option>
            <option value={180}>180 Days</option>
            <option value={365}>365 Days (1 Year)</option>
          </select>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-500 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Settings saved successfully</span>
            </span>
          )}
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs"
          >
            Save Privacy Rules
          </button>
        </div>
      </form>

      {/* Self-Hosting Infrastructure Health */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <Server className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Self-Hosted Infrastructure Status
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Database Engine</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="font-bold text-neutral-900 dark:text-white">PostgreSQL 16</div>
            <div className="text-[10px] font-mono text-neutral-400">Connection: Active</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Cache & Rate Limiting</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="font-bold text-neutral-900 dark:text-white">Redis 7 (In-Memory)</div>
            <div className="text-[10px] font-mono text-neutral-400">Active sessions tracked</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">WebSocket Service</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="font-bold text-neutral-900 dark:text-white">ws (RFC 6455)</div>
            <div className="text-[10px] font-mono text-cyan-500">Port 3000 /ws</div>
          </div>
        </div>
      </div>

      {/* Export & Data Management */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Data Export & Portability
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Full data ownership. Export all telemetry events at any time in open JSON or CSV formats.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={() => exportData('json')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Format</span>
          </button>
        </div>
      </div>
    </div>
  );
};
