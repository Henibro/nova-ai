import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Zap,
  Check,
  Download,
  ShieldCheck,
  HardDrive,
  Users,
  Sparkles,
} from 'lucide-react';

export const BillingView: React.FC = () => {
  const { addToast } = useApp();
  const [activePlan, setActivePlan] = useState<'Free' | 'Pro' | 'Enterprise'>('Pro');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Personal productivity & light AI experimentation.',
      features: [
        '50,000 monthly AI tokens',
        '2 active projects',
        '500 MB storage',
        'Standard response speed',
      ],
      current: activePlan === 'Free',
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'Full workspace intelligence for high-velocity teams.',
      features: [
        '10,000,000 monthly AI tokens',
        'Unlimited projects & documents',
        '50 GB intelligent storage',
        'All 7 specialized AI agents',
        'Gemini 2.5 Pro reasoning models',
        'Priority server execution',
      ],
      popular: true,
      current: activePlan === 'Pro',
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per user / mo',
      description: 'Dedicated cloud compliance and custom fine-tuning.',
      features: [
        'Unlimited AI tokens',
        'Custom fine-tuned agent personas',
        'Dedicated SLA & private cloud VPC',
        'SSO / SAML & audit logs',
        'Unlimited team seats & storage',
      ],
      current: activePlan === 'Enterprise',
    },
  ];

  const invoices = [
    { id: 'INV-2026-009', date: 'Sep 01, 2026', amount: '$29.00', status: 'Paid' },
    { id: 'INV-2026-008', date: 'Aug 01, 2026', amount: '$29.00', status: 'Paid' },
    { id: 'INV-2026-007', date: 'Jul 01, 2026', amount: '$29.00', status: 'Paid' },
  ];

  const handleSelectPlan = (planName: 'Free' | 'Pro' | 'Enterprise') => {
    setActivePlan(planName);
    addToast('success', `Switched workspace plan to ${planName}.`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Plans & Usage
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor real-time AI token consumption, active seats, and plan tier settings.
        </p>
      </div>

      {/* Current Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Token Usage */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Monthly AI Tokens</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">2.4M</span>
            <span className="text-xs text-zinc-400">/ 10M</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '24%' }} />
          </div>
          <p className="text-[11px] text-zinc-400">Resets on Oct 01, 2026 (76% remaining)</p>
        </div>

        {/* Storage */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Vector Storage</span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">14.8 GB</span>
            <span className="text-xs text-zinc-400">/ 50 GB</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
          </div>
          <p className="text-[11px] text-zinc-400">35.2 GB available</p>
        </div>

        {/* Team Seats */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Active Team Seats</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">4</span>
            <span className="text-xs text-zinc-400">/ 10 seats</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
          </div>
          <p className="text-[11px] text-zinc-400">6 seat invites remaining</p>
        </div>
      </div>

      {/* Plan Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
              p.popular
                ? 'border-2 border-indigo-600 bg-white dark:bg-zinc-900 shadow-xl relative'
                : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Recommended
              </span>
            )}

            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">{p.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{p.description}</p>

              <div className="mt-4 mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">
                  {p.price}
                </span>
                <span className="text-xs text-zinc-400">/{p.period}</span>
              </div>

              <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(p.name as any)}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs mt-6 transition-all ${
                p.current
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white cursor-default'
                  : p.popular
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white'
              }`}
            >
              {p.current ? 'Current Plan' : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Payment Method</h3>
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Visa ending in 4242</h4>
                <p className="text-[11px] text-zinc-400">Expires 08/2028</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              Default
            </span>
          </div>
        </div>

        {/* Invoice History */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Billing History</h3>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-white">{inv.id}</span>
                  <p className="text-[10px] text-zinc-400">{inv.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{inv.amount}</span>
                  <button
                    onClick={() => addToast('success', `Receipt ${inv.id} downloaded.`)}
                    className="p-1 rounded text-zinc-400 hover:text-indigo-600"
                    title="Download receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
