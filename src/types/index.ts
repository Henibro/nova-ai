export type Role = 'Owner' | 'Admin' | 'Member' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title?: string;
  department?: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Business';
  membersCount: number;
  ownerId: string;
  logoUrl?: string;
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  owner: string;
  members: string[];
  deadline: string;
  createdAt: string;
  category: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'TODO' | 'IN PROGRESS' | 'REVIEW' | 'DONE';

export interface TaskComment {
  id: string;
  author: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignee: string;
  assigneeAvatar?: string;
  projectId: string;
  tags: string[];
  comments: TaskComment[];
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  snippet: string;
  projectId?: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
  author: string;
  versionsCount: number;
}

export type SupportedFileType = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image' | 'txt' | 'csv';

export interface FileItem {
  id: string;
  name: string;
  type: SupportedFileType;
  size: string;
  owner: string;
  date: string;
  url?: string;
  folderId?: string;
  projectId?: string;
  analysis?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reactions?: {
    liked?: boolean;
    disliked?: boolean;
  };
  contextUsed?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  isPinned: boolean;
  isArchived: boolean;
  contextProjectId?: string;
  messages: ChatMessage[];
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
  avatar?: string;
  specialty?: string;
  suggestedPrompts?: string[];
  capabilities: string[];
  instructions: string;
  category: string;
  examplePrompt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  participants?: string[];
  projectId?: string;
  type: 'event' | 'deadline' | 'review' | 'milestone' | 'meeting';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'deadline' | 'project' | 'comment' | 'file' | 'ai' | 'team';
  read: boolean;
  timestamp: string;
  linkRoute?: string;
}

export interface MemoryItem {
  id: string;
  category: 'preference' | 'workspace' | 'project' | 'instruction';
  text: string;
  createdAt: string;
  active: boolean;
}

export interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: string[];
  active: boolean;
  lastRun?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Invited';
  lastActive: string;
  avatar: string;
  department: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export type AppRoute =
  | '/'
  | '/login'
  | '/signup'
  | '/forgot-password'
  | '/dashboard'
  | '/chat'
  | '/projects'
  | '/documents'
  | '/files'
  | '/tasks'
  | '/calendar'
  | '/agents'
  | '/search'
  | '/team'
  | '/settings'
  | '/billing'
  | '/workflows';
