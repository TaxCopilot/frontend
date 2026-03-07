"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import {
  Bot, Send, FileText, Loader2, Play, Upload, ChevronDown, Menu, Sparkles,
  MessageSquare, ChevronRight, FileStack, MessageCircle, MoreHorizontal,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useCase } from '@/hooks/useCase';
import { documentService } from '@/services/documentService';
import { draftService } from '@/services/draftService';
import { chatService } from '@/services/chatService';
import { caseChatService } from '@/services/caseChatService';
import type { CaseDocument } from '@/services/caseService';
import type { NoticeResponse } from '@/services/chatService';
import { PageSkeleton } from '@/components/SkeletonLoader';
  
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
}

export default function CaseChatPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.caseId as string | null;
  const user = useAuthStore((s) => s.user);
  const { caseData, isLoading, fetchCase } = useCase(caseId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetchCase();
  }, [caseId, fetchCase]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const actionMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (actionMenuRef.current?.contains(target)) return;
      setActionMenuOpen(false);
      setCaseMenuOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const addUserMsg = (content: string) => {
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date() }]);
  };

  const addAiMsg = (content: string, isAnalysis = false) => {
    setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content, timestamp: new Date(), isAnalysis }]);
  };

  const addErrorMsg = (msg: string) => {
    setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: `⚠️ ${msg}`, timestamp: new Date() }]);
  };

  const filterCitations = (cites: string[]) =>
    cites.filter((c) => c.trim().toLowerCase() !== 'unknown document');

  const formatAnalysis = (r: NoticeResponse): string => {
    let s = '';
    if (r.draft_reply) s += `**Draft Reply:**\n${r.draft_reply}\n\n`;
    const filtered = filterCitations(r.citations ?? []);
    if (filtered.length) s += `**Legal References:**\n${filtered.map((c) => `• ${c}`).join('\n')}`;
    if (!s.trim()) s = JSON.stringify(r, null, 2);
    return s;
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    addUserMsg(text);
    setChatLoading(true);
    try {
      const result = await chatService.sendChatMessage({
        message: text,
        document_id: firstDoc?.id,
        s3_bucket: firstDoc?.s3Bucket ?? undefined,
        s3_key: firstDoc?.s3Key ?? undefined,
      });
      const ans = result.answer ?? '';
      const cites = filterCitations(result.citations ?? []);
      const content = cites.length ? `${ans}\n\n**References:**\n${cites.map((c) => `• ${c}`).join('\n')}` : ans;
      addAiMsg(content || 'I could not generate a response.');
      await saveMessage('user', text);
      await saveMessage('assistant', content);
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      addErrorMsg(typeof d === 'object' ? `${d?.stage || ''} ${d?.error || ''}`.trim() || 'Chat failed' : 'Chat failed');
    } finally {
      setChatLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!firstDoc) {
      addErrorMsg('Upload a document first to run analysis.');
      return;
    }
    setAnalyzing(true);
    const userContent = `Please analyze the document "${firstDoc.filename}".`;
    addUserMsg(userContent);
    await saveMessage('user', userContent);
    try {
      const result = await chatService.decodeDocument({
        document_id: firstDoc.id,
        notice_type: 'auto-detect',
        s3_bucket: firstDoc.s3Bucket ?? undefined,
        s3_key: firstDoc.s3Key ?? undefined,
      });
      const content = formatAnalysis(result);
      addAiMsg(content, true);
      await saveMessage('assistant', content, true);
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      addErrorMsg(typeof d === 'object' ? `${d?.stage || ''} ${d?.error || ''}`.trim() || 'Analysis failed' : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const createDraft = async () => {
    if (!firstDoc) {
      addErrorMsg('Upload a document first to create a draft.');
      return;
    }
    setCreatingDraft(true);
    const userContent = 'Please prepare a formal draft reply based on the notice.';
    addUserMsg(userContent);
    await saveMessage('user', userContent);
    try {
      const result = await chatService.generateDraft({
        document_id: firstDoc.id,
        s3_bucket: firstDoc.s3Bucket ?? undefined,
        s3_key: firstDoc.s3Key ?? undefined,
      });
      const draft = await draftService.createDraft({
        title: `Draft – ${firstDoc.filename}`,
        content: result.html_content || '',
        caseId: caseId ?? undefined,
      });
      const aiContent = `Draft created: **${draft.title}**. Click it in the side panel to edit.`;
      addAiMsg(aiContent);
      await saveMessage('assistant', aiContent);
      await fetchCase();
      setActionMenuOpen(false);
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      addErrorMsg(typeof d === 'object' ? `${d?.stage || ''} ${d?.error || ''}`.trim() || 'Draft creation failed' : 'Draft creation failed');
    } finally {
      setCreatingDraft(false);
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

  const formatTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isLoading || !caseData) {
    return (
      <>
        <Header title="Case" subtitle="Loading..." />
        <PageSkeleton />
      </>
    );
  }

  return (
    <>
      <Header title={caseData.title} subtitle={caseData.clientName || 'Chat & analysis'} />
      <div className="flex-1 flex overflow-hidden">
        {/* Side panel */}
        <aside className="w-[300px] border-r border-border-subtle bg-surface-light flex flex-col flex-shrink-0 shadow-sm">
          <div className="p-4 border-b border-border-subtle bg-white/80">
            <button
              onClick={(e) => { e.stopPropagation(); setCaseMenuOpen((o) => !o); }}
              className="w-full flex items-center justify-between gap-2 rounded-xl p-3.5 bg-background-light/80 hover:bg-primary/5 border border-border-subtle transition-colors group"
            >
              <div className="text-left min-w-0">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-0.5">Open Case</p>
                <p className="text-sm font-semibold text-text-heading truncate group-hover:text-primary transition-colors">{caseData.title}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-text-light flex-shrink-0 transition-transform duration-200 ${caseMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            {caseMenuOpen && (
              <div className="mt-3 p-4 rounded-xl bg-background-light/80 border border-border-subtle space-y-3">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Case Details</p>
                {caseData.description && <p className="text-sm text-text-sub leading-relaxed">{caseData.description}</p>}
                {caseData.clientName && <p className="text-sm text-text-sub"><span className="font-medium text-text-heading">Client:</span> {caseData.clientName}</p>}
                {caseData.referenceNo && <p className="text-sm text-text-sub"><span className="font-medium text-text-heading">Ref:</span> {caseData.referenceNo}</p>}
                {!caseData.description && !caseData.clientName && !caseData.referenceNo && (
                  <p className="text-xs text-text-light italic">No details added yet</p>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Uploaded Documents</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Upload document"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleUpload} />
              <div className="space-y-2">
                {documents.length === 0 ? (
                  <p className="text-xs text-text-light py-3 px-3 rounded-lg bg-background-light/50 border border-dashed border-border-subtle">No documents. Upload to add.</p>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-background-light/80 border border-border-subtle cursor-default">
                      <FileText className="w-4 h-4 text-text-light flex-shrink-0" />
                      <span className="text-sm text-text-heading truncate select-none">{doc.filename}</span>
                    </div>
                  ))
                )}
              </div>
            </section>
            <section>
              <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-3">Drafts</p>
              <div className="space-y-1.5">
                {drafts.length === 0 ? (
                  <p className="text-xs text-text-light py-3 px-3 rounded-lg bg-background-light/50 border border-dashed border-border-subtle">No drafts yet.</p>
                ) : (
                  drafts.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => router.push(`/workspace/editor?id=${d.id}`)}
                      className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-sm truncate hover:bg-primary/10 hover:border-primary/20 text-text-sub hover:text-primary border border-transparent hover:border transition-all"
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

        {/* Main chat - Cloud/Claude style */}
        <main className="flex-1 flex flex-col bg-white min-w-0">
          {firstDoc && (
            <div className="px-6 py-3 border-b border-border-subtle/60 bg-white/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <FileStack className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-text-sub truncate">{firstDoc.filename}</span>
              </div>
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 flex-shrink-0"
              >
                <Play className="w-4 h-4" />
                Analysis
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 scrollbar-thin min-h-0">
            {historyLoading ? (
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-text-sub">Loading chat...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-inner">
                  <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading mb-2">Start a conversation</h3>
                <p className="text-text-sub text-sm text-center leading-relaxed">
                  Ask tax questions, run analysis, or create drafts. Chat is saved automatically.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-border-subtle shadow-sm'}`}>
                    {msg.role === 'user' ? <span className="text-xs font-bold">{user?.name?.[0] || 'U'}</span> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`flex flex-col gap-1 min-w-0 flex-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <span className="text-[11px] text-text-light px-1">{formatTime(msg.timestamp)}</span>
                    <div className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-border-subtle rounded-tl-sm'}`}>
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {(chatLoading || analyzing) && (
              <div className="flex gap-4 max-w-3xl">
                <div className="w-9 h-9 rounded-lg bg-white border border-border-subtle flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-text-sub text-sm py-3 px-4 rounded-2xl bg-white border border-border-subtle shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {analyzing ? 'Analyzing document...' : 'Thinking...'}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input: menu popup + increased height */}
          <div className="px-4 lg:px-6 py-3 border-t border-border-subtle bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-end gap-0 rounded-2xl border border-border-default bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                <div ref={actionMenuRef} className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setActionMenuOpen((o) => !o); }}
                    className="p-3 text-text-light hover:text-primary hover:bg-primary/5 transition-colors"
                    aria-label="Options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {actionMenuOpen && (
                    <div className="absolute left-0 bottom-full mb-1 w-56 bg-white border border-border-default rounded-xl shadow-xl py-1.5 z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
                        <span className="text-xs font-semibold text-text-light">Actions</span>
                        <button
                          onClick={() => setActionMenuOpen(false)}
                          className="p-1 rounded hover:bg-background-light text-text-light"
                          aria-label="Close"
                        >
                          <span className="text-lg leading-none">×</span>
                        </button>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActionMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-text-sub hover:bg-primary/5 flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Default mode (chat)
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); runAnalysis(); setActionMenuOpen(false); }}
                        disabled={!firstDoc || analyzing}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        Analysis (decode)
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); createDraft(); setActionMenuOpen(false); }}
                        disabled={!firstDoc || creatingDraft}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 flex items-center gap-2 disabled:opacity-50"
                      >
                        {creatingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Create draft
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); drafts[0] && router.push(`/workspace/editor?id=${drafts[0].id}`); setActionMenuOpen(false); }}
                        disabled={drafts.length === 0}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 flex items-center gap-2 disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        Modify draft
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message..."
                  rows={1}
                  className="flex-1 min-h-[64px] max-h-48 resize-none bg-transparent px-4 py-4 text-[15px] leading-relaxed focus:outline-none"
                  disabled={chatLoading || analyzing}
                  style={{ outline: 'none' }}
                  aria-label="Message"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || chatLoading || analyzing}
                  className="p-3 text-primary hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex-shrink-0"
                  aria-label="Send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
