"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { UploadCloud, FileText, ArrowRight, CheckCircle2, Loader2, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { documentService, AnalysisFile } from '@/services/documentService';

export default function IntakePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<AnalysisFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // Load recent uploads on mount
  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    try {
      setLoadingFiles(true);
      const files = await documentService.listAnalysisFiles();
      setRecentUploads(files);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const result = await documentService.uploadForAnalysis(file);
      setRecentUploads((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <Header title="Document Intake" subtitle="Upload notices or case files for AI analysis" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-4xl mx-auto">

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-default -z-10" />

            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-10 h-10 rounded-full bg-primary text-surface-light flex items-center justify-center font-bold shadow-md ring-4 ring-surface-light">1</div>
              <span className="text-sm font-medium text-text-heading">Upload</span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-surface-light ${recentUploads.length > 0 ? 'bg-primary text-surface-light shadow-md' : 'bg-surface-light border-2 border-border-default text-text-light'}`}>2</div>
              <span className={`text-sm font-medium ${recentUploads.length > 0 ? 'text-text-heading' : 'text-text-light'}`}>Analyze</span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-10 h-10 rounded-full bg-surface-light border-2 border-border-default text-text-light flex items-center justify-center font-bold ring-4 ring-surface-light">3</div>
              <span className="text-sm font-medium text-text-light">Draft</span>
            </div>
          </div>

          <div className="bg-surface-light border border-border-default rounded-3xl p-8 shadow-card mb-8">
            <h2 className="text-2xl font-serif text-text-heading mb-6">Upload Document</h2>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-8 ${
                isDragOver
                  ? 'border-primary bg-primary/10 scale-[1.01]'
                  : uploading
                  ? 'border-secondary bg-secondary/5'
                  : 'border-border-default hover:border-primary hover:bg-primary/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploading ? (
                <>
                  <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                    <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                  </div>
                  <h3 className="text-xl font-medium text-text-heading mb-2">Uploading to S3...</h3>
                  <p className="text-text-sub">Please wait while your file is being uploaded securely.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-background-light rounded-full flex items-center justify-center mb-6 group-hover:bg-surface-light group-hover:shadow-sm transition-all">
                    <UploadCloud className={`w-10 h-10 ${isDragOver ? 'text-primary' : 'text-text-light group-hover:text-primary'}`} />
                  </div>
                  <h3 className="text-xl font-medium text-text-heading mb-2">
                    {isDragOver ? 'Drop your file here' : 'Drag & drop your files here'}
                  </h3>
                  <p className="text-text-sub mb-6 max-w-md">
                    Support for PDF, DOCX, JPG, and PNG. Maximum file size 50MB.
                  </p>
                  <button className="bg-surface-light border border-border-default text-text-sub hover:bg-background-light px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all">
                    Browse Files
                  </button>
                </>
              )}
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{uploadError}</p>
                <button onClick={() => setUploadError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Recent Uploads */}
            <div className="space-y-4">
              <h4 className="font-medium text-text-heading">
                Uploaded Files
                {recentUploads.length > 0 && (
                  <span className="ml-2 text-xs bg-background-light text-text-light border border-border-subtle px-2 py-0.5 rounded-full font-normal">
                    {recentUploads.length}
                  </span>
                )}
              </h4>

              {loadingFiles ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : recentUploads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-text-sub">
                  <FileText className="w-8 h-8 mb-2 text-text-light" />
                  <p className="text-sm">No files uploaded yet. Upload a document to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentUploads.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => router.push(`/workspace/chat?docId=${file.id}`)}
                      className="flex items-center justify-between p-4 border border-border-subtle rounded-xl bg-background-light/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-soft text-red-text rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-text-heading group-hover:text-primary transition-colors">{file.filename}</p>
                          <p className="text-xs text-text-light">{formatSize(file.sizeBytes)} • {formatTime(file.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">Analyze →</span>
                        <CheckCircle2 className="w-5 h-5 text-green-text" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Proceed to Analysis */}
          {recentUploads.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => router.push(`/workspace/chat?docId=${recentUploads[0].id}`)}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-secondary-text px-8 py-3.5 rounded-xl font-semibold shadow-float transition-all transform hover:-translate-y-0.5"
              >
                Analyze Latest Upload
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
