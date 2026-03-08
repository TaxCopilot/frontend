"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import {
  Bot, Send, FileText, Loader2, Upload, ChevronRight, FileStack,
  MessageSquare, MessageCircle, Search, Sparkles,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCase } from '@/hooks/useCase';
import { documentService } from '@/services/documentService';
import { draftService } from '@/services/draftService';
import { chatService } from '@/services/chatService';
import { caseChatService } from '@/services/caseChatService';
import type { NoticeResponse } from '@/services/chatService';
import { PageSkeleton } from '@/components/SkeletonLoader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ChatMode = 'chat' | 'analysis' | 'draft';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
}

const MODES: { id: ChatMode; label: string; icon: React.ElementType; placeholder: string }[] = [
  {
    id: 'chat',
    label: 'Normal Chat',
    icon: MessageCircle,
    placeholder: 'Ask anything about this case...',
  },
  {
    id: 'analysis',
    label: 'Deep Research',
    icon: Search,
    placeholder: 'Describe what to analyze or extract from the document...',
  },
  {
    id: 'draft',
    label: 'Create Draft',
    icon: Sparkles,
    placeholder: 'Describe the draft or response you want to generate...',
  },
];

const renderMessageContent = (content: string, router: ReturnType<typeof useRouter>, drafts: any[]) => {
  if (content.startsWith('[DRAFT_JSON]')) {
    try {
      const data = JSON.parse(content.replace('[DRAFT_JSON]', ''));
      const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([data.snippet], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${data.title || 'Draft'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      };

      return (
        <div className="flex flex-col gap-3 w-full mt-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
             <Sparkles className="w-4 h-4" />
             {data.title || 'Draft'}
          </div>
          <div className="bg-background-light border border-border-default rounded-xl p-3 text-sm text-text-sub">
            {data.snippet || 'Draft content preview...'}
          </div>
          <div className="flex items-center gap-2 mt-1">
             <button onClick={() => router.push(`/workspace/editor?id=${data.id}`)} className="flex-1 py-1.5 px-3 bg-white border border-border-default rounded-lg text-xs font-semibold hover:border-primary/50 hover:text-primary transition-colors text-center">
               Show
             </button>
             <button onClick={handleDownload} className="flex-1 py-1.5 px-3 bg-white border border-border-default rounded-lg text-xs font-semibold hover:border-primary/50 hover:text-primary transition-colors text-center">
               Download
             </button>
          </div>
        </div>
      );
    } catch(e) {}
  }

  // legacy format check: "Draft created: **Draft Title**. Click it in the side panel to edit."
  if (content.startsWith('Draft created: **') && content.includes('**.')) {
    const titleMatch = content.match(/\*\*(.*?)\*\*/);
    const title = titleMatch ? titleMatch[1] : 'Draft';
    
    // Attempt to match an existing draft from context to restore the full UI presentation
    const matchedDraft = drafts.find((d) => d.title === title);
    const draftId = matchedDraft?.id;
    const rawText = String(matchedDraft?.content || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
    const snippet = rawText ? (rawText.substring(0, 100).trim() + '...') : 'Draft content preview...';

    const handleDownloadFallback = () => {
      const element = document.createElement('a');
      const file = new Blob([snippet], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${title}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    return (
      <div className="flex flex-col gap-3 w-full mt-1">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
           <Sparkles className="w-4 h-4" />
           {title}
        </div>
        <div className="bg-background-light border border-border-default rounded-xl p-3 text-sm text-text-sub">
          {snippet}
        </div>
        <div className="flex items-center gap-2 mt-1">
           <button 
             disabled={!draftId}
             onClick={() => draftId && router.push(`/workspace/editor?id=${draftId}`)} 
             className="flex-1 py-2.5 px-3 bg-white border border-border-default rounded-lg text-xs font-semibold hover:border-primary/50 hover:text-primary transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Show
           </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="prose prose-sm prose-p:leading-relaxed prose-a:text-primary max-w-none break-words">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default function CaseChatPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.caseId as string | null;
  const user = useAuthStore((s) => s.user);
  const { caseData, isLoading, fetchCase } = useCase(caseId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [chatMode, setChatMode] = useState<ChatMode>('chat');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const documents = caseData?.documents ?? [];
  const drafts = caseData?.drafts ?? [];
  const firstDoc = documents[0];

  const loadChat = useCallback(async () => {
    if (!caseId) return;
    setHistoryLoading(true);
    try {
      const msgs = await caseChatService.getSession(caseId);
      setMessages(
        msgs.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(m.createdAt),
          isAnalysis: m.isAnalysis,
        }))
      );
    } catch {
      setMessages([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [caseId]);

  const saveMessage = useCallback(
    async (role: string, content: string, isAnalysis = false) => {
      if (!caseId) return;
      try {
        await caseChatService.addMessage(caseId, role, content, isAnalysis);
      } catch (e) {
        console.error('Failed to save message', e);
      }
    },
    [caseId]
  );

  useEffect(() => { fetchCase(); }, [caseId, fetchCase]);
  useEffect(() => { loadChat(); }, [loadChat]);
  useEffect(() => {
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, sending]);

  // Auto-close case menu on outside click
  const caseMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (!caseMenuRef.current?.contains(e.target as Node)) setCaseMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 192) + 'px';
  }, [inputValue]);

  const addUserMsg = (content: string) =>
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date() }]);

  const addAiMsg = (content: string, isAnalysis = false) =>
    setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content, timestamp: new Date(), isAnalysis }]);

  const addErrorMsg = (msg: string) =>
    setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: `⚠️ ${msg}`, timestamp: new Date() }]);

  const filterCitations = (cites: string[]) =>
    cites.filter((c) => c.trim().toLowerCase() !== 'unknown document');

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || sending) return;

    setInputValue('');
    addUserMsg(text);
    setSending(true);

    try {
      if (chatMode === 'chat') {
        // ── Normal Chat ──
        const docRefs = documents.map((d) => ({
          document_id: d.id,
          filename: d.filename,
          s3_bucket: d.s3Bucket,
          s3_key: d.s3Key,
        }));
        const result = await chatService.sendChatMessage({
          message: text,
          session_id: caseId || 'unknown-session',
          documents: docRefs,
        });
        const ans = result.answer ?? '';
        const cites = filterCitations(result.citations ?? []);
        const content = cites.length
          ? `${ans}\n\n**References:**\n${cites.map((c) => `• ${c}`).join('\n')}`
          : ans;
        addAiMsg(content || 'I could not generate a response.');
        await saveMessage('user', text);
        await saveMessage('assistant', content);

      } else if (chatMode === 'analysis') {
        // ── Deep Research (Analysis) ──
        if (documents.length === 0) {
          addErrorMsg('Upload a document first to run deep research.');
          return;
        }
        const docRefs = documents.map((d) => ({
          document_id: d.id,
          filename: d.filename,
          s3_bucket: d.s3Bucket,
          s3_key: d.s3Key,
        }));
        await saveMessage('user', text);
        const result = await chatService.analyzeNotice({
          session_id: caseId || 'unknown-session',
          documents: docRefs,
          message: text,
        });
        const content = result.report?.trim() || 'Analysis failed to generate a report.';
        addAiMsg(content, true);
        await saveMessage('assistant', content, true);

      } else if (chatMode === 'draft') {
        // ── Create Draft ──
        if (documents.length === 0) {
          addErrorMsg('Upload a document first to create a draft.');
          return;
        }
        const docRefs = documents.map((d) => ({
          document_id: d.id,
          filename: d.filename,
          s3_bucket: d.s3Bucket,
          s3_key: d.s3Key,
        }));
        await saveMessage('user', text);
        const result = await chatService.generateDraft({
          session_id: caseId || 'unknown-session',
          documents: docRefs,
          message: text,
        });
        const draftTitle =
          documents.length > 1
            ? 'Draft – Multiple Documents'
            : `Draft – ${documents[0].filename}`;
        const draft = await draftService.createDraft({
          title: draftTitle,
          content: result.html_content || '',
          caseId: caseId ?? undefined,
        });
        const rawText = String(result.html_content || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
        const snippet = rawText.substring(0, 100).trim() + '...';
        const aiContent = `[DRAFT_JSON]${JSON.stringify({ id: draft.id, title: draft.title, snippet })}`;
        addAiMsg(aiContent);
        await saveMessage('assistant', aiContent);
        await fetchCase();
      }
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      addErrorMsg(typeof d === 'object' ? `${d?.stage || ''} ${d?.error || ''}`.trim() || 'Request failed' : 'Request failed');
    } finally {
      setSending(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !caseId) return;
    setUploading(true);
    try {
      await documentService.uploadForAnalysis(file, caseId);
      await fetchCase();
    } catch {
      addErrorMsg('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isLoading || !caseData) {
    return (
      <>
        <Header title="Case" subtitle="Loading..." />
        <PageSkeleton />
      </>
    );
  }

  const activeMode = MODES.find((m) => m.id === chatMode)!;

  return (
    <>
      <Header title={caseData.title} subtitle={caseData.clientName || 'Chat & analysis'} />
      <div className="flex-1 flex overflow-hidden">

        {/* ── Side Panel ── */}
        <aside className="w-[280px] border-r border-border-default bg-sidebar-bg flex flex-col flex-shrink-0">
          {/* Case selector */}
          <div className="p-4 border-b border-border-default" ref={caseMenuRef}>
            <button
              onClick={() => setCaseMenuOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 rounded-xl p-3 bg-background-light hover:bg-active-bg border border-border-default transition-colors group"
            >
              <div className="text-left min-w-0">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-0.5">Open Case</p>
                <p className="text-sm font-semibold text-text-heading truncate group-hover:text-primary transition-colors">
                  {caseData.title}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-light flex-shrink-0 transition-transform duration-200 ${caseMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            {caseMenuOpen && (
              <div className="mt-3 p-4 rounded-xl bg-background-light border border-border-default space-y-2">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Case Details</p>
                {caseData.description && <p className="text-sm text-text-sub leading-relaxed">{caseData.description}</p>}
                {caseData.clientName && (
                  <p className="text-sm text-text-sub">
                    <span className="font-medium text-text-heading">Client:</span> {caseData.clientName}
                  </p>
                )}
                {caseData.referenceNo && (
                  <p className="text-sm text-text-sub">
                    <span className="font-medium text-text-heading">Ref:</span> {caseData.referenceNo}
                  </p>
                )}
                {!caseData.description && !caseData.clientName && !caseData.referenceNo && (
                  <p className="text-xs text-text-light italic">No details added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Documents & Drafts */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {/* Documents */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Documents</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Upload document"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} />
              <div className="space-y-1.5">
                {documents.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-xl border-2 border-dashed border-border-default hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all text-center"
                  >
                    <Upload className="w-5 h-5 text-text-light" />
                    <p className="text-xs text-text-light">Upload a document</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-background-light border border-border-subtle">
                      <FileStack className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-text-heading truncate">{doc.filename}</span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Drafts */}
            <section>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-3">Drafts</p>
              <div className="space-y-1">
                {drafts.length === 0 ? (
                  <p className="text-xs text-text-light py-3 px-3 rounded-lg bg-background-light border border-dashed border-border-subtle">
                    No drafts yet.
                  </p>
                ) : (
                  drafts.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => router.push(`/workspace/editor?id=${d.id}`)}
                      className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm truncate hover:bg-active-bg hover:text-primary text-text-sub border border-transparent hover:border-border-default transition-all"
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      {d.title}
                    </button>
                  ))
                )}
              </div>
            </section>
          </div>
        </aside>

        {/* ── Main Chat ── */}
        <main className="flex-1 flex flex-col bg-background-light min-w-0 relative">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 scrollbar-thin min-h-0 pb-40">
            {historyLoading ? (
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-text-sub">Loading chat...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 max-w-md mx-auto text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading mb-2">Start a conversation</h3>
                <p className="text-text-sub text-sm leading-relaxed mb-8">
                  Select a mode below, type your prompt, and press Send.
                </p>
                {/* Mode hints */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setChatMode(m.id); textareaRef.current?.focus(); }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all text-xs font-medium
                        ${chatMode === m.id
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'border-border-default text-text-sub hover:border-primary/20 hover:bg-primary/5'
                        }`}
                    >
                      <m.icon className="w-5 h-5" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm border ${
                    msg.role === 'user' ? 'bg-primary text-white border-primary' : 'bg-white border-border-default'
                  }`}>
                    {msg.role === 'user'
                      ? <span className="text-xs font-bold">{user?.name?.[0] || 'U'}</span>
                      : <Bot className="w-4 h-4 text-primary" />
                    }
                  </div>
                  <div className={`flex flex-col gap-1 min-w-0 flex-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <span className="text-[11px] text-text-light px-1">{formatTime(msg.timestamp)}</span>
                    <div className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-sm'
                        : 'bg-white border border-border-default rounded-tl-sm'
                    }`}>
                      {renderMessageContent(msg.content, router, drafts)}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {sending && (
              <div className="flex gap-4 max-w-3xl">
                <div className="w-9 h-9 rounded-xl bg-white border border-border-default flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-text-sub text-sm py-3 px-4 rounded-2xl bg-white border border-border-default shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {chatMode === 'analysis' ? 'Running deep research...' : chatMode === 'draft' ? 'Generating draft...' : 'Thinking...'}
                </div>
              </div>
            )}
            {/* Empty space so the last message isn't hidden behind the floating input */}
            <div className="h-32 flex-shrink-0" ref={chatEndRef} />
          </div>

          {/* ── Floating Input Area ── */}
          <div className="absolute bottom-6 left-0 right-0 px-4 lg:px-6 pointer-events-none flex justify-center">
            <div className="w-full max-w-3xl pointer-events-auto shadow-xl rounded-2xl bg-white border border-border-default transition-all duration-150 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={activeMode.placeholder}
                  rows={1}
                  className="w-full min-h-[52px] max-h-48 resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed focus:outline-none placeholder-text-light text-text-main"
                  disabled={sending}
                  aria-label="Message"
                />

                {/* Bottom bar: mode chips + send */}
                <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-3">
                  {/* Mode chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {MODES.map((m) => {
                      const active = chatMode === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setChatMode(m.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${
                            active
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'text-text-sub border-border-default hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          <m.icon className="w-3.5 h-3.5" />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || sending}
                    className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    aria-label="Send"
                  >
                    {sending
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Send className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>

        </main>
      </div>
    </>
  );
}
