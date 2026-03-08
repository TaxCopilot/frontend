"use client";

import { useState, useEffect } from 'react';
import {
  FolderOpen,
  FileText,
  Download,
  ExternalLink,
  Loader2,
  File,
  FileType,
  ArrowLeft,
  Search,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/useCases';
import { caseService, Case, CaseDocument } from '@/services/caseService';
import { documentService } from '@/services/documentService';
import { CreateCaseModal } from '@/components/CreateCaseModal';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'activity' | 'name'>('activity');
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

  let filteredCases = cases.filter(
    (c) =>
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'name') {
    filteredCases = [...filteredCases].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredCases = [...filteredCases].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

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
      <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 scrollbar-thin bg-surface-light">
        <div className="max-w-5xl mx-auto">
          {!selectedCase ? (
            <div className="flex flex-col gap-6">
              
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-[28px] font-serif text-text-heading tracking-tight">Library</h1>
                <button
                   onClick={() => setShowCreateModal(true)}
                   className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" /> New case
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-light flex-shrink-0 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-border-default rounded-xl text-text-heading focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-text-light"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex justify-end relative">
                <div className="flex items-center gap-2">
                  <span className="text-text-sub text-sm hidden sm:block">Sort by</span>
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-white text-sm text-text-sub hover:bg-background-light transition-colors"
                  >
                    {sortBy === 'activity' ? 'Activity' : 'Name'} <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                {sortDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-border-default rounded-xl shadow-lg py-1 z-20 overflow-hidden">
                      <button
                        onClick={() => { setSortBy('activity'); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === 'activity' ? 'bg-primary/5 text-primary font-medium' : 'text-text-sub hover:bg-background-light'}`}
                      >
                        Activity
                      </button>
                      <button
                        onClick={() => { setSortBy('name'); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === 'name' ? 'bg-primary/5 text-primary font-medium' : 'text-text-sub hover:bg-background-light'}`}
                      >
                        Name
                      </button>
                    </div>
                  </>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20 mt-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 mt-10 text-center bg-white rounded-2xl border border-border-default">
                  <FolderOpen className="w-16 h-16 text-text-light mb-4" />
                  <p className="text-text-sub text-sm">{searchTerm ? 'No cases match' : 'No cases yet'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {filteredCases.map((c) => (
                    <CaseCard key={c.id} caseItem={c} onClick={() => setSelectedCase(c)} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* DETAIL VIEW */}
              <button
                onClick={() => setSelectedCase(null)}
                className="flex items-center gap-2 text-sm text-text-sub hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to cases
              </button>
              {loadingDetail ? (
                <div className="flex items-center justify-center py-20 mt-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border-default p-8 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-border-subtle">
                    <h2 className="text-2xl font-serif text-text-heading tracking-tight">{caseDetail?.title}</h2>
                    <button
                      onClick={() => router.push(`/workspace/case/${selectedCase?.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Open case <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-10">
                    <section className="bg-transparent">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-text-light" />
                        <h3 className="font-medium text-text-sub text-sm uppercase tracking-wider">Documents</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        {documents.length === 0 ? (
                          <div className="px-5 py-10 text-center border border-dashed border-border-default rounded-xl bg-background-light">
                            <File className="w-8 h-8 text-text-light mx-auto mb-2" />
                            <p className="text-sm text-text-light">No documents</p>
                          </div>
                        ) : (
                          documents.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border-subtle bg-white hover:border-primary/50 hover:shadow-sm transition-all group">
                              <div className="w-10 h-10 rounded-lg bg-background-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary text-text-light transition-colors">
                                <FileType className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-heading truncate text-sm">{doc.filename}</p>
                                <p className="text-xs text-text-sub mt-0.5">{formatBytes(doc.sizeBytes)} · {timeAgo(doc.createdAt)}</p>
                              </div>
                              <button
                                onClick={() => handleDownload(doc)}
                                disabled={downloading === doc.id}
                                className="p-2 rounded-lg text-text-light hover:text-primary hover:bg-primary/5 transition-colors"
                                title="Download"
                              >
                                {downloading === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </section>
                    <section className="bg-transparent">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-text-light" />
                        <h3 className="font-medium text-text-sub text-sm uppercase tracking-wider">Drafts</h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        {drafts.length === 0 ? (
                          <div className="px-5 py-10 text-center border border-dashed border-border-default rounded-xl bg-background-light">
                            <FileText className="w-8 h-8 text-text-light mx-auto mb-2" />
                            <p className="text-sm text-text-light">No drafts</p>
                          </div>
                        ) : (
                          drafts.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => router.push(`/workspace/editor?id=${d.id}`)}
                              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-border-subtle bg-white hover:border-primary/50 hover:shadow-sm transition-all text-left group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-background-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary text-text-light transition-colors">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-heading truncate text-sm">{d.title}</p>
                                <p className="text-xs text-text-sub mt-0.5">{d.category.replace('_', ' ')} · {timeAgo(d.updatedAt)}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-text-light group-hover:text-primary flex-shrink-0 transition-colors" />
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

      <CreateCaseModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(caseId) => {
          setShowCreateModal(false);
          router.push(`/workspace/case/${caseId}`);
        }}
      />
    </>
  );
}

function CaseCard({ caseItem, onClick }: { caseItem: Case; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-border-default hover:border-primary/50 hover:shadow-md transition-all px-6 py-5 group min-h-[140px] flex flex-col justify-between overflow-hidden relative"
    >
      <div className="w-full">
        <h4 className="font-medium text-[15px] text-text-heading truncate mb-1">{caseItem.title}</h4>
      </div>
      <div>
        <p className="text-[13px] text-text-sub">Updated {timeAgo(caseItem.updatedAt)}</p>
      </div>
      {/* Subtle hover gradient effect on the bottom edge to make it look premium */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all opacity-0 group-hover:opacity-100" />
    </button>
  );
}
