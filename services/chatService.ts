import api from './api';

// ─── Request / Response Types ────────────────────────────────────────────────

export interface AnalyzeDocumentPayload {
  document_id: string;
  notice_type?: string;
  s3_bucket?: string | null;
  s3_key?: string | null;
  regenerate?: boolean;
}

export interface ChatMessagePayload {
  message: string;
  document_id?: string;
}

export interface NoticeResponse {
  draft_reply?: string;
  citations?: string[];
  is_grounded?: boolean;
  summary?: string;
  key_issues?: string[];
  recommended_actions?: string[];
  legal_references?: string[];
  sources?: string[];
}

export interface ChatResponse {
  answer: string;
  citations?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isAnalysis?: boolean;
  createdAt: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const chatService = {
  /**
   * Run AI document analysis (decode mode).
   * Calls POST /api/ai/v1/ask via the gateway.
   */
  async analyzeDocument(payload: AnalyzeDocumentPayload): Promise<NoticeResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'decode',
      document_id: payload.document_id,
      notice_type: payload.notice_type ?? 'auto-detect',
      s3_bucket: payload.s3_bucket,
      s3_key: payload.s3_key,
      regenerate: payload.regenerate ?? false,
    });
    return data;
  },

  /**
   * Send a freeform chat message to the AI (chat mode).
   * Calls POST /api/ai/v1/ask via the gateway.
   */
  async sendChatMessage(payload: ChatMessagePayload): Promise<ChatResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'chat',
      message: payload.message,
      document_id: payload.document_id,
    });
    return data;
  },

  /**
   * Load chat history for a document from the backend.
   * Returns [] if no session exists yet.
   */
  async getHistory(documentId: string): Promise<ChatMessage[]> {
    try {
      const { data } = await api.get(`/api/chat-sessions/${documentId}`, {
        __skipAuthError: true,
      });
      return data.data?.messages ?? [];
    } catch {
      return [];
    }
  },

  /**
   * Persist a single chat message to the backend.
   */
  async saveMessage(
    documentId: string,
    role: 'user' | 'assistant',
    content: string,
    isAnalysis = false,
  ): Promise<void> {
    await api.post(`/api/chat-sessions/${documentId}/messages`, {
      role,
      content,
      isAnalysis,
    });
  },
};
