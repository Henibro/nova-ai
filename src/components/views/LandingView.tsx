import React from 'react';
import {
  Activity,
  ShieldCheck,
  Radio,
  Server,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  GitFork,
  Gauge,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';

export const LandingView: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { ws } = useAether();

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500 selection:text-neutral-950">
      {/* Navigation Header */}
      <nav className="h-20 border-b border-neutral-800/80 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">Aether Analytics</span>
            <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              v1.0 Self-Hostable
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('/realtime')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-cyan-400 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Stream</span>
          </button>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-lg shadow-cyan-500/20"
          >
            Launch Platform
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% GDPR, CCPA & PECR Compliant • Zero Cookies Required</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Privacy-first analytics for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            modern web products.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Self-hostable telemetry, real-time WebSocket streams, Core Web Vitals monitoring, and
          conversion funnels without selling your users&apos; privacy.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-200 transition-all shadow-xl shadow-white/10 group"
          >
            <span>Enter Live Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('/realtime')}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-900 text-neutral-200 font-semibold text-sm transition-all"
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Watch Live Telemetry ({ws.activeVisitors} active)</span>
          </button>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Tracking Cookies</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            No cookie banners needed. Uses cryptographically salted rotating daily hashes to compute
            unique visitors and bounce rates safely.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Live WebSocket Stream</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Observe incoming telemetry events in real time. Push notifications and alert thresholds
            trigger instantaneously via WebSockets.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Self-Hostable with Docker</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Own 100% of your data. Deploy with a single <code>docker-compose up</code> command with
            PostgreSQL 16 and Redis.
          </p>
        </div>
      </div>

      {/* Product Capabilities Matrix */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 border-t border-neutral-800/80">
        <h2 className="text-2xl font-bold text-center mb-10">Complete Telemetry Architecture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center space-x-2.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Interactive Multi-Axis Charts</span>
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center space-x-2.5">
            <GitFork className="w-4 h-4 text-blue-400" />
            <span>Multi-Step Funnel Analysis</span>
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center space-x-2.5">
            <Gauge className="w-4 h-4 text-emerald-400" />
            <span>Core Web Vitals (LCP, INP, CLS)</span>
          </div>
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/30 flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Threshold Alert Engine</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-10 px-6 text-center text-xs text-neutral-500">
        <p>Aether Analytics • Privacy-first telemetry for modern web products • Designed for Henok Alem</p>
      </footer>
    </div>
  );
};
