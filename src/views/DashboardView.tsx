import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Plus,
  ArrowRight,
  FolderKanban,
  CheckSquare,
  FileText,
  Files,
  Clock,
  TrendingUp,
  MessageSquare,
  Bot,
  Calendar as CalendarIcon,
  CheckCircle2,
  RefreshCw,
  Flame,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    navigate,
    projects,
    tasks,
    documents,
    files,
    agents,
    createNewChat,
    moveTaskStatus,
    activeProjectContext,
    setActiveProjectContext,
  } = useApp();

  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefingText, setBriefingText] = useState<string>(
    `Good day, ${user?.name || 'Alex'}. Today you have 3 critical milestones due across 2 projects. Priority focus is needed on "Complete homepage hero design" before 5:00 PM. Team momentum is currently high (+18% sprint velocity).`
  );

  const pendingTasks = tasks.filter((t) => t.status !== 'DONE');
  const completedTasks = tasks.filter((t) => t.status === 'DONE');
  const upcomingDeadlines = [...tasks]
    .filter((t) => t.status !== 'DONE')
    .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))
    .slice(0, 4);

  const handleRefreshBriefing = async () => {
    setIsGeneratingBriefing(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:
            'Generate a sharp 3-sentence daily executive briefing for the workspace dashboard summarizing pending tasks and recommendations.',
          context: {
            taskCount: pendingTasks.length,
            projectName: projects[0]?.name,
          },
        }),
      });
      const data = await response.json();
      setBriefingText(data.reply);
    } catch {
      setBriefingText(
        `Briefing synchronized. You have ${pendingTasks.length} pending items. Your top initiative "${projects[0]?.name}" is currently 68% complete and tracking on schedule.`
      );
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  const handleQuickAsk = (prompt: string) => {
    createNewChat(prompt);
    navigate('/chat');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Alex'}
            </h1>
            <span className="text-2xl animate-bounce">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            • Nova AI has indexed 4 projects and 5 documents.
          </p>
        </div>

        {/* Quick Actions Cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-quick-ask-nova"
            onClick={() => handleQuickAsk('What are my highest priority action items today?')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Ask Nova</span>
          </button>

          <button
            id="dash-quick-new-task"
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>New Task</span>
          </button>

          <button
            id="dash-quick-new-doc"
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* 2. AI Daily Executive Briefing */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 bg-gradient-to-r from-indigo-50/70 via-sky-50/40 to-white dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                Nova AI Daily Briefing
              </h2>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Synthesized across all projects, tasks, and team milestones
              </span>
            </div>
          </div>

          <button
            id="dash-btn-refresh-briefing"
            onClick={handleRefreshBriefing}
            disabled={isGeneratingBriefing}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/50 transition-colors"
            title="Regenerate daily briefing"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingBriefing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
          {briefingText}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleQuickAsk('Break down my tasks for today into a timed schedule.')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Plan today's schedule</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <button
            onClick={() => handleQuickAsk('Review blocker risks on active projects.')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Audit project risks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Metric Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => navigate('/projects')}
          className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Projects
            </span>
            <FolderKanban className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {projects.length}
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              3 In Progress
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Average progress 62%</p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => navigate('/tasks')}
          className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Pending Tasks
            </span>
            <CheckSquare className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {pendingTasks.length}
            </span>
            <span className="text-[11px] text-zinc-400 font-normal">
              of {tasks.length} total
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">{completedTasks.length} completed this sprint</p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => navigate('/documents')}
          className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Documents
            </span>
            <FileText className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {documents.length}
            </span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              +2 this week
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">{files.length} attached assets</p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => navigate('/billing')}
          className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              AI Compute
            </span>
            <Flame className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              748
            </span>
            <span className="text-[11px] text-zinc-400">/ 2,500 queries</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Fast Gemini 3.8 active</p>
        </div>
      </div>

      {/* 4. Active Projects & Tasks Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Active Projects
              </h2>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View all projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProjectContext(proj);
                  navigate('/projects', proj.id);
                }}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        proj.status === 'In Progress'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : proj.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {proj.status}
                    </span>
                    <span className="text-xs font-semibold text-zinc-500">{proj.progress}%</span>
                  </div>

                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex -space-x-1.5">
                      {proj.members.map((mem, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[9px] flex items-center justify-center ring-1 ring-white dark:ring-zinc-900"
                        >
                          {mem[0]}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-medium">{proj.tasksCount} tasks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Urgent Deadlines & Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Upcoming Deadlines
              </h2>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All Tasks
            </button>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 divide-y divide-zinc-100 dark:divide-zinc-800/80 shadow-2xs">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">All tasks are up to date.</p>
            ) : (
              upcomingDeadlines.map((task) => (
                <div key={task.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => moveTaskStatus(task.id, 'DONE')}
                      className="mt-0.5 w-4 h-4 rounded border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 flex items-center justify-center transition-colors shrink-0"
                      title="Mark as done"
                    >
                      <CheckCircle2 className="w-3 h-3 text-transparent hover:text-emerald-500" />
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1">
                        <span>Due: {task.dueDate}</span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            task.priority === 'Urgent'
                              ? 'text-rose-500'
                              : task.priority === 'High'
                              ? 'text-amber-500'
                              : 'text-zinc-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick AI Agents launcher */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Featured AI Agents
                </h3>
              </div>
              <button
                onClick={() => navigate('/agents')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View 7
              </button>
            </div>

            <div className="space-y-2">
              {agents.slice(0, 3).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => navigate('/agents')}
                  className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{ag.avatar}</span>
                    <div className="truncate">
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{ag.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{ag.specialty}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Run</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Documents and Workspaces Overview */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Recent Workspace Documents
            </h2>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Open Document Hub</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {documents.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate('/documents', doc.id)}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer bg-zinc-50/40 dark:bg-zinc-950/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-zinc-400 font-medium">
                  {doc.updatedAt}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold">
                  {doc.tags[0] || 'Doc'}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 line-clamp-1">
                {doc.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                {doc.snippet}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
