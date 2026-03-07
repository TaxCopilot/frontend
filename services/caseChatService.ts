import api from './api';

export interface CaseChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isAnalysis?: boolean;
  createdAt: string;
}

export interface CaseChatSession {
  id: string;
  caseId: string;
  messages: CaseChatMessage[];
}

export const caseChatService = {
  async getSession(caseId: string): Promise<CaseChatSession['messages']> {
    const { data } = await api.get(`/api/cases/${caseId}/chat`);
    return data.data?.messages ?? [];
  },

  async addMessage(caseId: string, role: string, content: string, isAnalysis = false): Promise<CaseChatMessage> {
    const { data } = await api.post(`/api/cases/${caseId}/chat/messages`, {
      role,
      content,
      isAnalysis,
    });
    return data.data;
  },
};
