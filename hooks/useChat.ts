'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  chatService,
  NoticeResponse,
  ChatMessage as ApiChatMessage,
} from '@/services/chatService';
import { AnalysisFile } from '@/services/documentService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
  analysisResult?: NoticeResponse;
}

interface UseChatOptions {
  document: AnalysisFile | null;
  docId: string | null;
}

interface UseChatResult {
  messages: ChatMessage[];
  analyzing: boolean;
  chatLoading: boolean;
  historyLoading: boolean;
  error: string | null;
  runAnalysis: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  runDeepAnalysis: () => Promise<void>;
  createStrategy: (accountDetails?: string) => Promise<void>;
  buildDraft: () => Promise<void>;
}

function formatAnalysisResponse(result: NoticeResponse): string {
  let content = '';
  if (result.draft_reply) content += `**Draft Reply:**\n${result.draft_reply}\n\n`;
  if (result.citations?.length)
    content += `**Legal References:**\n${result.citations.map((c) => `• ${c}`).join('\n')}\n\n`;
  if (result.is_grounded !== undefined)
    content += `**Grounded in law:** ${result.is_grounded ? 'Yes' : 'No'}`;
  if (result.summary) content += `\n\n**Summary:**\n${result.summary}`;
  if (result.key_issues?.length)
    content += `\n\n**Key Issues:**\n${result.key_issues.map((i) => `• ${i}`).join('\n')}`;
  if (result.recommended_actions?.length)
    content += `\n\n**Recommended Actions:**\n${result.recommended_actions.map((a) => `• ${a}`).join('\n')}`;
  if (result.legal_references?.length && !result.citations?.length)
    content += `\n\n**Legal References:**\n${result.legal_references.map((r) => `• ${r}`).join('\n')}`;
  if (result.sources?.length && !result.citations?.length)
    content += `\n\n**Sources:**\n${result.sources.map((s) => `• ${s}`).join('\n')}`;
  if (!content.trim()) content = JSON.stringify(result, null, 2);
  return content;
}

function formatErrorDetail(err: any): string {
  const errorDetail = err?.response?.data?.detail;
  if (typeof errorDetail === 'object' && errorDetail?.stage)
    return `Stage: ${errorDetail.stage}. ${errorDetail.error || ''}`;
  if (typeof errorDetail === 'string') return errorDetail;
  return 'Please check that the AI service is running and try again.';
}

/**
 * Hook — manages all chat state for the document analysis chat page.
 * Handles AI API calls via chatService (service layer), persists messages to DB.
 */
