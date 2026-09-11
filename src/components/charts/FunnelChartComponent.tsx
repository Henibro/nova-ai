import React from 'react';
import { ArrowDown, Users, ChevronRight } from 'lucide-react';
import type { Funnel } from '../../types/analytics';

export const FunnelChartComponent: React.FC<{ funnel: Funnel }> = ({ funnel }) => {
  const maxVisitors = funnel.steps[0]?.visitors || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            {funnel.name}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {funnel.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Overall Conversion</div>
          <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {funnel.overallConversion}%
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {funnel.steps.map((step, idx) => {
          const widthPct = Math.max(12, Math.round((step.visitors / maxVisitors) * 100));
          const isLast = idx === funnel.steps.length - 1;
          const prevStep = idx > 0 ? funnel.steps[idx - 1] : null;
          const stepConversion = prevStep
            ? Math.round((step.visitors / prevStep.visitors) * 1000) / 10
            : 100;

          return (
            <div key={step.id} className="relative">
              {/* Step Header */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-mono text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {step.name}
                  </span>
                  {step.targetUrl && (
                    <span className="text-[11px] font-mono text-neutral-500">
                      {step.targetUrl}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {step.visitors.toLocaleString()} visitors
                  </span>
                  <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold w-12 text-right">
                    {Math.round((step.visitors / maxVisitors) * 1000) / 10}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with Gradient */}
              <div className="h-7 w-full bg-neutral-100 dark:bg-neutral-800/60 rounded-xl overflow-hidden p-0.5">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-end px-3 transition-all duration-700 shadow-sm"
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="text-[11px] font-mono font-bold text-white tracking-wide">
                    {widthPct}%
                  </span>
                </div>
              </div>

              {/* Transition / Dropoff Indicator */}
              {!isLast && (
                <div className="flex items-center justify-between text-[11px] py-1 px-3 text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center space-x-1.5">
                    <ArrowDown className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Drop-off: </span>
                    <span className="font-mono font-semibold text-rose-500 dark:text-rose-400">
                      -{step.dropoffRate}% ({step.dropoffCount.toLocaleString()} users)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                    <span>Step conversion:</span>
                    <span>{stepConversion}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
