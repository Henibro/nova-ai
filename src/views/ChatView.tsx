import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Pin,
  FolderKanban,
  FileText,
  Copy,
  Check,
  Bookmark,
  RefreshCw,
  Search,
  MessageSquare,
  Bot,
  Brain,
  Paperclip,
  CheckSquare,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    createNewChat,
    deleteChat,
    togglePinChat,
    sendMessage,
    isAiGenerating,
    projects,
    documents,
    activeProjectContext,
    setActiveProjectContext,
    activeDocumentContext,
    setActiveDocumentContext,
    addDocument,
    addTask,
    addToast,
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isAiGenerating]);

  const handleSend = async () => {
    if (!input.trim() || isAiGenerating) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    addToast('success', 'Copied to clipboard.');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveAsDocument = (content: string) => {
    const firstLine = content.split('\n')[0].replace(/^[#*\s]+/, '').slice(0, 40) || 'AI Generated Document';
    addDocument({
      title: firstLine,
      content,
      snippet: content.slice(0, 100) + '...',
      tags: ['AI-Generated'],
      isFavorite: false,
      author: 'Nova AI',
      projectId: activeProjectContext?.id,
    });
    addToast('success', 'Saved as new document.');
  };

  const handleCreateTaskFromAi = (content: string) => {
    const taskTitle = content.split('\n')[0].replace(/^[#*\s-]+/, '').slice(0, 50) || 'Action item from AI';
    addTask({
      title: taskTitle,
      description: content.slice(0, 200),
      priority: 'High',
      status: 'TODO',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      assignee: 'Alex Vance',
      projectId: activeProjectContext?.id || projects[0]?.id || 'proj-1',
      tags: ['AI-Extracted'],
    });
    addToast('success', 'Created task from AI suggestion.');
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const promptSuggestions = [
    { label: 'Summarize active project', prompt: 'Provide a concise progress breakdown and key risks for the active project.' },
    { label: 'Extract next sprint tasks', prompt: 'Review our workspace context and generate 4 prioritized sprint tasks with deadlines.' },
    { label: 'Draft executive update', prompt: 'Write an executive weekly update covering key achievements, upcoming launches, and blockers.' },
    { label: 'Audit active document', prompt: 'Analyze the focused document for structural clarity, technical precision, and missing sections.' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white dark:bg-zinc-950">
      {/* 1. Conversations Sidebar */}
      <div className="w-72 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0 hidden md:flex">
        {/* New Chat Button & Search */}
        <div className="p-3 border-b border-zinc-200/80 dark:border-zinc-800/80 space-y-2">
          <button
            id="chat-btn-new-conversation"
            onClick={() => createNewChat()}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map((c) => {
            const isActive = c.id === activeChatId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveChatId(c.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800/90 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-500' : 'text-zinc-400'}`} />
                  <span className="truncate">{c.title}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinChat(c.id);
                    }}
                    className={`p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 ${c.isPinned ? 'text-amber-500' : 'text-zinc-400'}`}
                    title={c.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  {chats.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(c.id);
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Context Attachment Indicator at Bottom of Sidebar */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-[11px] uppercase tracking-wider">
              Grounding Context
            </span>
            <button
              onClick={() => setIsContextModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 text-[11px] hover:underline font-medium"
            >
              Configure
            </button>
          </div>
          <p className="text-[11px] text-zinc-500 truncate">
            {activeProjectContext ? `📂 Project: ${activeProjectContext.name}` : '🌐 Entire Workspace'}
          </p>
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950">
        {/* Chat Header */}
        <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                {activeChat?.title || 'Intelligent Conversation'}
              </h2>
            </div>
          </div>

          {/* Context Selector Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsContextModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 transition-colors"
            >
              <Brain className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Active Context:</span>
              <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-[120px]">
                {activeProjectContext?.name || 'Workspace-wide'}
              </span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {(!activeChat?.messages || activeChat.messages.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-4 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white text-2xl shadow-xl shadow-indigo-500/20">
                ✦
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  How can Nova AI help you today?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Ask questions, summarize documents, plan projects, or query your workspace.
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="grid grid-cols-1 gap-2 w-full pt-2">
                {promptSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(item.prompt);
                      setTimeout(() => textareaRef.current?.focus(), 50);
                    }}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all font-medium"
                  >
                    "{item.prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            activeChat.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      isUser
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-gradient-to-tr from-indigo-600 to-sky-400 text-white shadow-sm'
                    }`}
                  >
                    {isUser ? 'You' : '✦'}
                  </div>

                  <div className={`space-y-1.5 flex-1 min-w-0 ${isUser ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <span className="font-semibold">{isUser ? 'You' : 'Nova AI'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-xs text-left inline-block shadow-xs shadow-indigo-600/20'
                          : 'bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 rounded-tl-xs border border-zinc-200/70 dark:border-zinc-800/70'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* AI Message Action Buttons */}
                    {!isUser && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          {copiedMessageId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSaveAsDocument(msg.content)}
                          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Save response as a Document"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Save as Doc</span>
                        </button>

                        <button
                          onClick={() => handleCreateTaskFromAi(msg.content)}
                          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Convert to Task"
                        >
                          <CheckSquare className="w-3 h-3" />
                          <span>Convert to Task</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* AI Generating Skeleton */}
          {isAiGenerating && (
            <div className="flex gap-3.5 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                ✦
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span>Nova AI is synthesizing workspace knowledge...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xs">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2">
              <textarea
                ref={textareaRef}
                id="chat-prompt-textarea"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Nova anything about your workspace, projects, or documents... (Enter to send, Shift+Enter for newline)"
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 resize-none focus:outline-hidden p-1.5"
              />

              <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsContextModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Attach Context</span>
                  </button>
                </div>

                <button
                  id="chat-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim() || isAiGenerating}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
              <span>Nova AI grounds responses in your project workspace data securely.</span>
              <span>Gemini 3.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Selection Modal */}
      {isContextModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsContextModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  Grounding Knowledge Context
                </h3>
              </div>
              <button
                onClick={() => setIsContextModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Done
              </button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Select which project and active document Nova AI should reference for this conversation.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Select Active Project
                </label>
                <select
                  value={activeProjectContext?.id || ''}
                  onChange={(e) => {
                    const found = projects.find((p) => p.id === e.target.value);
                    setActiveProjectContext(found || null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                >
                  <option value="">-- All Projects (General Workspace) --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Select Focused Document
                </label>
                <select
                  value={activeDocumentContext?.id || ''}
                  onChange={(e) => {
                    const found = documents.find((d) => d.id === e.target.value);
                    setActiveDocumentContext(found || null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-hidden"
                >
                  <option value="">-- None (No specific document) --</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setIsContextModalOpen(false)}
              className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Apply Context
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
