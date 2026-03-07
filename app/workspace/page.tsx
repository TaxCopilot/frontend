"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Plus, FolderOpen, FileText, Scale, Loader2, Search, LayoutGrid, List, MessageCircle, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/useCases';
import { caseService, Case } from '@/services/caseService';
import { useAuthStore } from '@/stores/authStore';
import { PageSkeleton } from '@/components/SkeletonLoader';

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
  return `${Math.floor(day / 30)}mo ago`;
}

export default function WorkspacePage() {
  const { cases, isLoading, fetchCases } = useCases();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const c = await caseService.create({ title: title.trim(), description: description.trim() || undefined });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      router.push(`/workspace/case/${c.id}`);
    } finally {
      setCreating(false);
    }
  };

  let filtered = cases.filter(
    (c) =>
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.clientName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filtered = [...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  if (isLoading) {
    return (
      <>
        <Header title="Workspace" subtitle="Your tax cases" />
        <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 pt-8 scrollbar-thin">
          <PageSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Workspace" subtitle={`Good to see you, ${firstName}`} />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 pt-8 scrollbar-thin">
        {/* CTA Section - Image 3 style */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-text-heading mb-2">Ready to analyze a new case?</h2>
          <p className="text-text-sub text-sm max-w-2xl mb-6">
            Upload a tax notice or legal document. The Agentic AI will analyze the root cause, cross-reference laws, and draft a response strategy instantly.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-semibold shadow-md hover:bg-primary-dark transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Start Agentic Chat
          </button>
        </div>

        {/* Cases Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-text-heading">
              Cases <span className="text-text-light font-normal">{filtered.length}</span>
            </h3>
            <div className="flex items-center gap-3">
              {/* Floating search - icon + minimal */}
              <div className="relative flex items-center rounded-xl border border-border-default bg-white pl-3 pr-4 py-2 w-44 sm:w-52 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                <Search className="w-4 h-4 text-text-light flex-shrink-0" aria-hidden />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent px-2 py-0.5 text-sm placeholder-text-light focus:outline-none"
                  aria-label="Search cases"
                />
              </div>
              {/* Sort by */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border-default bg-white text-sm text-text-sub hover:bg-background-light"
                >
                  Sort by <ChevronDown className="w-4 h-4" />
                </button>
                {sortDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-border-default rounded-xl shadow-lg py-1.5 z-20">
                      <button
                        onClick={() => { setSortBy('recent'); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'recent' ? 'bg-primary/5 text-primary font-medium' : 'text-text-sub hover:bg-background-light'}`}
                      >
                        Recent
                      </button>
                      <button
                        onClick={() => { setSortBy('name'); setSortDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'name' ? 'bg-primary/5 text-primary font-medium' : 'text-text-sub hover:bg-background-light'}`}
                      >
                        Name
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* View mode */}
              <div className="flex rounded-lg border border-border-subtle overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-light hover:text-text-sub'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-text-light hover:text-text-sub'}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'flex flex-col gap-3'}>
            {/* Create New Case card - first */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex flex-col items-center justify-center min-h-[180px] rounded-xl border-2 border-border-default hover:border-primary/50 hover:bg-primary/5 transition-all text-text-sub hover:text-primary group bg-white"
            >
              <div className="w-14 h-14 rounded-xl bg-background-light group-hover:bg-primary/10 flex items-center justify-center mb-3">
                <Plus className="w-7 h-7" />
              </div>
              <span className="font-semibold text-text-heading">Create New Case</span>
            </button>

            {filtered.map((c) => (
              <CaseCard key={c.id} caseItem={c} viewMode={viewMode} onClick={() => router.push(`/workspace/case/${c.id}`)} />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <FolderOpen className="w-12 h-12 text-text-light mb-3" />
                <p className="text-text-sub text-sm">
                  {searchTerm ? 'No cases match your search.' : 'No cases yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !creating && setShowCreateModal(false)}>
          <div className="bg-surface-light rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-text-heading mb-4">Create Case</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-1.5">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. GST Notice – ABC Traders"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-heading mb-1.5">Description (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Brief context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => !creating && setShowCreateModal(false)} className="flex-1 px-4 py-2.5 border border-border-default rounded-xl text-sm font-medium text-text-sub hover:bg-background-light">
                  Cancel
                </button>
                <button type="submit" disabled={creating || !title.trim()} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2">
                  {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function CaseCard({ caseItem, viewMode, onClick }: { caseItem: Case; viewMode: 'grid' | 'list'; onClick: () => void }) {
  const docCount = caseItem._count?.documents ?? caseItem.documents?.length ?? 0;
  const draftCount = caseItem._count?.drafts ?? caseItem.drafts?.length ?? 0;
  const subtitle = caseItem.clientName || caseItem.description || 'Tax case';

  if (viewMode === 'list') {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-4 p-4 rounded-xl bg-white border border-border-default hover:border-primary/30 hover:shadow-sm transition-all text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <FolderOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-text-heading truncate">{caseItem.title}</h4>
          <p className="text-sm text-text-sub truncate">{subtitle}</p>
          <p className="text-xs text-text-light mt-0.5">Edited {timeAgo(caseItem.updatedAt)}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-light">
          <span>{docCount} docs</span>
          <span>{draftCount} drafts</span>
        </div>
      </button>
    );
  }

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
          {docCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{docCount} docs</span>
          )}
          {draftCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">{draftCount} drafts</span>
          )}
        </div>
      </div>
    </button>
  );
}
