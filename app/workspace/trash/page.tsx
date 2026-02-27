"use client";

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { useDraftStore } from '@/stores/draftStore';
import { RefreshCw, Trash2, FileText, Loader2 } from 'lucide-react';

function timeAgo(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `Just now`;
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

export default function TrashPage() {
  const trash = useDraftStore((s) => s.trash);
  const isLoading = useDraftStore((s) => s.isLoading);
  const fetchTrash = useDraftStore((s) => s.fetchTrash);
  const restoreDraft = useDraftStore((s) => s.restoreDraft);
  const permanentDelete = useDraftStore((s) => s.permanentDelete);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id: string) => {
    await restoreDraft(id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this draft? This cannot be undone.')) {
      await permanentDelete(id);
    }
  };

  return (
    <>
      <Header title="Trash" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 pt-8 scrollbar-thin">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-text-heading border-l-4 border-red-500 pl-4 py-1">Trash</h2>
          <span className="text-sm text-text-sub bg-background-light px-3 py-1 rounded-full border border-border-subtle shadow-sm">
            {trash.length} items
          </span>
        </div>

        {/* Trash List */}
        <div className="bg-surface border border-border-default rounded-2xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : trash.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Trash2 className="w-8 h-8 text-text-light opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-text-heading mb-2">Trash is empty</h3>
              <p className="text-text-sub font-light max-w-sm">
                Items moved to trash will appear here. You can restore them or permanently delete them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {trash.map((draft) => (
                <div key={draft.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-background/50 transition-colors group">
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${getCategoryColor(draft.category)}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-heading text-lg mb-1">{draft.title}</h4>
                      <p className="text-sm text-text-sub flex items-center gap-2">
                        <span>{draft.category.replace('_', ' ')}</span>
                        <span className="text-border-subtle">•</span>
                        <span>Deleted {timeAgo(draft.deletedAt || draft.updatedAt)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRestore(draft.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-sub hover:text-primary bg-background-light hover:bg-primary/5 border border-border-subtle hover:border-primary/20 rounded-lg transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id)}
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
    </>
  );
}
