import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileText,
  Files,
  FolderKanban,
  Bot,
  Search,
  CheckSquare,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  Layers,
  Cpu,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, login } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleQuickDemo = () => {
    login('alex.vance@nova-workspace.io', 'Alex Vance');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* 1. Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/20">
              ✦
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              Nova AI
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <button
              id="landing-signin-btn"
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              id="landing-getstarted-btn"
              onClick={handleQuickDemo}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium transition-all shadow-sm shadow-indigo-500/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Next-Generation Intelligent Workspace • Powered by Gemini</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-tight">
          One intelligent workspace for <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">everything you do.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Nova AI brings your conversations, documents, projects, files and tasks together with powerful AI assistance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-start-free-btn"
            onClick={handleQuickDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-base transition-all shadow-md shadow-indigo-500/25"
          >
            <span>Start for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-explore-btn"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-base transition-all border border-zinc-200 dark:border-zinc-800"
          >
            Explore Nova AI
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Free 14-day trial</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Instant workspace setup</span>
        </div>
      </section>

      {/* 3. AI Workspace Interactive Preview */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto pb-24">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-2 sm:p-4 shadow-2xl shadow-indigo-500/10">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
            {/* Mock browser header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs text-zinc-500 font-mono">app.nova-ai.workspace/dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nova AI Active Context</span>
              </div>
            </div>

            {/* Dashboard Mock Grid Preview */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: AI Chat Snippet */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>Context-Aware Chat</span>
                </div>
                <div className="text-xs bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
                  <span className="text-zinc-400 font-medium">User:</span> "Summarize our website redesign and list urgent tasks."
                </div>
                <div className="text-xs bg-indigo-50/70 dark:bg-indigo-950/40 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800/60 text-zinc-800 dark:text-zinc-200">
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Nova AI:</span> Website redesign is 68% complete. 2 tasks require review before Friday.
                </div>
              </div>

              {/* Card 2: Smart Tasks */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <CheckSquare className="w-4 h-4" />
                    <span>Kanban Sprint</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">4 In Progress</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="font-medium">Complete homepage hero design</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold">Urgent</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="font-medium">Review Q3 financial runway</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold">High</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Specialized Agents */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/60 dark:bg-zinc-900/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  <Bot className="w-4 h-4" />
                  <span>Specialized Agents</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Data Analyst Agent</span>
                    <span className="text-emerald-500 font-normal">Active</span>
                  </div>
                  <p className="text-[11px] text-zinc-500">"Extracted 3 cohort trends from User_Retention.csv"</p>
                </div>
                <button
                  onClick={handleQuickDemo}
                  className="w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Launch Workspace Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Intelligent capabilities for modern teams
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              Everything you need to orchestrate projects, synthesize information, and accelerate delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Chat with Context',
                desc: 'Chat directly with Gemini 3 grounded in your active projects, documents, and past conversations.',
                icon: MessageSquare,
                color: 'text-indigo-500',
              },
              {
                title: 'Smart Documents',
                desc: 'Rich document editor equipped with inline AI writing improvements, executive summaries, and translations.',
                icon: FileText,
                color: 'text-blue-500',
              },
              {
                title: 'File Intelligence',
                desc: 'Upload PDFs, spreadsheets, and Word documents to instantly uncover trends, extract clauses, and ask questions.',
                icon: Files,
                color: 'text-emerald-500',
              },
              {
                title: 'Project Management',
                desc: 'Organize high-impact initiatives with milestone tracking, member allocations, and AI project assistants.',
                icon: FolderKanban,
                color: 'text-amber-500',
              },
              {
                title: 'Specialized AI Agents',
                desc: 'Deploy dedicated agents for Writing, Research, Coding, Data Analysis, and Project Management.',
                icon: Bot,
                color: 'text-sky-500',
              },
              {
                title: 'Global Semantic Search',
                desc: 'Natural language search across your entire workspace knowledge graph using Ctrl+K.',
                icon: Search,
                color: 'text-purple-500',
              },
              {
                title: 'Task Management',
                desc: 'Kanban boards and lists with drag-and-drop prioritization, sub-tasks, and deadline watches.',
                icon: CheckSquare,
                color: 'text-teal-500',
              },
              {
                title: 'Team Collaboration',
                desc: 'Role-based access control (Owner, Admin, Member, Viewer) with real-time auditability and security.',
                icon: Users,
                color: 'text-rose-500',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
                >
                  <div className={`w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center ${feat.color} mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            How Nova AI transforms your workflow
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            From setup to automated intelligence in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: 'Step 1',
              title: 'Create your workspace',
              desc: 'Set up your organization, invite your team, and define your core operational goals.',
              icon: Zap,
            },
            {
              step: 'Step 2',
              title: 'Connect your knowledge',
              desc: 'Upload spreadsheets, brand guidelines, and documents into unified project folders.',
              icon: Layers,
            },
            {
              step: 'Step 3',
              title: 'Ask Nova AI',
              desc: 'Interact naturally or deploy specialized agents to analyze data, draft PRDs, and audit deadlines.',
              icon: Sparkles,
            },
            {
              step: 'Step 4',
              title: 'Get work done',
              desc: 'Convert AI responses directly into executable tasks, smart documents, and team deliverables.',
              icon: Cpu,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative text-left">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center my-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-20 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Transparent, predictable pricing
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
              Choose the plan designed for your team's velocity and AI compute requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Free</h3>
                <p className="text-xs text-zinc-500 mt-1">For individual creators and hobbyists</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">$0</span>
                  <span className="text-xs text-zinc-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 3 active projects</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 100 AI queries per month</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Basic document editor</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 1GB file storage</li>
                </ul>
              </div>
              <button
                onClick={handleQuickDemo}
                className="mt-8 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="p-7 rounded-2xl border-2 border-indigo-600 bg-white dark:bg-zinc-950 flex flex-col justify-between relative shadow-xl shadow-indigo-500/10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Pro</h3>
                <p className="text-xs text-zinc-500 mt-1">For fast-moving startups and high-impact teams</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">$24</span>
                  <span className="text-xs text-zinc-400 ml-1">/ seat / month</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited projects & tasks</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited Gemini 3.8 AI chat</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> All 7 Specialized AI Agents</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> PDF, CSV & XLSX file intelligence</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 50GB file storage</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Priority AI response speed</li>
                </ul>
              </div>
              <button
                onClick={handleQuickDemo}
                className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
              >
                Start Free 14-Day Trial
              </button>
            </div>

            {/* Business */}
            <div className="p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Business</h3>
                <p className="text-xs text-zinc-500 mt-1">For scaling organizations with security requirements</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">$49</span>
                  <span className="text-xs text-zinc-400 ml-1">/ seat / month</span>
                </div>
                <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Everything in Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated Gemini fine-tuning</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Custom workflow automation</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> SSO & SAML enforcement</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 99.95% uptime SLA</li>
                </ul>
              </div>
              <button
                onClick={handleQuickDemo}
                className="mt-8 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm">
            Everything you need to know about Nova AI and how it functions.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does Nova AI understand the context of my projects?',
              a: 'Nova AI references your active project, focused documents, pending tasks, and workspace memories. When you ask a question like "Summarize this project", Nova queries the relevant entities and injects them safely into the system prompt.',
            },
            {
              q: 'Is my proprietary data used to train public AI models?',
              a: 'No. Workspace content is strictly isolated per tenant. All AI interactions with Gemini 3 use enterprise API contracts where your data is never retained or used to train foundation models.',
            },
            {
              q: 'Can I analyze large spreadsheets and PDF files?',
              a: 'Yes. Nova AI supports native file intelligence for PDF, XLSX, CSV, DOCX, and TXT files. You can summarize key takeaways, ask granular questions, or extract trends directly into documents.',
            },
            {
              q: 'Does Nova AI support offline or fallback mode?',
              a: 'Yes. Nova AI incorporates a resilient dual-tier engine. When live Gemini API connectivity is available, it streams state-of-the-art responses. If offline or in local preview, it utilizes a synthetic fallback pipeline.',
            },
            {
              q: 'How does the global Command Center (Ctrl+K) work?',
              a: 'Pressing Ctrl+K or Cmd+K opens the command palette from any screen. You can jump to pages, search projects, create tasks on the fly, or execute direct natural language AI queries.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 flex items-center justify-between text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              ✦
            </div>
            <span className="font-bold text-base text-zinc-900 dark:text-white">Nova AI</span>
            <span className="text-xs text-zinc-400 ml-2">© 2026 Nova AI Systems, Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <button onClick={() => navigate('/dashboard')} className="hover:underline">Dashboard</button>
            <button onClick={() => navigate('/chat')} className="hover:underline">AI Chat</button>
            <button onClick={() => navigate('/projects')} className="hover:underline">Projects</button>
            <button onClick={() => navigate('/documents')} className="hover:underline">Documents</button>
            <button onClick={() => navigate('/tasks')} className="hover:underline">Tasks</button>
            <button onClick={() => navigate('/settings')} className="hover:underline">Settings</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
