"use client";

import { useEffect, useState } from 'react';
import { RefreshCw, Trash2, FileText, Loader2, FolderOpen, Folder } from 'lucide-react';
import { useDraftStore } from '@/stores/draftStore';
import { caseService, Case } from '@/services/caseService';
import { useRouter } from 'next/navigation';

function timeAgo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    SCN_REPLY: 'bg-red-soft text-red-text',
    APPEAL_MEMORANDUM: 'bg-blue-soft text-blue-text',
    LEGAL_OPINION: 'bg-purple-soft text-purple-text',
    GENERAL: 'bg-teal-soft text-teal-text',
  };
  return colors[category] || colors.GENERAL;
}

type Tab = 'cases' | 'drafts';

export default function TrashPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('cases');
  const [caseTrash, setCaseTrash] = useState<Case[]>([]);
  const [caseTrashLoading, setCaseTrashLoading] = useState(false);
  const [deleteCaseId, setDeleteCaseId] = useState<string | null>(null);
  const [deleteDraftId, setDeleteDraftId] = useState<string | null>(null);

  const draftTrash = useDraftStore((s) => s.trash);
  const draftLoading = useDraftStore((s) => s.isLoading);
  const fetchDraftTrash = useDraftStore((s) => s.fetchTrash);
  const restoreDraft = useDraftStore((s) => s.restoreDraft);
  const permanentDeleteDraft = useDraftStore((s) => s.permanentDelete);

  useEffect(() => {
    fetchDraftTrash();
  }, [fetchDraftTrash]);

  useEffect(() => {
    const load = async () => {
      setCaseTrashLoading(true);
      try {
        const list = await caseService.getTrash();
        setCaseTrash(list);
      } catch {
        setCaseTrash([]);
      } finally {
        setCaseTrashLoading(false);
      }
    };
    load();
  }, []);

  const handleRestoreCase = async (id: string) => {
    await caseService.restore(id);
    setCaseTrash((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  };

  const handleDeleteCase = async (id: string) => {
    setDeleteCaseId(id);
  };

  const handleRestoreDraft = async (id: string) => {
    await restoreDraft(id);
  };

  const handleDeleteDraft = async (id: string) => {
    setDeleteDraftId(id);
  };

  const count = tab === 'cases' ? caseTrash.length : draftTrash.length;
  const isEmpty = tab === 'cases' ? caseTrash.length === 0 : draftTrash.length === 0;
  const isLoading = tab === 'cases' ? caseTrashLoading : draftLoading;

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 scrollbar-thin bg-[#FAF9F5]">
      <div className="max-w-5xl mx-auto">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-[28px] font-serif text-text-heading tracking-tight">Trash</h1>
          <p className="text-text-sub mt-1">Restore or permanently delete items</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex rounded-xl border border-border-default overflow-hidden bg-surface-light">
            <button
              onClick={() => setTab('cases')}
              className={`px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors ${tab === 'cases' ? 'bg-primary text-white' : 'text-text-sub hover:bg-background-light hover:text-text-heading'
                }`}
            >
              <Folder className="w-4 h-4" />
              Cases
              {caseTrash.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${tab === 'cases' ? 'bg-white/20' : 'bg-border-default'}`}>
                  {caseTrash.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('drafts')}
              className={`px-5 py-2.5 text-sm font-semibold flex items-center gap-2 transition-colors ${tab === 'drafts' ? 'bg-primary text-white' : 'text-text-sub hover:bg-background-light hover:text-text-heading'
                }`}
            >
              <FileText className="w-4 h-4" />
              Drafts
              {draftTrash.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${tab === 'drafts' ? 'bg-white/20' : 'bg-border-default'}`}>
                  {draftTrash.length}
                </span>
              )}
            </button>
          </div>
          <span className="text-sm text-text-sub bg-background-light px-3 py-1.5 rounded-lg border border-border-subtle">
            {count} {tab === 'cases' ? 'case' : 'draft'}{count !== 1 ? 's' : ''} in trash
          </span>
        </div>

        <div className="bg-surface-light rounded-2xl border border-border-default shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-background-light flex items-center justify-center mb-4 border border-border-subtle">
                <Trash2 className="w-8 h-8 text-text-light opacity-50" />
              </div>
              <h3 className="text-lg font-semibold text-text-heading mb-2">
                {tab === 'cases' ? 'No deleted cases' : 'No deleted drafts'}
              </h3>
              <p className="text-text-sub text-sm max-w-sm">
                {tab === 'cases'
                  ? 'Deleted cases will appear here. You can restore them or permanently delete them.'
                  : 'Deleted drafts will appear here. You can restore them or permanently delete them.'}
              </p>
            </div>
          ) : tab === 'cases' ? (
            <div className="divide-y divide-border-subtle">
              {caseTrash.map((c) => (
                <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-background-light/50 transition-colors group">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-heading text-lg mb-0.5">{c.title}</h4>
                      <p className="text-sm text-text-sub flex items-center gap-2">
                        <span>Deleted {timeAgo(c.deletedAt || c.updatedAt)}</span>
                        {(c._count?.documents ?? 0) > 0 && (
                          <>
                            <span className="text-border-subtle">•</span>
                            <span>{c._count?.documents} doc(s)</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRestoreCase(c.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-sub hover:text-primary bg-background-light hover:bg-primary/5 border border-border-subtle hover:border-primary/20 rounded-lg transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteCase(c.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {draftTrash.map((draft) => (
                <div key={draft.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-background-light/50 transition-colors group">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${getCategoryColor(draft.category)}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-heading text-lg mb-0.5">{draft.title}</h4>
                      <p className="text-sm text-text-sub flex items-center gap-2">
                        <span>{draft.category.replace('_', ' ')}</span>
                        <span className="text-border-subtle">•</span>
                        <span>Deleted {timeAgo(draft.deletedAt || draft.updatedAt)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRestoreDraft(draft.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-sub hover:text-primary bg-background-light hover:bg-primary/5 border border-border-subtle hover:border-primary/20 rounded-lg transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteCaseId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-text-heading mb-2">Delete Permanently</h3>
            <p className="text-sm text-text-sub mb-6">Are you sure you want to permanently delete this case? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteCaseId(null)}
                className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await caseService.permanentDelete(deleteCaseId);
                    setCaseTrash((prev) => prev.filter((c) => c.id !== deleteCaseId));
                    setDeleteCaseId(null);
                  } catch (err) { console.error(err); }
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDraftId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-text-heading mb-2">Delete Permanently</h3>
            <p className="text-sm text-text-sub mb-6">Are you sure you want to permanently delete this draft? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteDraftId(null)}
                className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await permanentDeleteDraft(deleteDraftId);
                    setDeleteDraftId(null);
                  } catch (err) { console.error(err); }
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
