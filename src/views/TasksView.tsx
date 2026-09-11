import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../types';
import {
  CheckSquare,
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Sparkles,
  MessageSquare,
  User as UserIcon,
  Tag,
  Clock,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { sendChatMessage } from '../services/aiService';

export const TasksView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    moveTaskStatus,
    addTaskComment,
    projects,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  // New Task Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newStatus, setNewStatus] = useState<TaskStatus>('TODO');
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
  );
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '');
  const [newAssignee, setNewAssignee] = useState('Alex Vance');

  // AI Task Assistant
  const [aiSubtasks, setAiSubtasks] = useState<string[]>([]);
  const [isAiDecomposing, setIsAiDecomposing] = useState(false);

  const columns: Array<{ id: TaskStatus; label: string; countColor: string }> = [
    { id: 'TODO', label: 'To Do', countColor: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300' },
    { id: 'IN PROGRESS', label: 'In Progress', countColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' },
    { id: 'REVIEW', label: 'In Review', countColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' },
    { id: 'DONE', label: 'Completed', countColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' },
  ];

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchesProject = filterProject === 'All' || t.projectId === filterProject;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesProject && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate,
      assignee: newAssignee,
      projectId: newProjectId,
      tags: ['Sprint'],
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDecomposeWithAI = async (task: Task) => {
    setIsAiDecomposing(true);
    setAiSubtasks([]);

    try {
      const prompt = `Break down the task "${task.title}" (${task.description}) into 4 actionable technical sub-tasks with estimated completion hours. Return concise bullet points.`;
      const response = await sendChatMessage(prompt);
      const lines = response.reply
        .split('\n')
        .filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*') || /^\d+\./.test(l.trim()))
        .map((l) => l.replace(/^[-*\d.\s]+/, '').trim());

      setAiSubtasks(lines.length > 0 ? lines : ['1. Research baseline requirements (2h)', '2. Draft wireframe specifications (3h)', '3. Review with engineering team (1h)']);
      addToast('success', 'AI generated sub-task breakdown.');
    } catch {
      setAiSubtasks([
        '1. Finalize component layout hierarchy (2h)',
        '2. Implement responsive styling and states (3h)',
        '3. Validate WCAG color contrast guidelines (1h)',
        '4. Commit review build to staging branch (1h)',
      ]);
    } finally {
      setIsAiDecomposing(false);
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'Urgent':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      case 'High':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      case 'Medium':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900';
      case 'Low':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Kanban workflow, AI task decomposition, and milestone coordination.
          </p>
        </div>

        <button
          id="btn-open-create-task-modal"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-hidden"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Project filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-hidden"
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-zinc-500 ${viewMode === 'board' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : ''}`}
              title="Kanban view"
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
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      {col.label}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.countColor}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 min-h-[150px]">
                  {colTasks.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-2xs cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-zinc-400">{task.dueDate}</span>
                        </div>

                        <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 leading-snug">
                          {task.title}
                        </h4>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-400">
                          <span className="truncate max-w-[120px]">{task.assignee}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Quick status transition dropdown */}
                            <select
                              value={task.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                moveTaskStatus(task.id, e.target.value as TaskStatus);
                              }}
                              className="text-[10px] bg-zinc-100 dark:bg-zinc-800 rounded px-1 py-0.5 text-zinc-600 dark:text-zinc-300"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN PROGRESS">In Progress</option>
                              <option value="REVIEW">Review</option>
                              <option value="DONE">Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden shadow-2xs">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTask(t)}
              className="p-4 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveTaskStatus(t.id, t.status === 'DONE' ? 'TODO' : 'DONE');
                  }}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    t.status === 'DONE'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-700 hover:border-emerald-500'
                  }`}
                >
                  {t.status === 'DONE' && <CheckCircle2 className="w-3 h-3" />}
                </button>
                <div>
                  <h4 className={`text-xs font-semibold ${t.status === 'DONE' ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Due {t.dueDate} • Assigned to {t.assignee}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityBadge(t.priority)}`}>
                  {t.priority}
                </span>
                <span className="text-[11px] font-bold text-zinc-500">{t.status}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail & AI Breakdown Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTask(null);
          }}
        >
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getPriorityBadge(selectedTask.priority)}`}>
                  {selectedTask.priority} Priority
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-2">
                  {selectedTask.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {selectedTask.description || 'No detailed description provided.'}
            </p>

            {/* Task Info Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-[11px] text-zinc-400">Status:</span>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    const newSt = e.target.value as TaskStatus;
                    moveTaskStatus(selectedTask.id, newSt);
                    setSelectedTask({ ...selectedTask, status: newSt });
                  }}
                  className="w-full mt-1 p-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN PROGRESS">In Progress</option>
                  <option value="REVIEW">In Review</option>
                  <option value="DONE">Completed</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-zinc-400">Due Date:</span>
                <p className="font-semibold mt-1 text-zinc-800 dark:text-zinc-200">{selectedTask.dueDate}</p>
              </div>
            </div>

            {/* AI Task Decomposition Engine */}
            <div className="p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    Nova AI Sub-Task Generator
                  </span>
                </div>
                <button
                  onClick={() => handleDecomposeWithAI(selectedTask)}
                  disabled={isAiDecomposing}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  {isAiDecomposing ? 'Decomposing...' : 'Generate Steps'}
                </button>
              </div>

              {aiSubtasks.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                  {aiSubtasks.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Comments ({selectedTask.comments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedTask.comments?.map((c) => (
                  <div key={c.id} className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-xs space-y-1">
                    <div className="flex items-center justify-between text-zinc-400 text-[10px]">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{c.author}</span>
                      <span>{c.createdAt}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                />
                <button
                  onClick={() => {
                    if (!newComment.trim()) return;
                    addTaskComment(selectedTask.id, newComment);
                    setNewComment('');
                  }}
                  className="px-3 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold"
                >
                  Comment
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
              <button
                onClick={() => {
                  deleteTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Delete Task
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Create New Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Design executive dashboard wireframe"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details, requirements, and deliverables..."
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
