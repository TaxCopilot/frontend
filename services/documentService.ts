import api from './api';

export interface UploadResponse {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  extractedHtml: string | null;
}

export const documentService = {
  async upload(file: File, caseId?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('caseId', caseId);

    const { data } = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
