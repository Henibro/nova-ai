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
  TeamMember
} from '../types';

export const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Alex Vance',
  email: 'alex.vance@nova-workspace.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Owner',
  title: 'Lead Product Architect',
  department: 'Product & AI Engineering',
};

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Nova Core Labs',
    plan: 'Pro',
    membersCount: 8,
    ownerId: 'usr-1',
  },
  {
    id: 'ws-2',
    name: 'Apollo Ventures',
    plan: 'Business',
    membersCount: 16,
    ownerId: 'usr-1',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Nova Website Redesign',
    description: 'Modernize primary customer web portal with responsive layouts, 3D assets, and interactive product tour.',
    status: 'Active',
    progress: 68,
    owner: 'Alex Vance',
    members: ['Alex Vance', 'Sarah Lin', 'Marcus Reed'],
    deadline: '2026-10-15',
    createdAt: '2026-08-01',
    category: 'Design & Frontend',
  },
  {
    id: 'proj-2',
    name: 'Marketing Campaign Q3',
    description: 'Omni-channel global outreach covering developer evangelism, social presence, and enterprise webinars.',
    status: 'Active',
    progress: 42,
    owner: 'Sarah Lin',
    members: ['Sarah Lin', 'David Chen', 'Elena Rostova'],
    deadline: '2026-10-30',
    createdAt: '2026-08-15',
    category: 'Growth & Marketing',
  },
  {
    id: 'proj-3',
    name: 'Financial Analysis & Forecasting',
    description: 'FY2027 revenue simulation, runway estimation under multiple growth trajectories, and vendor expense auditing.',
    status: 'Planning',
    progress: 25,
    owner: 'David Chen',
    members: ['David Chen', 'Alex Vance'],
    deadline: '2026-11-20',
    createdAt: '2026-09-01',
    category: 'Finance & Operations',
  },
  {
    id: 'proj-4',
    name: 'AI Model Research & Context Engine',
    description: 'Integration of Gemini 3.8 multimodal reasoning, contextual vector retrieval, and automated document synthesis.',
    status: 'Completed',
    progress: 100,
    owner: 'Alex Vance',
    members: ['Alex Vance', 'Marcus Reed', 'Dr. Aris Thorne'],
    deadline: '2026-09-05',
    createdAt: '2026-07-10',
    category: 'AI Research',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete homepage hero design',
    description: 'Refine typography scaling, subtle gradient mesh, and responsive mobile layout for main landing view.',
    priority: 'Urgent',
    status: 'IN PROGRESS',
    dueDate: '2026-09-15',
    assignee: 'Alex Vance',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    projectId: 'proj-1',
    tags: ['Design', 'Frontend', 'Hero'],
    comments: [
      {
        id: 'c-1',
        author: 'Sarah Lin',
        text: 'The glassmorphism was replaced with crisp solid borders per the new guidelines. Looks much cleaner!',
        createdAt: 'Yesterday, 4:20 PM',
      },
    ],
    createdAt: '2026-09-08',
  },
  {
    id: 'task-2',
    title: 'Review Q3 financial report',
    description: 'Audit EBITDA assumptions and cloud infrastructure cost breakdowns before board presentation.',
    priority: 'High',
    status: 'TODO',
    dueDate: '2026-09-18',
    assignee: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    projectId: 'proj-3',
    tags: ['Finance', 'Audit'],
    comments: [],
    createdAt: '2026-09-09',
  },
  {
    id: 'task-3',
    title: 'Prepare product launch keynote presentation',
    description: 'Draft 15 slides covering the unified intelligent workspace, AI agent architecture, and customer testimonials.',
    priority: 'High',
    status: 'REVIEW',
    dueDate: '2026-09-22',
    assignee: 'Sarah Lin',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    projectId: 'proj-2',
    tags: ['Marketing', 'Keynote'],
    comments: [
      {
        id: 'c-2',
        author: 'Alex Vance',
        text: 'Nova AI assisted in generating slides 4 through 7. Added to documents folder.',
        createdAt: '2 hours ago',
      },
    ],
    createdAt: '2026-09-04',
  },
  {
    id: 'task-4',
    title: 'Upload project architecture docs',
    description: 'Document the Express API proxy architecture and Gemini client singleton initialization.',
    priority: 'Medium',
    status: 'DONE',
    dueDate: '2026-09-10',
    assignee: 'Marcus Reed',
    assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    projectId: 'proj-4',
    tags: ['Engineering', 'Docs'],
    comments: [],
    createdAt: '2026-09-02',
  },
  {
    id: 'task-5',
    title: 'Conduct user testing sessions for AI Command Center',
    description: 'Gather feedback from 5 beta users on Ctrl+K prompt ergonomics and quick actions.',
    priority: 'Medium',
    status: 'TODO',
    dueDate: '2026-09-26',
    assignee: 'Elena Rostova',
    assigneeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    projectId: 'proj-1',
    tags: ['UX', 'Research'],
    comments: [],
    createdAt: '2026-09-10',
  },
  {
    id: 'task-6',
    title: 'Finalize enterprise SLA agreements',
    description: 'Legal and security team sign-off on 99.95% uptime guarantees and data residency requirements.',
    priority: 'Low',
    status: 'TODO',
    dueDate: '2026-10-05',
    assignee: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    projectId: 'proj-3',
    tags: ['Legal', 'Enterprise'],
    comments: [],
    createdAt: '2026-09-11',
  },
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Project Proposal: Intelligent Workspace Architecture',
    content: `# Project Proposal: Nova AI Intelligent Workspace

## Executive Overview
Nova AI represents a paradigm shift in modern collaborative workspaces by unifying asynchronous task management, real-time smart document drafting, and multimodal AI intelligence under a single coherent interface.

### Strategic Objectives
1. **Reduce Context Switching**: Eliminate the 40% cognitive drag caused by shifting between distinct chat, docs, and project trackers.
2. **Context-Aware Assistance**: Ground all AI interactions directly inside workspace entities (documents, active spreadsheets, project milestones).
3. **Enterprise Privacy & Security**: Ensure strict isolation of tenant knowledge and secure proxying of large language models.

### Proposed Timeline
- **Sprint 1 (Architecture & Shell)**: React 18, Vite, Express proxy, baseline authentication.
- **Sprint 2 (Workspace Intelligence)**: Document editor with inline AI rewrite, Kanban drag-and-drop.
- **Sprint 3 (Agentic Pipelines)**: Specialized AI Agents (Coding, Data Analyst, Research).
- **Sprint 4 (Enterprise Hardening)**: RBAC permissions, audit logging, export capabilities.`,
    snippet: 'Nova AI represents a paradigm shift in modern collaborative workspaces by unifying task management...',
    projectId: 'proj-1',
    updatedAt: '2026-09-11 10:45 AM',
    tags: ['Proposal', 'Architecture', 'Q3'],
    isFavorite: true,
    author: 'Alex Vance',
    versionsCount: 4,
  },
  {
    id: 'doc-2',
    title: 'Marketing Strategy & Go-To-Market 2026',
    content: `# Marketing Strategy & Launch Roadmap

## 1. Value Proposition
Nova AI delivers proactive intelligence. Rather than waiting for passive prompt queries, Nova surfaces pending deadlines, summarizes unread specifications, and pre-populates sprint task assignments.

## 2. Target Personas
- **Technical Founders**: Needing unified oversight of roadmaps and engineering tasks.
- **Product Managers**: Requiring rapid PRD drafting and meeting transcript synthesis.
- **Designers & Engineers**: Benefiting from AI code generation and quick design reviews.

## 3. Channel Strategy
- **Community Evangelism**: Open technical breakdowns, live interactive benchmarks.
- **Product Led Growth (PLG)**: Free tier with generous initial AI usage and instantaneous team invitation.`,
    snippet: 'Nova AI delivers proactive intelligence. Rather than waiting for passive prompt queries...',
    projectId: 'proj-2',
    updatedAt: '2026-09-10 03:15 PM',
    tags: ['Marketing', 'GTM', 'Roadmap'],
    isFavorite: true,
    author: 'Sarah Lin',
    versionsCount: 2,
  },
  {
    id: 'doc-3',
    title: 'Financial Model Summary & Runway Audit',
    content: `# Financial Analysis & Runway Projection

## Key Assumptions
- Monthly Active Team Workspaces: 1,200 growing at 14% MoM.
- Net Expansion Rate: 128% driven by seats and automated AI agent tier upgrades.
- Gross Margin: 78% after optimized caching and vector index compression.

## Capital Efficiency
With current operating expenses of $84k/month and gross cash reserves of $2.8M, our baseline runway extends to 33.3 months without additional financing requirements.`,
    snippet: 'Monthly Active Team Workspaces: 1,200 growing at 14% MoM. Net Expansion Rate: 128%...',
    projectId: 'proj-3',
    updatedAt: '2026-09-09 11:20 AM',
    tags: ['Finance', 'Metrics', 'Runway'],
    isFavorite: false,
    author: 'David Chen',
    versionsCount: 1,
  },
  {
    id: 'doc-4',
    title: 'Research Notes: Next-Gen Agentic Tool Invocation',
    content: `# Research Notes: Gemini 3 Multimodal & Tool Invocations

## Summary of Findings
- **Gemini 3.8 Flash**: Achieves near-instantaneous latency (<400ms first chunk) suitable for inline typing assistants.
- **Thinking Level Config**: Allows dynamic balancing between deep reasoning for architectural challenges and low-latency response for grammar tweaks.
- **Structured Schema Enforcement**: Type.OBJECT validation guarantees zero JSON parse errors for task generation pipelines.`,
    snippet: 'Gemini 3.8 Flash achieves near-instantaneous latency suitable for inline typing assistants...',
    projectId: 'proj-4',
    updatedAt: '2026-09-08 05:30 PM',
    tags: ['AI', 'Research', 'Tech'],
    isFavorite: true,
    author: 'Marcus Reed',
    versionsCount: 3,
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file-1',
    name: 'Executive_Workspace_Brief_2026.pdf',
    type: 'pdf',
    size: '3.4 MB',
    owner: 'Alex Vance',
    date: 'Sep 10, 2026',
    projectId: 'proj-1',
    analysis: 'PDF Summary: Highlights 3 core deliverables for Q3. Key focus is reducing workflow fragmentation and integrating Gemini 3 multimodal models into task execution.',
  },
  {
    id: 'file-2',
    name: 'Q3_Financial_Projections_Model.xlsx',
    type: 'xlsx',
    size: '1.8 MB',
    owner: 'David Chen',
    date: 'Sep 09, 2026',
    projectId: 'proj-3',
    analysis: 'Spreadsheet Insights: Demonstrates 14% MoM revenue growth. Identified 8% reduction in server egress costs following regional cache deployment.',
  },
  {
    id: 'file-3',
    name: 'Nova_Brand_Guidelines_Master.docx',
    type: 'docx',
    size: '5.2 MB',
    owner: 'Sarah Lin',
    date: 'Sep 08, 2026',
    projectId: 'proj-2',
    analysis: 'Brand Document: Outlines typography pairings (Plus Jakarta Sans + JetBrains Mono), neutral color palettes with 5% HSB saturation, and accessible contrast ratios.',
  },
  {
    id: 'file-4',
    name: 'User_Retention_Cohort_Data.csv',
    type: 'csv',
    size: '640 KB',
    owner: 'Elena Rostova',
    date: 'Sep 06, 2026',
    projectId: 'proj-1',
    analysis: 'Data Trends: Cohorts utilizing the AI Command Center (Ctrl+K) exhibit 2.4x higher Day-30 retention and 3.1x greater document collaboration rate.',
  },
  {
    id: 'file-5',
    name: 'Nova_Hero_Concept_Mockup.png',
    type: 'image',
    size: '2.1 MB',
    owner: 'Alex Vance',
    date: 'Sep 05, 2026',
    projectId: 'proj-1',
  },
  {
    id: 'file-6',
    name: 'System_Architecture_Diagram.pptx',
    type: 'pptx',
    size: '4.8 MB',
    owner: 'Marcus Reed',
    date: 'Sep 03, 2026',
    projectId: 'proj-4',
  },
];

