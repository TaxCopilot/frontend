import api from './api';

// ─── Request / Response Types ────────────────────────────────────────────────

export interface DocumentRef {
  document_id: string;
  filename?: string | null;
  s3_bucket?: string | null;
  s3_key?: string | null;
  extracted_text?: string | null;
}

export interface AnalyzeDocumentPayload {
  session_id: string;
  documents: DocumentRef[];
  notice_type?: string;
  regenerate?: boolean;
  message?: string;
}

export interface ChatMessagePayload {
  session_id: string;
  documents: DocumentRef[];
  message: string;
}

export interface StrategyPayload {
  session_id: string;
  documents: DocumentRef[];
  account_details?: string;
}

export interface DraftPayload {
  session_id: string;
  documents: DocumentRef[];
  message?: string;
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
  report: string;
  notice_type: string;
  risk_level: string;
  deadline: string;
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
      session_id: payload.session_id,
      documents: payload.documents,
      notice_type: payload.notice_type ?? 'auto-detect',
      regenerate: payload.regenerate ?? false,
    });
    return data;
  },

  /**
   * Run deep structured analysis of parsed documents (analyze mode).
   */
  async analyzeNotice(payload: { session_id: string; documents: DocumentRef[]; message?: string }): Promise<AnalysisResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'analyze',
      session_id: payload.session_id,
      documents: payload.documents,
      ...(payload.message ? { message: payload.message } : {}),
    });
    return data;
  },

  /**
   * Generate a defense strategy (strategy mode).
   */
  async generateStrategy(payload: StrategyPayload): Promise<StrategyResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'strategy',
      session_id: payload.session_id,
      documents: payload.documents,
      account_details: payload.account_details,
    });
    return data;
  },

  /**
   * Generate an HTML-formatted draft reply (draft mode).
   */
  async generateDraft(payload: DraftPayload): Promise<DraftHtmlResponse> {
    const { data } = await api.post('/api/ai/v1/ask', {
      mode: 'draft',
      session_id: payload.session_id,
      documents: payload.documents,
      ...(payload.message ? { message: payload.message } : {}),
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
      session_id: payload.session_id,
      documents: payload.documents,
      message: payload.message,
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
