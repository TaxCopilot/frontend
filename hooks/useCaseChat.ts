'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService } from '@/services/chatService';
import { caseChatService } from '@/services/caseChatService';
import { draftService } from '@/services/draftService';

export type ChatMode = 'chat' | 'analysis' | 'draft';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
}

interface UseCaseChatOptions {
  caseId: string | null;
  documents: any[];
  onFetchCase: () => Promise<any>;
}

export function useCaseChat({ caseId, documents, onFetchCase }: UseCaseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('chat');

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

  useEffect(() => {
    loadChat();
  }, [loadChat]);

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

  const addUserMsg = (content: string) =>
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date() }]);

  const addAiMsg = (content: string, isAnalysis = false) =>
    setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content, timestamp: new Date(), isAnalysis }]);

  const addErrorMsg = (msg: string) =>
    setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: `⚠️ ${msg}`, timestamp: new Date() }]);

  const filterCitations = (cites: string[]) =>
    cites.filter((c) => c.trim().toLowerCase() !== 'unknown document');

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    addUserMsg(text);
    setSending(true);

    try {
      const docRefs = documents.map((d) => ({
        document_id: d.id,
        filename: d.filename,
        s3_bucket: d.s3Bucket,
        s3_key: d.s3Key,
      }));

      if (chatMode === 'chat') {
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
        if (documents.length === 0) {
          addErrorMsg('Upload a document first to run deep research.');
          return;
        }
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
        if (documents.length === 0) {
          addErrorMsg('Upload a document first to create a draft.');
          return;
        }
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
        await onFetchCase();
      }
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      addErrorMsg(typeof d === 'object' ? `${d?.stage || ''} ${d?.error || ''}`.trim() || 'Request failed' : 'Request failed');
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    historyLoading,
    sending,
    chatMode,
    setChatMode,
    sendMessage,
    loadChat
  };
}
