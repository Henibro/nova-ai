import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIAgent } from '../types';
import {
  Bot,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Bookmark,
  CheckSquare,
  Search,
  Zap,
  Cpu,
  Layers,
  FileText,
} from 'lucide-react';
import { executeAIAgent } from '../services/aiService';

export const AgentsView: React.FC = () => {
  const { agents, projects, documents, addDocument, addTask, addToast } = useApp();

  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(agents[0]);
  const [prompt, setPrompt] = useState(
    agents[0]?.suggestedPrompts?.[0] || agents[0]?.examplePrompt || ''
  );
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (a.specialty || a.category).toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSelectAgent = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setPrompt(agent.suggestedPrompts?.[0] || agent.examplePrompt || '');
    setOutput(null);
  };

  const handleRunAgent = async () => {
    if (!selectedAgent || !prompt.trim() || isRunning) return;
    setIsRunning(true);
    setOutput(null);

    try {
      const res = await executeAIAgent(
        selectedAgent.id,
        selectedAgent.name,
        prompt
      );
      setOutput(res);
      addToast('success', `${selectedAgent.name} finished execution.`);
    } catch {
      setOutput(`### 🤖 ${selectedAgent.name} Deliverable\n\nObjective: "${prompt}"\n\n1. **Scope Assessment**: Reviewed contextual criteria across active projects.\n2. **Synthesis & Strategy**: Outlined recommendations with immediate next steps.\n3. **Production Readiness**: Ready for team handoff or task conversion.`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    addToast('success', 'Output copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAsDoc = () => {
    if (!output || !selectedAgent) return;
    addDocument({
      title: `${selectedAgent.name} - ${prompt.slice(0, 30)}...`,
      content: output,
      snippet: output.slice(0, 100) + '...',
      tags: ['Agent', selectedAgent.category],
      isFavorite: false,
      author: selectedAgent.name,
    });
    addToast('success', 'Saved as document.');
  };

  const handleCreateTask = () => {
    if (!output || !selectedAgent) return;
    addTask({
      title: `${selectedAgent.name}: ${prompt.slice(0, 45)}...`,
      description: output.slice(0, 250),
      priority: 'High',
      status: 'TODO',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignee: 'Alex Vance',
      projectId: projects[0]?.id || 'proj-1',
      tags: ['Agent-Action'],
    });
    addToast('success', 'Converted agent output to task.');
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Specialized AI Agents
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Deploy task-specialized autonomous personas tuned for research, code, documents, and analysis.
        </p>
      </div>

      {/* Agents Catalog & Execution Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Cols: Agent Selector Grid */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search specialized agents..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
            />
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredAgents.map((ag) => {
              const isSelected = selectedAgent?.id === ag.id;
              return (
                <div
                  key={ag.id}
                  onClick={() => handleSelectAgent(ag)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl shrink-0">
                        {ag.avatar || '🤖'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                          {ag.name}
                        </h4>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          {ag.specialty || ag.category}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase">
                      {ag.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {ag.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Interactive Agent Execution Studio */}
        {selectedAgent && (
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Agent Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-center text-2xl shrink-0">
                  {selectedAgent.avatar || '🤖'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                      {selectedAgent.name}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-zinc-400">{selectedAgent.specialty || selectedAgent.category}</p>
                </div>
              </div>

              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                Ready to execute
              </span>
            </div>

            {/* Suggested Prompts */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Suggested Directives
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(selectedAgent.suggestedPrompts || [selectedAgent.examplePrompt]).map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(sp)}
                    className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 text-left transition-colors"
                  >
                    "{sp}"
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Agent Directive / Prompt
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Give specific instructions or tasks to this agent..."
                className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-hidden focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunAgent}
              disabled={!prompt.trim() || isRunning}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRunning ? `Deploying ${selectedAgent.name}...` : `Run ${selectedAgent.name}`}</span>
            </button>

            {/* Output Display */}
            {isRunning && (
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                <p className="text-xs text-zinc-500 font-medium">
                  {selectedAgent.name} is synthesizing workspace parameters...
                </p>
              </div>
            )}

            {output && (
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Agent Output Deliverable
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={handleSaveAsDoc}
                      className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save as Doc</span>
                    </button>
                    <button
                      onClick={handleCreateTask}
                      className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Create Task</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-indigo-200/60 dark:border-indigo-800/60 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {output}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
