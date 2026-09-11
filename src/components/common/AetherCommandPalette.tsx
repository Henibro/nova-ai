import React, { useState, useEffect } from 'react';
import {
  Search,
  BarChart3,
  Radio,
  ListFilter,
  GitFork,
  Gauge,
  Users,
  Bell,
  FolderGit2,
  Settings,
  Sparkles,
  Download,
  Moon,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const AetherCommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const { toggleTheme, toggleDemoMode, emitTestEvent } = useAether();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'nav-dash', title: 'Open Dashboard', icon: BarChart3, category: 'Navigation', action: () => onNavigate('/dashboard') },
    { id: 'nav-realtime', title: 'View Real-Time Telemetry', icon: Radio, category: 'Navigation', action: () => onNavigate('/realtime') },
    { id: 'nav-analytics', title: 'Open Analytics Breakdown', icon: BarChart3, category: 'Navigation', action: () => onNavigate('/analytics') },
    { id: 'nav-events', title: 'Search Event Explorer', icon: ListFilter, category: 'Navigation', action: () => onNavigate('/events') },
    { id: 'nav-funnels', title: 'Conversion Funnels', icon: GitFork, category: 'Navigation', action: () => onNavigate('/funnels') },
    { id: 'nav-performance', title: 'Core Web Vitals & Performance', icon: Gauge, category: 'Navigation', action: () => onNavigate('/performance') },
    { id: 'nav-visitors', title: 'Visitor Analytics', icon: Users, category: 'Navigation', action: () => onNavigate('/visitors') },
    { id: 'nav-alerts', title: 'Alerts & Thresholds', icon: Bell, category: 'Navigation', action: () => onNavigate('/alerts') },
    { id: 'nav-projects', title: 'Manage Projects & API Keys', icon: FolderGit2, category: 'Navigation', action: () => onNavigate('/projects') },
    { id: 'nav-settings', title: 'Open Settings', icon: Settings, category: 'Navigation', action: () => onNavigate('/settings') },
    {
      id: 'act-test-evt',
      title: 'Emit Test Telemetry Event (simulate button_click)',
      icon: Zap,
      category: 'Telemetry Actions',
      action: async () => {
        await emitTestEvent('button_click', { buttonId: 'cmd-palette-test', origin: 'command_palette' });
        onNavigate('/realtime');
      },
    },
    { id: 'act-theme', title: 'Toggle Light / Dark Mode', icon: Moon, category: 'Preferences', action: toggleTheme },
    { id: 'act-demo', title: 'Toggle Demo / Live Telemetry Mode', icon: Sparkles, category: 'Preferences', action: toggleDemoMode },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search (e.g. 'funnel', 'realtime', 'theme')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-neutral-400">
              No matching commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-neutral-400">{item.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    ↵ Execute
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Navigate with mouse or enter</span>
          <span className="font-mono text-[10px]">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
