import api from './api';

export interface Case {
  id: string;
  title: string;
  clientName: string | null;
  referenceNo: string | null;
  description: string | null;
  status: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  _count?: { documents: number; drafts: number };
  documents?: CaseDocument[];
  drafts?: CaseDraft[];
}

export interface CaseDocument {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  s3Bucket: string | null;
  s3Key: string | null;
  createdAt: string;
}

export interface CaseDraft {
  id: string;
  title: string;
  category: string;
  status: string;
  updatedAt: string;
}

export const caseService = {
  async list(): Promise<Case[]> {
    const { data } = await api.get('/api/cases');
    return data.data;
  },

  async getById(id: string): Promise<Case> {
    const { data } = await api.get(`/api/cases/${id}`);
    return data.data;
  },

  async create(payload: { title: string; clientName?: string; referenceNo?: string; description?: string }): Promise<Case> {
    const { data } = await api.post('/api/cases', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Pick<Case, 'title' | 'clientName' | 'referenceNo' | 'description' | 'status' | 'dueDate'>>): Promise<Case> {
    const { data } = await api.put(`/api/cases/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/cases/${id}`);
  },

  async getTrash(): Promise<Case[]> {
    const { data } = await api.get('/api/cases/trash');
    return data.data;
  },

  async restore(id: string): Promise<void> {
    await api.patch(`/api/cases/${id}/restore`);
  },

  async permanentDelete(id: string): Promise<void> {
    await api.delete(`/api/cases/${id}/permanent`);
  },
};
