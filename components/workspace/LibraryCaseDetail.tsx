'use client';

import { ArrowLeft, ExternalLink, FileText, File, FileType, Download, Loader2 } from 'lucide-react';
import { Case, CaseDocument } from '@/services/caseService';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateString: string|Date) {
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

interface LibraryCaseDetailProps {
  caseDetail: Case;
  onBack: () => void;
  onOpenCase: () => void;
  onDownload: (doc: CaseDocument) => void;
  downloading: string | null;
  onOpenDraft: (id: string) => void;
}

export function LibraryCaseDetail({
  caseDetail,
  onBack,
  onOpenCase,
  onDownload,
  downloading,
  onOpenDraft
}: LibraryCaseDetailProps) {
  const documents = caseDetail.documents ?? [];
  const drafts = caseDetail.drafts ?? [];

  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-text-sub hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to cases
      </button>
      
      <div className="bg-white rounded-2xl border border-border-default p-4 md:p-8 shadow-sm min-w-0 w-full overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-border-subtle min-w-0">
          <h2 className="text-2xl font-serif text-text-heading tracking-tight truncate flex-1 min-w-0">{caseDetail.title}</h2>
          <button
            onClick={onOpenCase}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Open case <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 min-w-0">
          <section className="bg-transparent min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-text-light" />
              <h3 className="font-medium text-text-sub text-sm uppercase tracking-wider">Documents</h3>
            </div>
            <div className="flex flex-col gap-3 min-w-0 w-full">
              {documents.length === 0 ? (
                <div className="px-5 py-10 text-center border border-dashed border-border-default rounded-xl bg-background-light w-full">
                  <File className="w-8 h-8 text-text-light mx-auto mb-2" />
                  <p className="text-sm text-text-light">No documents</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 rounded-xl border border-border-subtle bg-white hover:border-primary/50 hover:shadow-sm transition-all group overflow-hidden w-full max-w-[calc(100vw-64px)] md:max-w-full min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-background-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary text-text-light transition-colors">
                      <FileType className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div className="flex-[1_1_0%] min-w-0 pr-2 overflow-hidden">
                      <p className="font-medium text-text-heading truncate text-sm block min-w-0">{doc.filename}</p>
                      <p className="text-xs text-text-sub mt-0.5 truncate block min-w-0">{formatBytes(doc.sizeBytes)} · {timeAgo(doc.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => onDownload(doc)}
                      disabled={downloading === doc.id}
                      className="p-2 rounded-lg text-text-light hover:text-primary hover:bg-primary/5 transition-colors flex-shrink-0"
                      title="Download"
                    >
                      {downloading === doc.id ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <Download className="w-4 h-4 flex-shrink-0" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
          
          <section className="bg-transparent min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-text-light" />
              <h3 className="font-medium text-text-sub text-sm uppercase tracking-wider">Drafts</h3>
            </div>
            <div className="flex flex-col gap-3 min-w-0 w-full">
              {drafts.length === 0 ? (
                <div className="px-5 py-10 text-center border border-dashed border-border-default rounded-xl bg-background-light w-full">
                  <FileText className="w-8 h-8 text-text-light mx-auto mb-2" />
                  <p className="text-sm text-text-light">No drafts</p>
                </div>
              ) : (
                drafts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => onOpenDraft(d.id)}
                    className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 rounded-xl border border-border-subtle bg-white hover:border-primary/50 hover:shadow-sm transition-all text-left group overflow-hidden max-w-[calc(100vw-64px)] md:max-w-full min-w-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-background-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary text-text-light transition-colors">
                      <FileText className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <div className="flex-[1_1_0%] min-w-0 pr-2 overflow-hidden">
                      <p className="font-medium text-text-heading truncate text-sm block min-w-0">{d.title}</p>
                      <p className="text-xs text-text-sub mt-0.5 truncate block min-w-0">{d.category?.replace('_', ' ') || 'Draft'} · {timeAgo(d.updatedAt)}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-light group-hover:text-primary flex-shrink-0 transition-colors" />
                  </button>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
