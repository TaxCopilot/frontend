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

export interface StrategyPayload {
  document_id: string;
  account_details?: string;
}

export interface DraftPayload {
  document_id: string;
}

// NoticeResponse from backend (often used by decode)
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

// AnalysisResponse from backend (for mode: analyze)
export interface AnalysisResponse {
  summary: string;
  sections_applied: string[];
  demands: { description: string; amount: string }[];
  deadline: string;
  immediate_actions: string[];
  citations: string[];
}

// StrategyResponse from backend (for mode: strategy)
export interface StrategyResponse {
  strategy_steps: string[];
  estimated_risk: string;
  suggested_reply_points: string[];
  disclaimer: string;
}

// DraftHtmlResponse from backend (for mode: draft)
export interface DraftHtmlResponse {
  html_content: string;
  citations: string[];
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
   * Run AI document processing (decode mode).
   * Calls POST /api/ai/v1/ask via the gateway.
   */
  async decodeDocument(payload: AnalyzeDocumentPayload): Promise<NoticeResponse> {
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
   * Run deep structured analysis of a parsed document (analyze mode).
   */
  async analyzeNotice(payload: { document_id: string; s3_bucket?: string; s3_key?: string }): Promise<AnalysisResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'analyze',
      document_id: payload.document_id,
      s3_bucket: payload.s3_bucket,
      s3_key: payload.s3_key,
    });
    return data;
  },

  /**
   * Generate a defense strategy (strategy mode).
   */
  async generateStrategy(payload: StrategyPayload & { s3_bucket?: string; s3_key?: string }): Promise<StrategyResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'strategy',
      document_id: payload.document_id,
      account_details: payload.account_details,
      s3_bucket: payload.s3_bucket,
      s3_key: payload.s3_key,
    });
    return data;
  },

  /**
   * Generate an HTML-formatted draft reply (draft mode).
   */
  async generateDraft(payload: DraftPayload & { s3_bucket?: string; s3_key?: string }): Promise<DraftHtmlResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'draft',
      document_id: payload.document_id,
      s3_bucket: payload.s3_bucket,
      s3_key: payload.s3_key,
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
   * Load chat history for a document.
   * History is managed server-side by the AI service per session.
   * Returns [] here; full history loads on each AI mode call.
   */
  async getHistory(_documentId: string): Promise<ChatMessage[]> {
    return [];
  },

  /**
   * No-op: message persistence is handled server-side by the AI service
   * (db_service.py appends to chat_messages table on every AI call).
   */
  async saveMessage(
    _documentId: string,
    _role: 'user' | 'assistant',
    _content: string,
    _isAnalysis = false,
  ): Promise<void> {
    // Server-side persistence only — no frontend DB call needed.
  },
};