export const INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'chat-1',
    title: 'Workspace Architecture & Sprint Planning',
    lastMessage: 'I have formulated the 3-sprint implementation milestone checklist for Nova AI.',
    updatedAt: '10 mins ago',
    isPinned: true,
    isArchived: false,
    contextProjectId: 'proj-1',
    messages: [
      {
        id: 'm-1',
        role: 'user',
        content: 'Hi Nova, can you summarize our website redesign project and tell me what pending tasks need urgent attention?',
        timestamp: '10:14 AM',
      },
      {
        id: 'm-2',
        role: 'assistant',
        content: `### 🌐 Project Summary: Nova Website Redesign

**Current Status**: Active (68% Complete)  
**Assigned Lead**: Alex Vance  
**Target Deadline**: October 15, 2026

#### ⚠️ Urgent Action Items:
1. **Homepage Hero Design**: Urgent priority, currently In Progress with Alex Vance.
2. **User Testing Feedback**: 5 sessions pending with Elena Rostova.

#### 💡 Nova AI Recommendation:
Would you like me to draft a notification announcement for the team or schedule a 15-minute sync review on the calendar?`,
        timestamp: '10:15 AM',
        contextUsed: 'Project: Nova Website Redesign + 2 Tasks',
      },
      {
        id: 'm-3',
        role: 'user',
        content: 'Generate a clean TypeScript snippet for our lazy Gemini initialization on the server.',
        timestamp: '10:18 AM',
      },
      {
        id: 'm-4',
        role: 'assistant',
        content: `Here is the production-ready server initialization pattern using the modern \`@google/genai\` SDK:

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}
\`\`\`

**Key Features**:
- Lazy single-instance allocation
- Environment secret shielding
- Telemetry \`User-Agent\` conformance`,
        timestamp: '10:19 AM',
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Financial Runway & Growth Forecast',
    lastMessage: 'The net cash runway estimate is 33.3 months at current run rate.',
    updatedAt: 'Yesterday',
    isPinned: false,
    isArchived: false,
    contextProjectId: 'proj-3',
    messages: [
      {
        id: 'm-20',
        role: 'user',
        content: 'What is our current runway and can we afford hiring 2 senior full-stack developers?',
        timestamp: 'Yesterday, 3:00 PM',
      },
      {
        id: 'm-21',
        role: 'assistant',
        content: `Based on your **Financial Model Summary & Runway Audit** document:
- Current operating burn: **$84,000/month**
- Gross Cash Reserves: **$2.8M**
- Current Runway: **33.3 months**

Adding 2 Senior Engineers at ~$30k/mo combined all-in would adjust monthly burn to **$114,000/month**, maintaining a healthy **24.5-month runway**, well within venture safety margins.`,
        timestamp: 'Yesterday, 3:01 PM',
        contextUsed: 'Document: Financial Model Summary',
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'Marketing Email Campaign Drafts',
    lastMessage: 'Here are 3 compelling subject line variations for the developer newsletter.',
    updatedAt: '2 days ago',
    isPinned: false,
    isArchived: false,
    contextProjectId: 'proj-2',
    messages: [
      {
        id: 'm-30',
        role: 'user',
        content: 'Draft 3 subject lines for our upcoming workspace release announcement.',
        timestamp: 'Sep 09, 2:00 PM',
      },
      {
        id: 'm-31',
        role: 'assistant',
        content: `Here are 3 high-converting subject line options:

1. **Direct & Impactful**: *"Meet Nova AI: The intelligent workspace where your projects and documents think together."*
2. **Curiosity & Value**: *"Why high-velocity teams are ditching fragmented apps for Nova AI."*
3. **Urgency & Access**: *"Your new command center is here. Experience Nova AI today."*`,
        timestamp: 'Sep 09, 2:01 PM',
      },
    ],
  },
];

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'agent-writing',
    name: 'Writing Agent',
    description: 'Create professional reports, executive emails, proposals, PRDs, and customer-facing documents with refined tone.',
    icon: 'PenTool',
    capabilities: ['Executive Summaries', 'Product Requirements (PRDs)', 'Newsletter Copy', 'Grammar Polish'],
    instructions: 'You are an elite corporate copywriter and technical author. Deliver punchy, structured, clear, and persuasive prose.',
    category: 'Content & Strategy',
    examplePrompt: 'Write a compelling product announcement post for our unified intelligent workspace release.',
  },
  {
    id: 'agent-research',
    name: 'Research Agent',
    description: 'Deep synthesis of competitive landscape, industry benchmarks, academic literature, and technology trends.',
    icon: 'Compass',
    capabilities: ['Competitive Audits', 'Literature Reviews', 'Technology Tradeoff Analysis', 'Trend Forecasting'],
    instructions: 'You are a meticulous research analyst. Synthesize data with strict factual objectivity, citation frameworks, and structured comparisons.',
    category: 'Intelligence',
    examplePrompt: 'Compare serverless containers vs dedicated Kubernetes clusters for AI inference workloads.',
  },
  {
    id: 'agent-coding',
    name: 'Coding Agent',
    description: 'Explain, generate, review, debug, and optimize production code across TypeScript, React, Node.js, and SQL.',
    icon: 'Code2',
    capabilities: ['Full-Stack Implementation', 'Refactoring & Clean Code', 'Security Hardening', 'Unit & Integration Testing'],
    instructions: 'You are a principal software architect. Provide idiomatic, strictly typed, production-ready code with complete error handling and zero placeholders.',
    category: 'Engineering',
    examplePrompt: 'Build an Express middleware for rate-limiting AI inference requests with in-memory token buckets.',
  },
  {
    id: 'agent-data',
    name: 'Data Analyst',
    description: 'Analyze CSV and spreadsheet data, extract statistically sound trends, cohort metrics, and actionable growth insights.',
    icon: 'BarChart3',
    capabilities: ['Cohort Analysis', 'Anomaly Detection', 'Growth Metric Forecasting', 'Financial Modeling'],
    instructions: 'You are a senior data scientist. Extract key trends, mathematical distributions, correlations, and business takeaways from raw datasets.',
    category: 'Analytics',
    examplePrompt: 'Analyze this cohort retention data and identify which feature drives the highest 30-day stickiness.',
  },
  {
    id: 'agent-document',
    name: 'Document Analyst',
    description: 'Extract structured information, contract clauses, compliance liabilities, and key milestones from PDFs and DOCX files.',
    icon: 'FileSearch',
    capabilities: ['Contract Review', 'SLA Extraction', 'Table Parsing', 'Key Milestone Extraction'],
    instructions: 'You are a legal and corporate document specialist. Surface critical commitments, indemnity liabilities, obligations, and deadlines.',
    category: 'Compliance & Legal',
    examplePrompt: 'Extract all SLA commitments, penalty clauses, and renewal dates from our enterprise vendor agreement.',
  },
  {
    id: 'agent-project-manager',
    name: 'Project Manager',
    description: 'Generate Work Breakdown Structures (WBS), sprint backlogs, dependency graphs, and proactive risk mitigation matrices.',
    icon: 'Kanban',
    capabilities: ['Sprint Backlog Generation', 'Critical Path Mapping', 'Resource Allocation', 'Risk Mitigation'],
    instructions: 'You are an agile certified Technical Program Manager. Break down complex initiatives into actionable sprint tickets with clear acceptance criteria.',
    category: 'Operations',
    examplePrompt: 'Create a 4-sprint agile delivery plan for migrating our monolithic app to a micro-frontend architecture.',
  },
  {
    id: 'agent-meeting',
    name: 'Meeting Assistant',
    description: 'Summarize meeting transcripts, isolate concrete action items, identify key stakeholders, and generate follow-up emails.',
    icon: 'Headphones',
    capabilities: ['Transcript Summarization', 'Action Item Assignment', 'Decision Logging', 'Follow-up Drafts'],
    instructions: 'You are an executive chief of staff. Identify every consensus decision, explicit commitment, owner, and deadline from raw conversation notes.',
    category: 'Productivity',
    examplePrompt: 'Extract all action items, owners, and due dates from this 45-minute sprint retrospective transcript.',
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Sprint 14 Planning & Demo',
    description: 'Review interactive dashboard components and finalize AI file intelligence features.',
    date: '2026-09-15',
    time: '10:00 AM - 11:30 AM',
    participants: ['Alex Vance', 'Sarah Lin', 'Marcus Reed'],
    projectId: 'proj-1',
    type: 'event',
  },
  {
    id: 'ev-2',
    title: 'Homepage Hero Design Deadline',
    description: 'Design sign-off from brand director before frontend handoff.',
    date: '2026-09-15',
    time: '05:00 PM',
    participants: ['Alex Vance'],
    projectId: 'proj-1',
    type: 'deadline',
  },
  {
    id: 'ev-3',
    title: 'Executive Financial Review',
    description: 'Quarterly runway and operational expense walkthrough with finance committee.',
    date: '2026-09-18',
    time: '02:00 PM - 03:00 PM',
    participants: ['David Chen', 'Alex Vance'],
    projectId: 'proj-3',
    type: 'review',
  },
  {
    id: 'ev-4',
    title: 'Product Launch Keynote Presentation Sign-off',
    description: 'Slide deck review for upcoming investor and user showcase.',
    date: '2026-09-22',
    time: '04:00 PM',
    participants: ['Sarah Lin', 'Alex Vance'],
    projectId: 'proj-2',
    type: 'deadline',
  },
  {
    id: 'ev-5',
    title: 'AI Agent Architecture Sync',
    description: 'Evaluate Gemini 3.8 tool calling performance and latency metrics.',
    date: '2026-09-24',
    time: '11:00 AM - 12:00 PM',
    participants: ['Marcus Reed', 'Alex Vance'],
    projectId: 'proj-4',
    type: 'event',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Approaching Task Deadline',
    message: '"Complete homepage hero design" is due in 3 days. Current status: In Progress.',
    type: 'deadline',
    read: false,
    timestamp: '25m ago',
    linkRoute: '/tasks',
  },
  {
    id: 'notif-2',
    title: 'New Document Comment',
    message: 'Sarah Lin commented on "Project Proposal: Intelligent Workspace Architecture".',
    type: 'comment',
    read: false,
    timestamp: '1h ago',
    linkRoute: '/documents',
  },
  {
    id: 'notif-3',
    title: 'File Analysis Completed',
    message: 'Nova AI finished analyzing "User_Retention_Cohort_Data.csv". 3 insights discovered.',
    type: 'ai',
    read: false,
    timestamp: '3h ago',
    linkRoute: '/files',
  },
  {
    id: 'notif-4',
    title: 'Task Completed',
    message: 'Marcus Reed completed "Upload project architecture docs".',
    type: 'task',
    read: true,
    timestamp: 'Yesterday',
    linkRoute: '/tasks',
  },
  {
    id: 'notif-5',
    title: 'Workspace Milestone Achieved',
    message: 'Project "AI Model Research & Context Engine" has reached 100% completion.',
    type: 'project',
    read: true,
    timestamp: '2 days ago',
    linkRoute: '/projects',
  },
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'preference',
    text: 'Prefer concise Markdown responses with bullet points, checklists, and clean typography.',
    createdAt: '2026-08-12',
    active: true,
  },
  {
    id: 'mem-2',
    category: 'workspace',
    text: 'Primary tech stack is React 18, TypeScript, Tailwind CSS, and Express backend with Gemini API.',
    createdAt: '2026-08-15',
    active: true,
  },
  {
    id: 'mem-3',
    category: 'project',
    text: 'Q3 focus is shipping Nova AI public preview with zero latency bottlenecks and complete dark mode.',
    createdAt: '2026-09-01',
    active: true,
  },
  {
    id: 'mem-4',
    category: 'instruction',
    text: 'Always include actionable next steps or automated task creation suggestions when summarizing documents.',
    createdAt: '2026-09-05',
    active: true,
  },
];

