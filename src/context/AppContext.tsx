import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  Workspace,
  Project,
  Task,
  Document,
  FileItem,
  ChatConversation,
  AIAgent,
  CalendarEvent,
  NotificationItem,
  MemoryItem,
  WorkflowItem,
  TeamMember,
  ToastMessage,
  AppRoute,
  TaskStatus,
  Role,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_WORKSPACES,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_DOCUMENTS,
  INITIAL_FILES,
  INITIAL_CHATS,
  INITIAL_AGENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEMORIES,
  INITIAL_WORKFLOWS,
  INITIAL_TEAM,
} from '../data/mockData';
import { sendChatMessage } from '../services/aiService';

interface AppContextType {
  // Auth & Workspace
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;

  // Navigation & Layout
  currentRoute: AppRoute;
  routeParam: string | null;
  navigate: (route: AppRoute, param?: string) => void;
  isDark: boolean;
  theme: 'dark' | 'light';
  toggleDarkMode: () => void;
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // AI Configuration Settings
  aiModel: string;
  setAiModel: (model: string) => void;
  temperature: number;
  setTemperature: (temp: number) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
  removeToast: (id: string) => void;

  // Context Selection for AI
  activeProjectContext: Project | null;
  setActiveProjectContext: (p: Project | null) => void;
  activeDocumentContext: Document | null;
  setActiveDocumentContext: (d: Document | null) => void;

  // Projects
  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'comments'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;
  addTaskComment: (taskId: string, commentText: string) => void;

