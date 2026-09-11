import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Document } from '../types';
import {
  FileText,
  Plus,
  Search,
  Star,
  Sparkles,
  Copy,
  Check,
  Download,
  Trash2,
  Bold,
  Italic,
  Heading,
  List,
  Code,
  Languages,
  Wand2,
  Share2,
  Eye,
  Edit3,
} from 'lucide-react';
import { requestDocumentAssist } from '../services/aiService';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    toggleFavoriteDocument,
    routeParam,
    setActiveDocumentContext,
    addToast,
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>(
    routeParam || documents[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // AI Assistant state
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [copied, setCopied] = useState(false);

  // Active doc
  const currentDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Local editor state
  const [title, setTitle] = useState(currentDoc?.title || '');
  const [content, setContent] = useState(currentDoc?.content || '');

  useEffect(() => {
    if (currentDoc) {
      setTitle(currentDoc.title);
      setContent(currentDoc.content);
      setActiveDocumentContext(currentDoc);
    }
  }, [currentDoc?.id]);

  const handleSave = () => {
    if (!currentDoc) return;
    updateDocument(currentDoc.id, {
      title,
      content,
      snippet: content.slice(0, 100) + '...',
    });
    addToast('success', 'Document saved.');
  };

  const handleCreateNew = () => {
    const newDoc = addDocument({
      title: 'Untitled Document',
      content: '# Untitled Document\n\nStart typing or use the Nova AI assistant to draft content...',
      snippet: 'Drafted with Nova AI Workspace',
      tags: ['Draft'],
      isFavorite: false,
      author: 'Alex Vance',
    });
    setSelectedDocId(newDoc.id);
  };

  const handleAiAction = async (
    action: 'improve' | 'rewrite' | 'summarize' | 'expand' | 'shorten' | 'fix_grammar' | 'translate' | 'ideas'
  ) => {
    if (!content.trim()) return;
    setIsAiProcessing(true);

    try {
      const enhanced = await requestDocumentAssist(
        content,
        action,
        action === 'translate' ? targetLang : undefined,
        aiCustomPrompt || undefined
      );
      setContent(enhanced);
      updateDocument(currentDoc.id, {
        content: enhanced,
        snippet: enhanced.slice(0, 100) + '...',
      });
      addToast('success', `Document updated via AI ${action}.`);
      setAiCustomPrompt('');
    } catch (err) {
      addToast('error', 'AI assistance encountered an issue.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    addToast('success', 'Markdown copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('success', 'Document downloaded as .md');
  };

  // Text formatting insertion helpers
  const insertFormatting = (syntaxBefore: string, syntaxAfter: string = syntaxBefore) => {
    const textarea = document.getElementById('document-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${syntaxBefore}${selectedText || 'text'}${syntaxAfter}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxBefore.length, end + syntaxBefore.length);
    }, 50);
  };

  const filteredDocs = documents.filter((d) => {
    const matchesTag = filterTag === 'All' || d.tags.includes(filterTag);
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white dark:bg-zinc-950">
      {/* 1. Documents Sidebar */}
      <div className="w-80 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0 hidden md:flex">
        {/* Header & New Doc */}
        <div className="p-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Documents</h2>
            </div>
            <button
              id="doc-create-new-btn"
              onClick={handleCreateNew}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredDocs.map((doc) => {
            const isSelected = doc.id === currentDoc?.id;
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`group p-3 rounded-xl cursor-pointer text-xs transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="truncate text-zinc-900 dark:text-white font-semibold">
                    {doc.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteDocument(doc.id);
                    }}
                    className={`p-0.5 ${doc.isFavorite ? 'text-amber-500' : 'text-zinc-300 hover:text-amber-400'}`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1 leading-snug">
                  {doc.snippet}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
                  <span>{doc.updatedAt}</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {doc.tags[0] || 'Doc'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Editor Canvas */}
      {currentDoc ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950">
          {/* Top Toolbar */}
          <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xs">
            {/* Formatting Tools */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('*', '*')}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('### ')}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Heading"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('- ')}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Bullet list"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => insertFormatting('```\n', '\n```')}
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Code block"
              >
                <Code className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800 mx-1" />

              <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Document Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Export .md"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-all"
              >
                Save
              </button>
            </div>
          </div>

          {/* AI Quick Assistant Bar */}
          <div className="px-6 py-2.5 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-300">Nova AI Tools:</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleAiAction('improve')}
                disabled={isAiProcessing}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                Improve Writing
              </button>
              <button
                onClick={() => handleAiAction('summarize')}
                disabled={isAiProcessing}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                Summarize
              </button>
              <button
                onClick={() => handleAiAction('fix_grammar')}
                disabled={isAiProcessing}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                Fix Grammar & Tone
              </button>
              <button
                onClick={() => handleAiAction('expand')}
                disabled={isAiProcessing}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                Expand
              </button>
              <button
                onClick={() => handleAiAction('shorten')}
                disabled={isAiProcessing}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                Condense
              </button>

              <div className="flex items-center gap-1 pl-1">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-hidden"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mandarin">Mandarin</option>
                </select>
                <button
                  onClick={() => handleAiAction('translate')}
                  disabled={isAiProcessing}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors"
                >
                  Translate
                </button>
              </div>
            </div>
          </div>

          {/* AI Loading State */}
          {isAiProcessing && (
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Nova AI is enhancing and rewriting your document...</span>
            </div>
          )}

          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-4">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title"
              className="w-full text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white bg-transparent border-none focus:outline-hidden placeholder-zinc-300 dark:placeholder-zinc-700"
            />

            <div className="flex items-center gap-3 text-xs text-zinc-400 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span>Author: {currentDoc.author}</span>
              <span>•</span>
              <span>Updated: {currentDoc.updatedAt}</span>
              <span>•</span>
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
            </div>

            {/* Editor vs Preview Mode */}
            {activeTab === 'edit' ? (
              <textarea
                id="document-editor-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing or pasting your Markdown content here..."
                className="w-full h-[calc(100%-6rem)] min-h-[500px] bg-transparent text-sm sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 resize-none focus:outline-hidden font-mono"
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {content}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs">
          Select or create a document to begin.
        </div>
      )}
    </div>
  );
};
