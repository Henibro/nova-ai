import React, { useState, useEffect } from 'react';
import { GitFork, Plus, ArrowDown, TrendingUp, Sparkles, X } from 'lucide-react';
import { FunnelChartComponent } from '../charts/FunnelChartComponent';
import { fetchFunnels, createFunnel } from '../../services/aetherApi';
import type { Funnel } from '../../types/analytics';

export const FunnelsView: React.FC = () => {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Funnel Form state
  const [newFunnelName, setNewFunnelName] = useState('');
  const [newFunnelDesc, setNewFunnelDesc] = useState('');
  const [steps, setSteps] = useState([
    { name: 'Home Landing', targetUrl: '/' },
    { name: 'View Pricing', targetUrl: '/pricing' },
    { name: 'Completed Checkout', targetUrl: '/checkout/success' },
  ]);

  useEffect(() => {
    fetchFunnels().then((data) => {
      setFunnels(data);
      setLoading(false);
    });
  }, []);

  const handleAddStep = () => {
    setSteps([...steps, { name: `Step ${steps.length + 1}`, targetUrl: '/new-step' }]);
  };

  const handleStepChange = (index: number, field: 'name' | 'targetUrl', val: string) => {
    const updated = [...steps];
    updated[index][field] = val;
    setSteps(updated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFunnelName) return;

    const formattedSteps = steps.map((s, idx) => {
      const visitors = Math.max(100, Math.round(5000 / Math.pow(1.8, idx)));
      return {
        id: `step_${idx + 1}`,
        stepOrder: idx + 1,
        name: s.name,
        targetUrl: s.targetUrl,
        visitors,
        dropoffCount: idx < steps.length - 1 ? Math.round(visitors * 0.42) : 0,
        dropoffRate: idx < steps.length - 1 ? 42.0 : 0,
        conversionRate: idx === 0 ? 100 : 58.0,
      };
    });

    const newFunnel = await createFunnel({
      name: newFunnelName,
      description: newFunnelDesc || 'Custom conversion funnel',
      steps: formattedSteps,
      overallConversion: 9.8,
      totalStarted: 5000,
      totalCompleted: 490,
    });

    setFunnels([...funnels, newFunnel]);
    setIsModalOpen(false);
    setNewFunnelName('');
    setNewFunnelDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Product Conversion Funnels</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {funnels.length} Active Funnels
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Analyze where visitors convert or abandon user journeys
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Funnel</span>
        </button>
      </div>

      {/* Funnels List */}
      <div className="space-y-6">
        {funnels.map((funnel) => (
          <div
            key={funnel.id}
            className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs"
          >
            <FunnelChartComponent funnel={funnel} />
          </div>
        ))}
      </div>

      {/* Create Funnel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Create Conversion Funnel
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Funnel Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Onboarding Flow"
                  value={newFunnelName}
                  onChange={(e) => setNewFunnelName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the expected user journey"
                  value={newFunnelDesc}
                  onChange={(e) => setNewFunnelDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Funnel Steps (in sequence)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    + Add Step
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center space-x-2"
                    >
                      <span className="font-mono text-neutral-400 w-4">{idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Step name"
                        value={step.name}
                        onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="/path or event"
                        value={step.targetUrl}
                        onChange={(e) => handleStepChange(idx, 'targetUrl', e.target.value)}
                        className="w-36 px-2 py-1 bg-transparent border-b border-neutral-300 dark:border-neutral-700 font-mono text-xs focus:outline-none text-neutral-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-xs"
                >
                  Save Funnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
