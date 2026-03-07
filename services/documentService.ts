import api from './api';

export interface UploadResponse {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  extractedHtml: string | null;
}

export interface AnalysisFile {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  s3Bucket: string | null;
  s3Key: string | null;
  createdAt: string;
}

export const documentService = {
  /** Upload a file for draft text extraction (existing flow, unchanged) */
  async upload(file: File, caseId?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('caseId', caseId);

    const { data } = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** Upload a file to S3 for AI analysis (optionally linked to a case) */
  async uploadForAnalysis(file: File, caseId?: string): Promise<AnalysisFile> {
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('caseId', caseId);

    const { data } = await api.post('/api/analysis-files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** List all analysis files uploaded by the user */
  async listAnalysisFiles(): Promise<AnalysisFile[]> {
    const { data } = await api.get('/api/analysis-files');
    return data.data;
  },

  /** Get a single analysis file by ID */
  async getAnalysisFile(id: string): Promise<AnalysisFile> {
    const { data } = await api.get(`/api/analysis-files/${id}`, {
      __skipAuthError: true,
    });
    return data.data;
  },

  /** Get a pre-signed download URL for an analysis file */
  async getDownloadUrl(id: string): Promise<{ url: string; filename: string }> {
    const { data } = await api.get(`/api/analysis-files/${id}/download`);
    return data.data;
  },

  /** Delete an analysis file */
  async deleteAnalysisFile(id: string): Promise<void> {
    await api.delete(`/api/analysis-files/${id}`);
  },
};
