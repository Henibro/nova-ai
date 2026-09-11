import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectStatus } from '../types';
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  CheckSquare,
  FileText,
  Sparkles,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Users,
  AlertCircle,
} from 'lucide-react';
import { sendChatMessage } from '../services/aiService';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    tasks,
    documents,
    routeParam,
    navigate,
    setActiveProjectContext,
    addToast,
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(routeParam || null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('Product');
  const [newProjectDueDate, setNewProjectDueDate] = useState('2026-11-30');
  const [newProjectStatus, setNewProjectStatus] = useState<ProjectStatus>('Planning');

  // AI Project Assistant in Detail View
  const [projectAiPrompt, setProjectAiPrompt] = useState('');
  const [projectAiResponse, setProjectAiResponse] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const selectedProject = projects.find((p) => p.id === (selectedProjectId || routeParam));

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const created = addProject({
      name: newProjectName,
      description: newProjectDesc || 'Created with Nova AI Workspace',
      status: newProjectStatus,
      progress: 0,
      tasksCount: 0,
      dueDate: newProjectDueDate,
      members: ['Alex Vance', 'Elena Rostova'],
      category: newProjectCategory,
    });

    setIsCreateModalOpen(false);
    setNewProjectName('');
    setNewProjectDesc('');
    setSelectedProjectId(created.id);
  };

  const handleRunProjectAI = async (actionPrompt: string) => {
    if (!selectedProject) return;
    setIsAiThinking(true);
    setProjectAiResponse(null);

    try {
      const response = await sendChatMessage(
        actionPrompt,
        [],
        {
          projectId: selectedProject.id,
          projectName: selectedProject.name,
          projectDescription: selectedProject.description,
          projectStatus: selectedProject.status,
          taskCount: tasks.filter((t) => t.projectId === selectedProject.id).length,
        }
      );
      setProjectAiResponse(response.reply);
    } catch {
      setProjectAiResponse(
        `### Analysis for ${selectedProject.name}\n\n- Milestone health: Steady progression at ${selectedProject.progress}%.\n- Immediate recommendations: Ensure sprint velocity remains aligned with the ${selectedProject.dueDate} target.`
      );
    } finally {
      setIsAiThinking(false);
    }
  };

  // If a project is selected, render Project Detail View
  if (selectedProject) {
    const projectTasks = tasks.filter((t) => t.projectId === selectedProject.id);
    const projectDocs = documents.filter((d) => d.projectId === selectedProject.id);

    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProjectId(null)}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <span>← Back to all projects</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveProjectContext(selectedProject);
                addToast('success', `Grounded AI chat in "${selectedProject.name}"`);
                navigate('/chat');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Chat about this Project</span>
            </button>

            <button
              onClick={() => {
                deleteProject(selectedProject.id);
                setSelectedProjectId(null);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Header Banner */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {selectedProject.status}
                </span>
                <span className="text-xs text-zinc-400">Due {selectedProject.dueDate}</span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs text-zinc-400">{selectedProject.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                {selectedProject.name}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Progress Circle & Team */}
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <div className="text-right">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">
                  {selectedProject.progress}%
                </span>
                <p className="text-xs text-zinc-400">Overall Completion</p>
              </div>

              <div className="w-48 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Team:</span>
                <div className="flex -space-x-1.5">
                  {selectedProject.members.map((m, idx) => (
                    <span
                      key={idx}
                      className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-zinc-900"
                      title={m}
                    >
                      {m[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Project Copilot Section */}
        <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 bg-gradient-to-r from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-zinc-900 dark:to-zinc-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Nova AI Project Copilot
                </h3>
                <p className="text-xs text-zinc-500">
                  Analyze schedule velocity, generate milestone roadmaps, or assess project risks.
                </p>
              </div>
            </div>
          </div>

          {/* Copilot Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() =>
                handleRunProjectAI(
                  `Generate a 4-phase milestone plan with concrete weekly targets for project: ${selectedProject.name}`
                )
              }
              className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
            >
              Generate Milestone Plan
            </button>
            <button
              onClick={() =>
                handleRunProjectAI(
                  `Conduct a risk assessment covering scope creep, design dependencies, and launch readiness for: ${selectedProject.name}`
                )
              }
              className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
            >
              Risk Assessment
            </button>
            <button
              onClick={() =>
                handleRunProjectAI(
                  `Draft an executive weekly status report summarizing work completed and upcoming deliverables for: ${selectedProject.name}`
                )
              }
              className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-zinc-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
            >
              Executive Status Report
            </button>
          </div>

          {/* AI Result Box */}
          {isAiThinking && (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Nova AI is analyzing project metrics and generating recommendations...</span>
            </div>
          )}

          {projectAiResponse && (
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-indigo-200/80 dark:border-indigo-800/80 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap animate-in fade-in">
              {projectAiResponse}
            </div>
          )}
        </div>

        {/* Project Tasks & Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Tasks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Project Tasks ({projectTasks.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add Task
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {projectTasks.length === 0 ? (
                <p className="text-xs text-zinc-400 py-3 text-center">No tasks linked yet.</p>
              ) : (
                projectTasks.map((t) => (
                  <div key={t.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Due {t.dueDate} • Assigned to {t.assignee}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold shrink-0">
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Project Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                  Attached Documents ({projectDocs.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('/documents')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + New Document
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {projectDocs.length === 0 ? (
                <p className="text-xs text-zinc-400 py-3 text-center">No documents associated yet.</p>
              ) : (
                projectDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => navigate('/documents', d.id)}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {d.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400">{d.updatedAt}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render Project Catalog / List View
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Organize milestones, coordinate team efforts, and utilize AI assistance.
          </p>
        </div>

        <button
          id="btn-open-create-project-modal"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Control Bar: Filters, Search, and View Mode */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'In Progress', 'Planning', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-zinc-500 ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-zinc-500 ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <FolderKanban className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No projects found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try adjusting your filter or create a new project.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.status === 'In Progress'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : p.status === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">{p.category}</span>
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-zinc-400 font-normal">Progress</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{p.progress}%</span>
                </div>

                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex -space-x-1.5">
                    {p.members.map((m, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[9px] flex items-center justify-center ring-1 ring-white dark:ring-zinc-900"
                      >
                        {m[0]}
                      </span>
                    ))}
                  </div>
                  <span>Due {p.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden shadow-2xs">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    {p.name}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">{p.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <span className="text-xs font-semibold text-zinc-500">{p.progress}%</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    p.status === 'In Progress'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {p.status}
                </span>
                <span className="text-xs text-zinc-400 hidden sm:inline">{p.dueDate}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Create New Project
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Mobile App 2.0"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Outline core objectives and goals..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newProjectCategory}
                    onChange={(e) => setNewProjectCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Product">Product</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={newProjectDueDate}
                    onChange={(e) => setNewProjectDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all"
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
