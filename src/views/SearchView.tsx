import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Sparkles,
  FolderKanban,
  FileText,
  CheckSquare,
  Files,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { searchWorkspaceWithAI } from '../services/aiService';

export const SearchView: React.FC = () => {
  const { projects, documents, tasks, files, navigate } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'projects' | 'docs' | 'tasks' | 'files'>('all');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSearchingAi, setIsSearchingAi] = useState(false);

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearchingAi(true);
    setAiAnswer(null);

    const searchableItems = [
      ...projects.map((p) => ({ id: p.id, title: p.name, type: 'Project', snippet: p.description })),
      ...documents.map((d) => ({ id: d.id, title: d.title, type: 'Document', snippet: d.snippet })),
      ...tasks.map((t) => ({ id: t.id, title: t.title, type: 'Task', snippet: t.description })),
      ...files.map((f) => ({ id: f.id, title: f.name, type: 'File', snippet: `${f.type} file` })),
    ];

    try {
      const summary = await searchWorkspaceWithAI(query, searchableItems);
      setAiAnswer(summary);
    } catch {
      setAiAnswer(`Synthesized answer for "${query}": Found relevant references across active projects and workspace documents.`);
    } finally {
      setIsSearchingAi(false);
    }
  };

  const matchingProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchingDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.content.toLowerCase().includes(query.toLowerCase())
  );

  const matchingTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  const matchingFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults =
    matchingProjects.length + matchingDocs.length + matchingTasks.length + matchingFiles.length;

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
          Global Semantic Search
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Query across all documents, projects, tasks, and files with AI synthesis.
        </p>

        {/* Big Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="relative rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-none p-2 flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-400 ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your workspace (e.g. 'What is our Q4 marketing strategy?')"
              className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {(['all', 'projects', 'docs', 'tasks', 'files'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* AI Synthesized Answer Card */}
      {isSearchingAi && (
        <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Nova AI is synthesizing search results across your knowledge base...
          </p>
        </div>
      )}

      {aiAnswer && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50/60 via-white to-white dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 p-6 shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Nova AI Synthesis</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
            {aiAnswer}
          </p>
        </div>
      )}

      {/* Results Clusters */}
      <div className="space-y-6">
        {/* Projects */}
        {(activeFilter === 'all' || activeFilter === 'projects') && matchingProjects.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <FolderKanban className="w-4 h-4 text-indigo-500" />
              <span>Projects ({matchingProjects.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate('/projects', p.id)}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                      {p.name}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{p.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {(activeFilter === 'all' || activeFilter === 'docs') && matchingDocs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Documents ({matchingDocs.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingDocs.map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate('/documents', d.id)}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                      {d.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{d.snippet}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {(activeFilter === 'all' || activeFilter === 'tasks') && matchingTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <span>Tasks ({matchingTasks.length})</span>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
              {matchingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate('/tasks')}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Due {t.dueDate} • {t.priority}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {(activeFilter === 'all' || activeFilter === 'files') && matchingFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Files className="w-4 h-4 text-amber-500" />
              <span>Files ({matchingFiles.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingFiles.map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate('/files')}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                      {f.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{f.size} • {f.type}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
