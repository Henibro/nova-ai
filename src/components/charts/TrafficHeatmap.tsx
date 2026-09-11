import React, { useState } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export const TrafficHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; count: number } | null>(null);

  // Generate realistic traffic heat distribution: peaks between 10am - 4pm weekdays
  const getCellIntensity = (dayIdx: number, hour: number) => {
    const isWeekend = dayIdx >= 5;
    const base = isWeekend ? 20 : 40;
    const peakBoost = hour >= 9 && hour <= 17 ? (isWeekend ? 30 : 60) : 10;
    const lunchDip = hour === 12 || hour === 13 ? -10 : 0;
    const noise = ((dayIdx * 7 + hour * 13) % 25) - 10;
    const val = Math.max(5, Math.min(100, base + peakBoost + lunchDip + noise));
    return val;
  };

  const getColorClass = (val: number) => {
    if (val < 20) return 'bg-cyan-950/20 dark:bg-cyan-950/40 text-neutral-400';
    if (val < 40) return 'bg-cyan-800/30 dark:bg-cyan-900/50 text-cyan-300';
    if (val < 60) return 'bg-cyan-600/50 dark:bg-cyan-700/60 text-cyan-200';
    if (val < 80) return 'bg-cyan-500/70 dark:bg-cyan-600/80 text-white';
    return 'bg-cyan-400 dark:bg-cyan-400 text-neutral-950 font-bold';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[580px]">
        {/* Hour Header labels */}
        <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono">
          <div />
          {hours.map((h) => (
            <div key={h} className="text-center">
              {h % 3 === 0 ? `${h}h` : ''}
            </div>
          ))}
        </div>

        {/* Heatmap Matrix */}
        <div className="space-y-1">
          {days.map((day, dIdx) => (
            <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 items-center">
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 text-left">
                {day}
              </span>
              {hours.map((h) => {
                const intensity = getCellIntensity(dIdx, h);
                const visitors = Math.round(intensity * 14.5);
                return (
                  <div
                    key={h}
                    onMouseEnter={() => setHoveredCell({ day, hour: h, count: visitors })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-5 rounded-sm transition-transform hover:scale-125 hover:z-10 cursor-pointer ${getColorClass(
                      intensity
                    )}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend and Hover info */}
        <div className="mt-3 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px]">Less active</span>
            <span className="w-3 h-3 rounded-xs bg-cyan-950/30 dark:bg-cyan-950/60" />
            <span className="w-3 h-3 rounded-xs bg-cyan-800/40 dark:bg-cyan-900/60" />
            <span className="w-3 h-3 rounded-xs bg-cyan-600/60 dark:bg-cyan-700/70" />
            <span className="w-3 h-3 rounded-xs bg-cyan-500/80 dark:bg-cyan-600/90" />
            <span className="w-3 h-3 rounded-xs bg-cyan-400" />
            <span className="text-[11px]">Peak active</span>
          </div>

          <div>
            {hoveredCell ? (
              <span className="font-mono text-cyan-600 dark:text-cyan-400">
                {hoveredCell.day} at {hoveredCell.hour}:00 —{' '}
                <strong>{hoveredCell.count.toLocaleString()} visitors</strong>
              </span>
            ) : (
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Hover over grid to inspect hourly density
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
