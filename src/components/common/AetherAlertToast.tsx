import React from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useAether } from '../../context/AetherContext';

export const AetherAlertToast: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { ws } = useAether();

  if (!ws.lastAlert) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-white/95 dark:bg-neutral-900/95 shadow-2xl backdrop-blur-md flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Live Real-Time Alert
            </span>
            <button
              onClick={ws.clearLastAlert}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5 truncate">
            {ws.lastAlert.alert?.name || 'Threshold Crossed'}
          </h4>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-1">
            {ws.lastAlert.message}
          </p>
          <div className="mt-2.5 flex items-center space-x-3">
            <button
              onClick={() => {
                ws.clearLastAlert();
                onNavigate('/alerts');
              }}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>View in Alerts Center</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
