'use client';

import { useRef } from 'react';
import { 
  FileText, Loader2, Upload, FileStack, MoreVertical, Pencil, Trash 
} from 'lucide-react';
import { CaseDocument, CaseDraft } from '@/services/caseService';

interface CaseSidebarProps {
  caseData: {
    title: string;
    clientName?: string | null;
    referenceNo?: string | null;
    documents?: CaseDocument[];
    drafts?: CaseDraft[];
  };
  leftPanelWidth: number;
  startLeftDrag: (e: React.MouseEvent) => void;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  draftMenuOpen: string | null;
  setDraftMenuOpen: (id: string | null) => void;
  onRenameDraft: (id: string, title: string) => void;
  onDeleteDraft: (id: string) => void;
  documentMenuOpen: string | null;
  setDocumentMenuOpen: (id: string | null) => void;
  onDeleteDocument: (id: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (v: boolean) => void;
  router: any;
}

export function CaseSidebar({
  caseData,
  leftPanelWidth,
  startLeftDrag,
  uploading,
  onUpload,
  draftMenuOpen,
  setDraftMenuOpen,
  onRenameDraft,
  onDeleteDraft,
  documentMenuOpen,
  setDocumentMenuOpen,
  onDeleteDocument,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  router
}: CaseSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documents = caseData.documents ?? [];
  const drafts = caseData.drafts ?? [];

  return (
    <>
      <aside 
        style={{ width: isMobileSidebarOpen ? '100%' : leftPanelWidth }} 
        className={`border-r border-border-default bg-sidebar-bg flex flex-col h-full overflow-hidden flex-shrink-0 z-40 transition-transform duration-300 ${
          isMobileSidebarOpen 
            ? 'fixed inset-0 translate-x-0' 
            : 'max-md:-translate-x-full max-md:fixed max-md:inset-y-0 max-md:left-0 relative'
        }`}
      >
        {isMobileSidebarOpen && (
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 p-2 bg-background-light rounded-full shadow-sm z-50 text-text-sub"
          >
            ✕
          </button>
        )}

        {/* Case Header */}
        <div className="p-5 border-b border-border-default bg-background-light pt-12 md:pt-5">
          <h2 className="text-base font-semibold text-text-heading line-clamp-2 leading-snug">
            {caseData.title}
          </h2>
          {(caseData.clientName || caseData.referenceNo) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {caseData.clientName && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-border-default text-[11px] font-medium text-text-sub shadow-sm">
                  {caseData.clientName}
                </span>
              )}
              {caseData.referenceNo && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-border-default text-[11px] font-medium text-text-sub shadow-sm">
                  Ref: {caseData.referenceNo}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Documents & Drafts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin">
          {/* Documents */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-text-light uppercase tracking-wider">Documents</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                title="Upload document"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              </button>
            </div>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={onUpload} />
            <div className="space-y-1.5">
              {documents.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-xl border border-dashed border-border-default hover:border-primary/40 hover:bg-white bg-background-light cursor-pointer transition-all text-center group"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-border-default flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4 text-text-sub group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[11px] font-medium text-text-sub group-hover:text-primary transition-colors">Upload document</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="group relative flex items-center justify-between w-full max-w-full overflow-hidden rounded-xl text-sm bg-white border border-border-default shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="flex-[1_1_0%] flex items-center gap-3 px-3 py-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                        <FileStack className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-sm font-medium text-text-heading block truncate group-hover:text-primary transition-colors">{doc.filename}</span>
                        <span className="text-[10px] text-text-light uppercase tracking-wider mt-0.5 block truncate">Document</span>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity px-1 flex bg-white h-full items-center z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocument(doc.id);
                        }}
                        className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Drafts */}
          <section>
            <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-3">Drafts</p>
            <div className="space-y-1">
              {drafts.length === 0 ? (
                <p className="text-xs text-text-light py-4 px-3 text-center rounded-xl bg-background-light border border-dashed border-border-default">
                  No drafts yet
                </p>
              ) : (
                drafts.map((d) => (
                  <div key={d.id} className={`group relative flex items-center justify-between w-full max-w-full rounded-xl text-sm bg-white border border-border-default shadow-sm hover:border-primary/30 hover:shadow-md transition-all ${draftMenuOpen === d.id ? 'z-50' : 'z-10'}`}>
                    <button
                      onClick={() => router.push(`/workspace/editor?id=${d.id}`)}
                      className="flex-[1_1_0%] flex items-center gap-3 text-left px-3 py-2.5 min-w-0"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/5 text-primary transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-sm font-medium text-text-heading block truncate text-primary transition-colors">{d.title}</span>
                        <span className="text-[10px] text-text-light uppercase tracking-wider mt-0.5 block truncate">Draft</span>
                      </div>
                    </button>
                    <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDraftMenuOpen(draftMenuOpen === d.id ? null : d.id); }}
                        className="p-1.5 text-text-light hover:text-text-heading hover:bg-white rounded-md transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      {draftMenuOpen === d.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); setDraftMenuOpen(null); }} />
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-float border border-border-default py-1 z-30">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDraftMenuOpen(null);
                                onRenameDraft(d.id, d.title);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors"
                            >
                              <Pencil className="w-3 h-3" /> Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDraftMenuOpen(null);
                                onDeleteDraft(d.id);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                              <Trash className="w-3 h-3" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </aside>

      {/* Drag handle */}
      <div
        onMouseDown={startLeftDrag}
        className="hidden xl:flex w-1.5 flex-shrink-0 cursor-col-resize group items-center justify-center hover:bg-primary/10 transition-colors z-10 relative -ml-1 border-r border-transparent"
        title="Drag to resize"
      >
        <div className="w-0.5 h-8 rounded-full bg-border-default group-hover:bg-primary/40 transition-colors" />
      </div>
    </>
  );
}
