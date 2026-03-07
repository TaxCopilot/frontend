"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import {
  FolderOpen,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  File,
  FileType,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/useCases';
import { caseService, Case, CaseDocument, CaseDraft } from '@/services/caseService';
import { documentService } from '@/services/documentService';
import { PageSkeleton } from '@/components/SkeletonLoader';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Yesterday';
  if (day < 7) return `${day}d ago`;
  if (day < 30) return `${Math.floor(day / 7)}w ago`;
  return d.toLocaleDateString();
}

export default function LibraryPage() {
  const { cases, isLoading, fetchCases } = useCases();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [caseDetail, setCaseDetail] = useState<Case | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    if (!selectedCase) {
      setCaseDetail(null);
      return;
    }
    setLoadingDetail(true);
    caseService
      .getById(selectedCase.id)
      .then(setCaseDetail)
      .finally(() => setLoadingDetail(false));
  }, [selectedCase]);

  const filteredCases = cases.filter(
    (c) =>
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (doc: CaseDocument) => {
    setDownloading(doc.id);
    try {
      const { url, filename } = await documentService.getDownloadUrl(doc.id);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // ignore
    } finally {
      setDownloading(null);
    }
  };

  const documents = caseDetail?.documents ?? [];
  const drafts = caseDetail?.drafts ?? [];

  return (
    <>
      <Header title="Library" subtitle="Your cases" onSearch={setSearchTerm} searchValue={searchTerm} searchPlaceholder="Search cases..." />
      <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 scrollbar-thin">
        <div className="max-w-6xl mx-auto">
          {!selectedCase ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-border-default">
                  <FolderOpen className="w-16 h-16 text-text-light mb-4" />
                  <p className="text-text-sub text-sm">{searchTerm ? 'No cases match' : 'No cases yet'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCases.map((c) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedCase(null)}
                className="flex items-center gap-2 text-sm text-text-sub hover:text-primary mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to cases
              </button>
              {loadingDetail ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <h2 className="text-xl font-semibold text-text-heading">{caseDetail?.title}</h2>
                    <button
                      onClick={() => router.push(`/workspace/case/${selectedCase?.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark"
                    >
                      Open case <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <section className="bg-white rounded-xl border border-border-default shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-text-heading">Documents</h3>
                      </div>
                      <div className="divide-y divide-border-subtle">
                        {documents.length === 0 ? (
                          <div className="px-5 py-12 text-center">
                            <File className="w-10 h-10 text-text-light mx-auto mb-2" />
                            <p className="text-sm text-text-light">No documents</p>
                          </div>
                        ) : (
                          documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-background-light/50">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FileType className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-heading truncate">{doc.filename}</p>
                                <p className="text-xs text-text-light">{formatBytes(doc.sizeBytes)} · {timeAgo(doc.createdAt)}</p>
                              </div>
                              <button
                                onClick={() => handleDownload(doc)}
                                disabled={downloading === doc.id}
                                className="p-2 rounded-lg text-text-light hover:text-primary hover:bg-primary/5"
                                title="Download"
                              >
                                {downloading === doc.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                    <section className="bg-white rounded-xl border border-border-default shadow-sm overflow-hidden">
                      <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-text-heading">Drafts</h3>
                      </div>
                      <div className="divide-y divide-border-subtle">
                        {drafts.length === 0 ? (
                          <div className="px-5 py-12 text-center">
                            <FileText className="w-10 h-10 text-text-light mx-auto mb-2" />
                            <p className="text-sm text-text-light">No drafts</p>
                          </div>
                        ) : (
                          drafts.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => router.push(`/workspace/editor?id=${d.id}`)}
                              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-background-light/50 text-left"
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-heading truncate">{d.title}</p>
                                <p className="text-xs text-text-light">{d.category.replace('_', ' ')} · {timeAgo(d.updatedAt)}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-text-light flex-shrink-0" />
                            </button>
                          ))
                        )}
                      </div>
                    </section>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CaseCard({ caseItem, onClick }: { caseItem: Case; onClick: () => void }) {
  const docCount = caseItem._count?.documents ?? caseItem.documents?.length ?? 0;
  const draftCount = caseItem._count?.drafts ?? caseItem.drafts?.length ?? 0;
  const subtitle = caseItem.clientName || caseItem.description || 'Tax case';

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-border-default hover:border-primary/30 hover:shadow-md transition-all p-5 group min-h-[180px] flex flex-col"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20">
          <FolderOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text-heading truncate">{caseItem.title}</h4>
          <p className="text-sm text-text-sub truncate mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <p className="text-xs text-text-light">Edited {timeAgo(caseItem.updatedAt)}</p>
        <div className="flex items-center gap-2">
          {docCount > 0 && <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{docCount} docs</span>}
          {draftCount > 0 && <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{draftCount} drafts</span>}
        </div>
      </div>
    </button>
  );
}