  // Documents
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'updatedAt' | 'versionsCount'>) => Document;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  toggleFavoriteDocument: (id: string) => void;

  // Files
  files: FileItem[];
  addFile: (file: Omit<FileItem, 'id' | 'date'>) => FileItem;
  deleteFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;

  // Chat
  chats: ChatConversation[];
  activeChatId: string;
  setActiveChatId: (id: string) => void;
  activeChat: ChatConversation | undefined;
  createNewChat: (initialPrompt?: string) => ChatConversation;
  renameChat: (id: string, newTitle: string) => void;
  deleteChat: (id: string) => void;
  togglePinChat: (id: string) => void;
  toggleArchiveChat: (id: string) => void;
  sendMessage: (text: string) => Promise<void>;
  isAiGenerating: boolean;

  // AI Agents
  agents: AIAgent[];

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  deleteCalendarEvent: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Memories
  memories: MemoryItem[];
  addMemory: (category: MemoryItem['category'], text: string) => void;
  deleteMemory: (id: string) => void;
  toggleMemory: (id: string) => void;

  // Workflows
  workflows: WorkflowItem[];
  toggleWorkflow: (id: string) => void;
  runWorkflow: (id: string) => void;

  // Team
  team: TeamMember[];
  inviteTeamMember: (name: string, email: string, role: Role, department: string) => void;
  updateMemberRole: (id: string, role: Role) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('nova_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('nova_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('nova_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // Auth State
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const isAuthenticated = user !== null;

  const login = (email: string, name?: string) => {
    setUser({
      id: 'usr-' + Date.now(),
      name: name || email.split('@')[0] || 'Nova User',
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Owner',
      title: 'Workspace Architect',
      department: 'Product Strategy',
    });
    setCurrentRoute('/dashboard');
    addToast('success', `Welcome back, ${name || email.split('@')[0]}!`);
  };

  const logout = () => {
    setUser(null);
    setCurrentRoute('/');
    addToast('info', 'You have been signed out.');
  };

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(INITIAL_WORKSPACES[0]);

  // Route state
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/dashboard');
  const [routeParam, setRouteParam] = useState<string | null>(null);

  const navigate = useCallback((route: AppRoute, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param || null);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // AI Configuration State
  const [aiModel, setAiModel] = useState<string>('gemini-2.5-pro');
  const [temperature, setTemperature] = useState<number>(0.7);

  // Layout UI
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Entities Data
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [chats, setChats] = useState<ChatConversation[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>(INITIAL_CHATS[0].id);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const agents = INITIAL_AGENTS;

  // Active AI Context
  const [activeProjectContext, setActiveProjectContext] = useState<Project | null>(INITIAL_PROJECTS[0]);
  const [activeDocumentContext, setActiveDocumentContext] = useState<Document | null>(INITIAL_DOCUMENTS[0]);

  // Project Actions
  const addProject = useCallback((p: Omit<Project, 'id' | 'createdAt'>) => {
    const newProj: Project = {
      ...p,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProj, ...prev]);
    addToast('success', `Project "${newProj.name}" created.`);
    return newProj;
  }, [addToast]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast('info', 'Project updated.');
  }, [addToast]);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Project removed.');
  }, [addToast]);

  // Task Actions
  const addTask = useCallback((t: Omit<Task, 'id' | 'createdAt' | 'comments'>) => {
    const newTask: Task = {
      ...t,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    addToast('success', `Task "${newTask.title}" added.`);
    return newTask;
  }, [addToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast('info', 'Task updated.');
  }, [addToast]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast('info', 'Task deleted.');
  }, [addToast]);

  const moveTaskStatus = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  }, []);

  const addTaskComment = useCallback((taskId: string, commentText: string) => {
    const comment = {
      id: 'c-' + Date.now(),
      author: user?.name || 'You',
      authorAvatar: user?.avatar,
      text: commentText,
      createdAt: 'Just now',
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t))
    );
    addToast('success', 'Comment added.');
  }, [user, addToast]);

  // Document Actions
  const addDocument = useCallback((doc: Omit<Document, 'id' | 'updatedAt' | 'versionsCount'>) => {
    const newDoc: Document = {
      ...doc,
      id: 'doc-' + Date.now(),
      updatedAt: 'Just now',
      versionsCount: 1,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addToast('success', `Document "${newDoc.title}" created.`);
    return newDoc;
  }, [addToast]);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: 'Just now' } : d))
    );
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast('info', 'Document removed.');
  }, [addToast]);

  const toggleFavoriteDocument = useCallback((id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
    );
  }, []);

  // File Actions
  const addFile = useCallback((file: Omit<FileItem, 'id' | 'date'>) => {
    const newFile: FileItem = {
      ...file,
      id: 'file-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setFiles((prev) => [newFile, ...prev]);
    addToast('success', `File "${newFile.name}" uploaded.`);
    return newFile;
  }, [addToast]);

  const deleteFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addToast('info', 'File deleted.');
  }, [addToast]);

  const updateFile = useCallback((id: string, updates: Partial<FileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  // Chat Actions
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const createNewChat = useCallback((initialPrompt?: string) => {
    const newChat: ChatConversation = {
      id: 'chat-' + Date.now(),
      title: initialPrompt ? initialPrompt.slice(0, 32) + '...' : 'New Conversation',
      lastMessage: initialPrompt || 'Conversation initiated.',
      updatedAt: 'Just now',
      isPinned: false,
      isArchived: false,
      contextProjectId: activeProjectContext?.id,
      messages: initialPrompt
        ? [
            {
              id: 'm-' + Date.now(),
              role: 'user',
              content: initialPrompt,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]
        : [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat;
  }, [activeProjectContext]);

  const renameChat = useCallback((id: string, newTitle: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c)));
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (remaining.length > 0 && activeChatId === id) {
        setActiveChatId(remaining[0].id);
      }
      return remaining;
    });
    addToast('info', 'Conversation deleted.');
  }, [activeChatId, addToast]);

  const togglePinChat = useCallback((id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c)));
  }, []);

  const toggleArchiveChat = useCallback((id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, isArchived: !c.isArchived } : c)));
    addToast('info', 'Conversation archive status updated.');
  }, [addToast]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessageId = 'm-' + Date.now();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: userMessageId,
      role: 'user' as const,
      content: text,
      timestamp: nowTime,
    };

    // Append user message immediately
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            title: isFirstMessage ? text.slice(0, 32) + (text.length > 32 ? '...' : '') : c.title,
            lastMessage: text,
            updatedAt: 'Just now',
            messages: [...c.messages, userMsg],
          };
        }
        return c;
      })
    );

    setIsAiGenerating(true);

    try {
      const currentConversation = chats.find((c) => c.id === activeChatId);
      const conversationHistory = (currentConversation?.messages || []).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const contextPayload = {
        projectName: activeProjectContext?.name,
        projectStatus: activeProjectContext?.status,
        projectDescription: activeProjectContext?.description,
        documentTitles: documents.slice(0, 4).map((d) => d.title),
        activeDocumentContent: activeDocumentContext?.content,
        taskCount: tasks.filter((t) => t.status !== 'DONE').length,
        memories: memories.filter((m) => m.active).map((m) => m.text),
      };

      const response = await sendChatMessage(text, conversationHistory, contextPayload);

      const aiMsg = {
        id: 'ai-' + Date.now(),
        role: 'assistant' as const,
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextUsed: activeProjectContext
          ? `Using: ${activeProjectContext.name} + ${documents.length} Docs`
          : undefined,
      };

      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              lastMessage: response.reply.slice(0, 60) + '...',
              updatedAt: 'Just now',
              messages: [...c.messages, aiMsg],
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      addToast('error', 'Unable to reach Nova AI. Check network connection.');
    } finally {
      setIsAiGenerating(false);
    }
  }, [activeChatId, chats, activeProjectContext, activeDocumentContext, documents, tasks, memories, addToast]);

  // Calendar
  const addCalendarEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: 'ev-' + Date.now(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
    addToast('success', `Event "${newEvent.title}" scheduled.`);
    return newEvent;
  }, [addToast]);

  const deleteCalendarEvent = useCallback((id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
    addToast('info', 'Event cancelled.');
  }, [addToast]);

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'All notifications marked as read.');
  }, [addToast]);

  // Memories
  const addMemory = useCallback((category: MemoryItem['category'], text: string) => {
    const newMem: MemoryItem = {
      id: 'mem-' + Date.now(),
      category,
      text,
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };
    setMemories((prev) => [newMem, ...prev]);
    addToast('success', 'Workspace memory saved.');
  }, [addToast]);

  const deleteMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    addToast('info', 'Memory deleted.');
  }, [addToast]);

  const toggleMemory = useCallback((id: string) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  }, []);

  // Workflows
  const toggleWorkflow = useCallback((id: string) => {
    setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w)));
    addToast('info', 'Workflow updated.');
  }, [addToast]);

  const runWorkflow = useCallback((id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, lastRun: 'Just now' } : w))
    );
    addToast('success', 'Workflow executed successfully by Nova AI.');
  }, [addToast]);

  // Team
  const inviteTeamMember = useCallback((name: string, email: string, role: Role, department: string) => {
    const newMember: TeamMember = {
      id: 'tm-' + Date.now(),
      name,
      email,
      role,
      status: 'Invited',
      lastActive: 'Invitation Sent',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      department,
    };
    setTeam((prev) => [...prev, newMember]);
    addToast('success', `Invitation sent to ${email}.`);
  }, [addToast]);

  const updateMemberRole = useCallback((id: string, role: Role) => {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    addToast('info', 'Member role updated.');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        workspaces,
        activeWorkspace,
        setActiveWorkspace,

        currentRoute,
        routeParam,
        navigate,
        isDark,
        theme: isDark ? 'dark' : 'light',
        toggleDarkMode,
        toggleTheme: toggleDarkMode,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileNavOpen,
        setIsMobileNavOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,

        aiModel,
        setAiModel,
        temperature,
        setTemperature,

        toasts,
        addToast,
        removeToast,

        activeProjectContext,
        setActiveProjectContext,
        activeDocumentContext,
        setActiveDocumentContext,

        projects,
        addProject,
        updateProject,
        deleteProject,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        addTaskComment,

        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        toggleFavoriteDocument,

        files,
        addFile,
        deleteFile,
        updateFile,

        chats,
        activeChatId,
        setActiveChatId,
        activeChat,
        createNewChat,
        renameChat,
        deleteChat,
        togglePinChat,
        toggleArchiveChat,
        sendMessage,
        isAiGenerating,

        agents,

        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,

        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,

        memories,
        addMemory,
        deleteMemory,
        toggleMemory,

        workflows,
        toggleWorkflow,
        runWorkflow,

        team,
        inviteTeamMember,
        updateMemberRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