export const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'Smart Report Ingestion',
    description: 'When a PDF or DOCX report is uploaded: read content, summarize key takeaways, extract tasks, and notify project owner.',
    trigger: 'File Upload (PDF / DOCX)',
    steps: ['Read document text', 'Generate executive summary', 'Extract 3-5 priority action items', 'Create tasks in TODO column', 'Send notification to owner'],
    active: true,
    lastRun: 'Today, 9:15 AM',
  },
  {
    id: 'wf-2',
    name: 'Proactive Deadline Watcher',
    description: 'When a project deadline approaches within 5 days: audit remaining incomplete tasks, compute velocity, and alert team.',
    trigger: 'Daily at 08:00 AM',
    steps: ['Scan active projects', 'Identify tasks with due date < 5 days', 'Prompt Nova AI to synthesize blocker risks', 'Send summary to project channel'],
    active: true,
    lastRun: 'Yesterday, 8:00 AM',
  },
  {
    id: 'wf-3',
    name: 'Meeting Transcript Synthesizer',
    description: 'When meeting notes are saved: auto-detect attendees, extract action items, and sync calendar reminders.',
    trigger: 'Document Tagged #Meeting',
    steps: ['Parse meeting attendees', 'Synthesize key decisions', 'Create calendar follow-up reviews'],
    active: false,
    lastRun: 'Sep 05, 2026',
  },
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Alex Vance',
    email: 'alex.vance@nova-workspace.io',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
  },
  {
    id: 'tm-2',
    name: 'Sarah Lin',
    email: 'sarah.lin@nova-workspace.io',
    role: 'Admin',
    status: 'Active',
    lastActive: '14m ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Product & Marketing',
  },
  {
    id: 'tm-3',
    name: 'David Chen',
    email: 'david.chen@nova-workspace.io',
    role: 'Member',
    status: 'Active',
    lastActive: '2h ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Finance & Ops',
  },
  {
    id: 'tm-4',
    name: 'Marcus Reed',
    email: 'marcus.reed@nova-workspace.io',
    role: 'Member',
    status: 'Active',
    lastActive: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'AI Architecture',
  },
  {
    id: 'tm-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@nova-workspace.io',
    role: 'Member',
    status: 'Active',
    lastActive: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    department: 'UX & Design',
  },
  {
    id: 'tm-6',
    name: 'Jordan Bell',
    email: 'jordan.bell@investors.io',
    role: 'Viewer',
    status: 'Invited',
    lastActive: 'Pending Invite',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'Advisory Board',
  },
];
