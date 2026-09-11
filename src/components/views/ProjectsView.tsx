import React, { useState } from 'react';
import { FolderGit2, Key, Copy, Check, Plus, RefreshCw, Code, ShieldCheck, X } from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { createProject } from '../../services/aetherApi';

export const ProjectsView: React.FC = () => {
  const { projects, setProjects, activeProject, switchProject } = useAether();
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDomain, setProjectDomain] = useState('');

  const hostUrl = typeof window !== 'undefined' ? window.location.origin : 'https://aetheranalytics.io';

  const scriptTag = `<script defer src="${hostUrl}/aether.js" data-project-id="${activeProject.id}" data-host="${hostUrl}"></script>`;

  const reactSnippet = `import { initAether } from '@aether/analytics';

initAether({
  projectId: '${activeProject.id}',
  host: '${hostUrl}',
  autoTrackPageView: true,
  autoTrackPerformance: true,
});`;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(activeProject.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;
    const created = await createProject({ name: projectName, domain: projectDomain || 'example.com' });
    setProjects([...projects, created]);
    switchProject(created.id);
    setIsModalOpen(false);
    setProjectName('');
    setProjectDomain('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-cyan-500" />
            <span>Projects & Tracking Embed</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Manage projects, generate API credentials, and get embed snippets
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Active Project & API Key Card */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {activeProject.name}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-500 mt-0.5">{activeProject.domain}</p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-500">Project ID:</span>
            <code className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-cyan-600 dark:text-cyan-400">
              {activeProject.id}
            </code>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center space-x-1.5">
            <Key className="w-3.5 h-3.5 text-cyan-500" />
            <span>Live Telemetry API Key</span>
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200 truncate">
              {activeProject.apiKey}
            </div>
            <button
              onClick={handleCopyKey}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition-colors"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embed Code Snippet Generator */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
              <Code className="w-4 h-4 text-cyan-500" />
              <span>Embed Telemetry Script (Lightweight &lt;3KB)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Paste into your HTML &lt;head&gt; tag. Automatically tracks pageviews, clicks, and Core
              Web Vitals without cookies.
            </p>
          </div>
          <button
            onClick={handleCopyScript}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Copied Snippet' : 'Copy HTML Snippet'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto border border-neutral-800 leading-relaxed">
          {scriptTag}
        </pre>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            For React / Next.js / TypeScript Projects:
          </span>
          <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto border border-neutral-800 leading-relaxed">
            {reactSnippet}
          </pre>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          All Workspace Projects ({projects.length})
        </h3>

        <div className="space-y-2">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => switchProject(proj.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                proj.id === activeProject.id
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-600 dark:text-cyan-400'
                  : 'bg-neutral-50 dark:bg-neutral-950/40 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold font-sans text-neutral-900 dark:text-white">
                  {proj.name}
                </div>
                <div className="text-[11px] font-mono text-neutral-500">{proj.domain}</div>
              </div>
              <div className="text-xs font-mono">
                {proj.id === activeProject.id ? (
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">Current Active</span>
                ) : (
                  <span className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
                    Select
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Create New Telemetry Project
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile Landing App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Domain (FQDN)
                </label>
                <input
                  type="text"
                  placeholder="app.example.com"
                  value={projectDomain}
                  onChange={(e) => setProjectDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none font-mono"
                />
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
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
