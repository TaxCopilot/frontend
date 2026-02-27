import api from './api';

export interface Template {
  id: string;
  title: string;
  category: string;
}

export interface TemplateDetail extends Template {
  html: string;
}

export interface Draft {
  id: string;
  title: string;
  category: string;
  content: string | null;
  status: string;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  caseId: string | null;
  case?: { title: string; clientName: string | null };
}

export const draftService = {
  async getTemplates(): Promise<Template[]> {
    const { data } = await api.get('/api/drafts/templates');
    return data.data;
  },

  async getTemplate(id: string): Promise<TemplateDetail> {
    const { data } = await api.get(`/api/drafts/templates/${id}`);
    return data.data;
  },

  async getDrafts(): Promise<Draft[]> {
    const { data } = await api.get('/api/drafts');
    return data.data;
  },

  async getDraft(id: string): Promise<Draft> {
    const { data } = await api.get(`/api/drafts/${id}`);
    return data.data;
  },

  async createDraft(payload: { title?: string; category?: string; templateId?: string; content?: string; caseId?: string }): Promise<Draft> {
    const { data } = await api.post('/api/drafts', payload);
    return data.data;
  },

  async updateDraft(id: string, payload: { title?: string; content?: string; status?: string; category?: string }): Promise<Draft> {
    const { data } = await api.put(`/api/drafts/${id}`, payload);
    return data.data;
  },

  async deleteDraft(id: string): Promise<void> {
    await api.delete(`/api/drafts/${id}`);
  },

  async getTrash(): Promise<Draft[]> {
    const { data } = await api.get('/api/drafts/trash');
    return data.data;
  },

  async trashDraft(id: string): Promise<void> {
    await api.patch(`/api/drafts/${id}/trash`);
  },

  async restoreDraft(id: string): Promise<void> {
    await api.patch(`/api/drafts/${id}/restore`);
  },

  async permanentDeleteDraft(id: string): Promise<void> {
    await api.delete(`/api/drafts/${id}/permanent`);
  },
};
