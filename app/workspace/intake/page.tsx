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
          <div className="flex items-center mb-12">

            {/* Step 1 – Upload (always active) */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md ring-4 ring-background-light">1</div>
              <span className="text-sm font-medium text-text-heading">Upload</span>
            </div>

            {/* Connector 1→2 */}
            <div className="flex-1 mx-2 mt-[-18px]">
              <div className="h-1 w-full bg-border-default rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${recentUploads.length > 0 ? 'w-full bg-primary' : 'w-0'}`} />
              </div>
            </div>

            {/* Step 2 – Analyze */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ring-4 ring-background-light transition-all duration-300 ${recentUploads.length > 0 ? 'bg-primary text-white shadow-md' : 'bg-surface-light border-2 border-border-default text-text-light'}`}>2</div>
              <span className={`text-sm font-medium transition-colors ${recentUploads.length > 0 ? 'text-text-heading' : 'text-text-light'}`}>Analyze</span>
            </div>

            {/* Connector 2→3 */}
            <div className="flex-1 mx-2 mt-[-18px]">
              <div className="h-1 w-full bg-border-default rounded-full overflow-hidden">
                <div className="h-full rounded-full w-0 bg-primary" />
              </div>
            </div>

            {/* Step 3 – Draft */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-surface-light border-2 border-border-default text-text-light flex items-center justify-center font-bold ring-4 ring-background-light">3</div>
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
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group mb-8 ${isDragOver
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

          </div>
        </div>
      </div>
    </>
  );
}
