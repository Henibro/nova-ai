# Nova AI — Intelligent Workspace

> **Built by [Henok Alem](https://henokpersonal-portfolio-5894.ai.studio/)**  
> GitHub: [@Henibro](https://github.com/Henibro) | Portfolio: [henokpersonal-portfolio-5894.ai.studio](https://henokpersonal-portfolio-5894.ai.studio/)

Nova AI is an all-in-one next-generation intelligent workspace that combines conversational AI, smart document authoring, project and task decomposition, file intelligence, and specialized domain AI agents into a single high-performance platform.

---

## 🌟 Key Features

### 1. 🤖 Context-Aware AI Chat Studio
- Multi-turn conversations powered by Google Gemini models (`gemini-2.5-pro` and `gemini-2.5-flash`).
- Context injection: attach projects, documents, or knowledge base files directly into the prompt.
- Server-side secure API proxy keeping API keys protected.

### 2. 📝 Smart Document Canvas
- Live document editor with built-in AI writing copilot.
- 1-click AI capabilities: Summarize, Fix Grammar & Tone, Expand Content, Translate, and Generate Structured Ideas.
- Rich formatting with markdown support and document statistics.

### 3. 📊 Project & Kanban Task Manager
- Visual Kanban boards with drag-friendly state columns (`To Do`, `In Progress`, `Review`, `Done`).
- **AI Task Decomposition**: Transform broad project goals into structured, prioritized action items automatically.
- Project health indicators, milestone deadlines, and progress analytics.

### 4. 📁 File Vault & Document Intelligence
- Drag-and-drop file upload with format-aware analysis (PDF, DOCX, TXT, CSV, JSON).
- Instant AI document analysis, executive summaries, and contextual Q&A directly on uploaded files.

### 5. 🧠 Specialized AI Agent Studio
- 7 tailored autonomous domain agents:
  - **Lexicon (Content & Copywriting)**: Long-form articles, ad copy, and messaging.
  - **Atlas (Deep Research)**: Synthesizes technical papers and market analysis.
  - **Cipher (Full-Stack Engineer)**: Code refactoring, architecture design, and bug fixing.
  - **Prism (Data & Analytics)**: Metric breakdown, SQL generation, and trend forecasting.
  - **Aura (Product Strategist)**: PRD writing, feature roadmapping, and user story mapping.
  - **Justiciar (Legal & Compliance)**: Contract clause risk detection and policy audits.
  - **Echo (Growth & Marketing)**: GTM strategies, campaign funnels, and viral hooks.

### 6. 🔍 Semantic Global Search
- Universal search across projects, documents, tasks, and files with synthesized AI summaries.
- Fast command palette accessible anywhere via `Cmd + K` or `Ctrl + K`.

### 7. 🎨 Premium Modern UI & UX
- Elegant typography pairing with Plus Jakarta Sans and JetBrains Mono.
- Fully responsive design with seamless Dark and Light theme switching.
- Smooth layout transitions powered by Motion.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Motion, Lucide React
- **Backend**: Node.js, Express.js (proxying secure Gemini API calls)
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Build System**: Vite & esbuild

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Henibro/nova-ai.git
   cd nova-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 👤 Author

**Henok Alem**
- Portfolio: [https://henokpersonal-portfolio-5894.ai.studio/](https://henokpersonal-portfolio-5894.ai.studio/)
- GitHub: [@Henibro](https://github.com/Henibro)