export function useChat({ document, docId }: UseChatOptions): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const welcomeAddedRef = useRef(false);

  // Load history from DB when document is ready
  useEffect(() => {
    if (!docId || !document) return;

    const loadHistory = async () => {
      setHistoryLoading(true);
      welcomeAddedRef.current = false;
      try {
        const history: ApiChatMessage[] = await chatService.getHistory(docId);
        if (history.length > 0) {
          setMessages(
            history.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.createdAt),
              isAnalysis: m.isAnalysis,
            }))
          );
        } else {
          // No history — show welcome message (not persisted)
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: `I've loaded your document **${document.filename}**. Click "Run Analysis" to start the AI-powered analysis. I'll identify the notice type, extract key issues, find relevant legal references, and prepare a draft response.`,
              timestamp: new Date(),
            },
          ]);
        }
      } catch {
        // Silently fall back to welcome message
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: `I've loaded your document **${document.filename}**. Click "Run Analysis" to start the AI-powered analysis.`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [docId, document]);

  const runAnalysis = useCallback(async () => {
    if (!document || !docId) return;
    setAnalyzing(true);
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `Please analyze the document "${document.filename}" and provide a comprehensive legal analysis.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await chatService.decodeDocument({
        document_id: docId,
        notice_type: 'auto-detect',
        s3_bucket: document.s3Bucket,
        s3_key: document.s3Key,
      });

      const analysisContent = formatAnalysisResponse(result);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: analysisContent,
        timestamp: new Date(),
        isAnalysis: true,
        analysisResult: result,
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Persist both messages to DB
      await chatService.saveMessage(docId, 'user', userMsg.content, false);
      await chatService.saveMessage(docId, 'assistant', analysisContent, true);
    } catch (err: any) {
      const detail = formatErrorDetail(err);
      const errContent = `⚠️ Analysis failed. ${detail}`;
      const errMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: errContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      console.error('[useChat] runAnalysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  }, [document, docId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setChatLoading(true);
      setError(null);

      try {
        const result = await chatService.sendChatMessage({ message: text, document_id: docId ?? undefined });
        const answer = result.answer ?? '';
        const citations = result.citations ?? [];
        const content =
          citations.length > 0
            ? `${answer}\n\n**References:**\n${citations.map((c) => `• ${c}`).join('\n')}`
            : answer;

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: content || 'I could not generate a response. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Persist to DB if we have a docId
        if (docId) {
          await chatService.saveMessage(docId, 'user', text, false);
          await chatService.saveMessage(docId, 'assistant', aiMsg.content, false);
        }
      } catch (err: any) {
        const detail = formatErrorDetail(err);
        const errMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Chat failed. ${detail}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
        console.error('[useChat] sendMessage error:', err);
      } finally {
        setChatLoading(false);
      }
    },
    [docId]
  );

  const runDeepAnalysis = useCallback(async () => {
    if (!docId) return;
    setAnalyzing(true);
    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: 'Could you provide a deep structured analysis of this notice, including sections applied and immediate actions?',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const result = await chatService.analyzeNotice({
        document_id: docId,
        s3_bucket: document?.s3Bucket ?? undefined,
        s3_key: document?.s3Key ?? undefined,
      });
      let content = `**Notice Summary:**\n${result.summary}\n\n`;
      if (result.sections_applied?.length) content += `**Sections Applied:**\n${result.sections_applied.map(s => `• ${s}`).join('\n')}\n\n`;
      if (result.demands?.length) content += `**Demands:**\n${result.demands.map(d => `• ${d.description}: ${d.amount}`).join('\n')}\n\n`;
      if (result.deadline) content += `**Deadline:**\n• ${result.deadline}\n\n`;
      if (result.immediate_actions?.length) content += `**Immediate Actions:**\n${result.immediate_actions.map(a => `• ${a}`).join('\n')}\n\n`;
      if (result.citations?.length) content += `**Citations:**\n${result.citations.map(c => `• ${c}`).join('\n')}`;

      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, role: 'assistant', content: content.trim(), timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      await chatService.saveMessage(docId, 'user', userMsg.content, false);
      await chatService.saveMessage(docId, 'assistant', content, true);
    } catch (err: any) {
      console.error(err);
      setError(formatErrorDetail(err));
    } finally {
      setAnalyzing(false);
    }
  }, [docId]);

  const createStrategy = useCallback(async (accountDetails?: string) => {
    if (!docId) return;
    setAnalyzing(true);
    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: accountDetails ? 'Please generate a defense strategy tailored to the provided account details.' : 'Please generate a general defense strategy for this notice.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const result = await chatService.generateStrategy({
        document_id: docId,
        account_details: accountDetails,
        s3_bucket: document?.s3Bucket ?? undefined,
        s3_key: document?.s3Key ?? undefined,
      });
      let content = `**Defense Strategy Steps:**\n${result.strategy_steps.map(s => `• ${s}`).join('\n')}\n\n`;
      if (result.suggested_reply_points?.length) content += `**Suggested Reply Points:**\n${result.suggested_reply_points.map(p => `• ${p}`).join('\n')}\n\n`;
      content += `**Estimated Risk:**\n${result.estimated_risk}\n\n`;
      if (result.disclaimer) content += `*Disclaimer: ${result.disclaimer}*`;

      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, role: 'assistant', content: content.trim(), timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      await chatService.saveMessage(docId, 'user', userMsg.content, false);
      await chatService.saveMessage(docId, 'assistant', content, false);
    } catch (err: any) {
      console.error(err);
      setError(formatErrorDetail(err));
    } finally {
      setAnalyzing(false);
    }
  }, [docId]);

  const buildDraft = useCallback(async () => {
    if (!docId) return;
    setAnalyzing(true);
    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: 'Please prepare a formal HTML draft reply based on our discussion and the notice details.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const result = await chatService.generateDraft({
        document_id: docId,
        s3_bucket: document?.s3Bucket ?? undefined,
        s3_key: document?.s3Key ?? undefined,
      });
      let content = `${result.html_content}`;
      if (result.citations?.length) content += `\n\n**Citations Used:**\n${result.citations.map(c => `• ${c}`).join('\n')}`;

      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, role: 'assistant', content: content.trim(), timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      await chatService.saveMessage(docId, 'user', userMsg.content, false);
      await chatService.saveMessage(docId, 'assistant', content, false);
    } catch (err: any) {
      console.error(err);
      setError(formatErrorDetail(err));
    } finally {
      setAnalyzing(false);
    }
  }, [docId]);

  return { messages, analyzing, chatLoading, historyLoading, error, runAnalysis, sendMessage, runDeepAnalysis, createStrategy, buildDraft };
}
