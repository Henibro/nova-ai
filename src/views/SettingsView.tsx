import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  User,
  Sliders,
  Users,
  Key,
  Bell,
  Moon,
  Sun,
  Shield,
  Check,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    aiModel,
    setAiModel,
    temperature,
    setTemperature,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'ai' | 'members' | 'api' | 'notifications'
  >('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex.vance@nova.ai');

  // Members state
  const [members, setMembers] = useState([
    { id: '1', name: 'Alex Vance', email: 'alex.vance@nova.ai', role: 'Owner' },
    { id: '2', name: 'Elena Rostova', email: 'elena.rostova@nova.ai', role: 'Admin' },
    { id: '3', name: 'Marcus Chen', email: 'marcus.chen@nova.ai', role: 'Editor' },
    { id: '4', name: 'Sarah Jenkins', email: 'sarah.j@nova.ai', role: 'Viewer' },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Editor');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profile settings updated.');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: newMemberRole,
      },
    ]);
    setNewMemberEmail('');
    addToast('success', `Invited ${newMemberEmail} to the workspace.`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage workspace profile, AI model configurations, members, and security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile & Account', icon: User },
          { id: 'ai', label: 'AI Intelligence Config', icon: Sparkles },
          { id: 'members', label: 'Team Members', icon: Users },
          { id: 'api', label: 'Integrations & API', icon: Key },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Profile Details</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Color Theme
              </label>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
              >
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: AI Intelligence Config */}
      {activeTab === 'ai' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">AI Engine Configuration</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Select foundational LLM models and fine-tune inference temperature for workspace generation.
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Active Reasoning Model
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAiModel('gemini-2.5-pro')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    aiModel === 'gemini-2.5-pro'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Gemini 2.5 Pro</span>
                    {aiModel === 'gemini-2.5-pro' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Complex reasoning, coding architecture, and deep document synthesis.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAiModel('gemini-2.5-flash')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    aiModel === 'gemini-2.5-flash'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Gemini 2.5 Flash</span>
                    {aiModel === 'gemini-2.5-flash' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Sub-second latency, quick summaries, and rapid conversational triage.
                  </p>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-zinc-700 dark:text-zinc-300">Creativity / Temperature</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>Deterministic (0.1)</span>
                <span>Balanced (0.7)</span>
                <span>Highly Creative (1.0)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Members */}
      {activeTab === 'members' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Workspace Members</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Invite collaborators and assign role-based permissions.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddMember} className="flex gap-2 max-w-lg">
            <input
              type="email"
              required
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="flex-1 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shrink-0"
            >
              Invite
            </button>
          </form>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-zinc-100 dark:border-zinc-800">
            {members.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">{m.name}</h4>
                  <p className="text-[11px] text-zinc-400">{m.email}</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: API & Integrations */}
      {activeTab === 'api' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">API & Connected Services</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Connect external services and manage webhook delivery endpoints.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Google Cloud Platform / Gemini', status: 'Connected', desc: 'Active inference provider via server proxy.' },
              { name: 'GitHub Repositories', status: 'Connected', desc: 'Sync project branches, commit feeds, and issues.' },
              { name: 'Slack Workspace Notifications', status: 'Ready to Connect', desc: 'Broadcast milestone alerts to team channels.' },
            ].map((conn, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{conn.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{conn.desc}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    conn.status === 'Connected'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {conn.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">Notification Preferences</h3>
          <div className="space-y-3">
            {[
              'Email digest when assigned to a new task',
              'Instant alert when an AI agent completes a long-running research synthesis',
              'Daily morning brief notification on active sprint priorities',
              'Project milestone achievement confirmations',
            ].map((pref, i) => (
              <label key={i} className="flex items-center gap-3 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-indigo-600" />
                <span>{pref}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
