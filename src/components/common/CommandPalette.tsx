import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sparkles,
  FolderKanban,
  FileText,
  CheckSquare,
  Bot,
  Calendar,
  Settings,
  X,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { AppRoute } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    navigate,
    projects,
    documents,
    tasks,
    createNewChat,
    addTask,
    addDocument,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickPages: Array<{ name: string; route: AppRoute; icon: React.ElementType }> = [
    { name: 'Dashboard', route: '/dashboard', icon: Sparkles },
    { name: 'AI Chat', route: '/chat', icon: Sparkles },
    { name: 'Projects', route: '/projects', icon: FolderKanban },
    { name: 'Documents', route: '/documents', icon: FileText },
    { name: 'Tasks Board', route: '/tasks', icon: CheckSquare },
    { name: 'AI Agents', route: '/agents', icon: Bot },
    { name: 'Calendar', route: '/calendar', icon: Calendar },
    { name: 'Settings', route: '/settings', icon: Settings },
  ];

  const filteredPages = quickPages.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleExecuteAiPrompt = () => {
    if (!query.trim()) return;
    createNewChat(query);
    setIsCommandPaletteOpen(false);
    navigate('/chat');
  };

  const handleCreateQuickTask = () => {
    if (!query.trim()) return;
    addTask({
      title: query,
      description: 'Quick task created from Command Center',
      priority: 'Medium',
      status: 'TODO',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignee: 'Alex Vance',
      projectId: projects[0]?.id || 'proj-1',
      tags: ['QuickTask'],
    });
    setIsCommandPaletteOpen(false);
    navigate('/tasks');
  };

  const handleCreateQuickDoc = () => {
    if (!query.trim()) return;
    addDocument({
      title: query,
      content: `# ${query}\n\nDrafted with Nova AI intelligent workspace.`,
      snippet: 'Drafted with Nova AI...',
      tags: ['Draft'],
      isFavorite: false,
      author: 'Alex Vance',
    });
    setIsCommandPaletteOpen(false);
    navigate('/documents');
  };

  return (
    <div
      id="command-palette-modal-backdrop"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCommandPaletteOpen(false);
      }}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        {/* Top Search Bar */}
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteAiPrompt();
              if (e.key === 'Escape') setIsCommandPaletteOpen(false);
            }}
            placeholder="Type a command, question, or search workspace..."
            className="flex-1 bg-transparent text-sm sm:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline px-2 py-0.5 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Action Results Container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Direct AI Action if query is present */}
          {query.trim() && (
            <div className="p-1 space-y-1">
              <button
                id="cmd-ask-nova-action"
                onClick={handleExecuteAiPrompt}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 transition-colors text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium">
                    Ask Nova AI: <strong className="font-semibold">"{query}"</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-500 opacity-80 group-hover:opacity-100">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                <button
                  id="cmd-create-task-action"
                  onClick={handleCreateQuickTask}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Create Task: "{query.slice(0, 24)}..."</span>
                </button>
                <button
                  id="cmd-create-doc-action"
                  onClick={handleCreateQuickDoc}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span>Create Document: "{query.slice(0, 24)}..."</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-2.5 pb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Navigation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.route}
                      onClick={() => {
                        navigate(page.route);
                        setIsCommandPaletteOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-zinc-400" />
                      <span>{page.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects Match */}
          {filteredProjects.length > 0 && (
            <div>
              <p className="px-2.5 pb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Projects
              </p>
              <div className="space-y-1">
                {filteredProjects.slice(0, 3).map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      navigate('/projects', proj.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-medium">{proj.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{proj.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents Match */}
          {filteredDocs.length > 0 && (
            <div>
              <p className="px-2.5 pb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Documents
              </p>
              <div className="space-y-1">
                {filteredDocs.slice(0, 3).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      navigate('/documents', doc.id);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium truncate max-w-sm">{doc.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{doc.updatedAt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Match */}
          {filteredTasks.length > 0 && (
            <div>
              <p className="px-2.5 pb-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Tasks
              </p>
              <div className="space-y-1">
                {filteredTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      navigate('/tasks');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-medium truncate max-w-sm">{task.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{task.priority}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-[11px] text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">↑↓</kbd></span>
            <span>Select: <kbd className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">Enter</kbd></span>
          </div>
          <span>Powered by Nova AI & Gemini</span>
        </div>
      </div>
    </div>
  );
};
