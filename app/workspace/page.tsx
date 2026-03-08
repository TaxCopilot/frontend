"use client";

import { useState, useEffect } from 'react';
import { Plus, FolderOpen, FileText, Scale, Loader2, Search, LayoutGrid, List, MessageCircle, ChevronDown, MoreHorizontal, Pencil, Trash, Eye, ExternalLink, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/useCases';
import { caseService, Case } from '@/services/caseService';
import { useAuthStore } from '@/stores/authStore';
import { PageSkeleton } from '@/components/SkeletonLoader';
import { CreateCaseModal } from '@/components/CreateCaseModal';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Modals / Menu State
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameCase, setRenameCase] = useState<Case | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [deleteCase, setDeleteCase] = useState<Case | null>(null);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

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
      <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 scrollbar-thin bg-[#FAF9F5]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-serif text-text-heading tracking-tight">Workspace</h1>
              <p className="text-text-sub mt-1">Your tax cases</p>
            </div>
          </div>
          <PageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 scrollbar-thin bg-[#FAF9F5]">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-serif text-text-heading tracking-tight">Workspace</h1>
              <p className="text-text-sub mt-1">Good to see you, {firstName}</p>
            </div>
            <button
               onClick={() => setShowCreateModal(true)}
               className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> New case
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex items-center w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-light flex-shrink-0 pointer-events-none" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-border-default rounded-xl text-text-heading focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none placeholder:text-text-light"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Sort by */}
              <div className="relative mt-2 sm:mt-0">
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
              <CaseCard 
                key={c.id} 
                caseItem={c} 
                viewMode={viewMode} 
                onClick={() => router.push(`/workspace/case/${c.id}`)} 
                menuOpen={menuOpenId === c.id}
                onToggleMenu={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)}
                onRename={() => { setRenameCase(c); setRenameInput(c.title); setMenuOpenId(null); }}
                onTrash={() => { setDeleteCase(c); setMenuOpenId(null); }}
                onView={() => { router.push(`/workspace/library`); setMenuOpenId(null); }}
                onOpen={() => { router.push(`/workspace/case/${c.id}`); setMenuOpenId(null); }}
              />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-border-default">
                <FolderOpen className="w-12 h-12 text-text-light mb-3" />
                <p className="text-text-sub text-sm">
                  {searchTerm ? 'No cases match your search.' : 'No cases yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {renameCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-text-heading mb-4">Rename Case</h3>
            <input
              autoFocus
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && renameInput.trim()) {
                  try {
                    await caseService.update(renameCase.id, { title: renameInput.trim() });
                    await fetchCases();
                    setRenameCase(null);
                  } catch(err) { console.error(err); }
                }
                if (e.key === 'Escape') setRenameCase(null);
              }}
              className="w-full bg-background-light border border-border-default rounded-xl py-2 px-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-4"
              placeholder="Case Name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameCase(null)}
                className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!renameInput.trim()) return;
                  try {
                    await caseService.update(renameCase.id, { title: renameInput.trim() });
                    await fetchCases();
                    setRenameCase(null);
                  } catch(err) { console.error(err); }
                }}
                disabled={!renameInput.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteCase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-text-heading mb-2">Move to Trash</h3>
            <p className="text-sm text-text-sub mb-6">Are you sure you want to move this case to trash?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteCase(null)}
                className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await caseService.delete(deleteCase.id);
                    await fetchCases();
                    setDeleteCase(null);
                  } catch(err) { console.error(err); }
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors"
              >
                Delete Case
              </button>
            </div>
          </div>
        </div>
      )}

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

function CaseCard({ 
  caseItem, 
  viewMode, 
  onClick,
  menuOpen,
  onToggleMenu,
  onRename,
  onTrash,
  onView,
  onOpen
}: { 
  caseItem: Case; 
  viewMode: 'grid' | 'list'; 
  onClick: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onRename: () => void;
  onTrash: () => void;
  onView: () => void;
  onOpen: () => void;
}) {
  const docCount = caseItem._count?.documents ?? caseItem.documents?.length ?? 0;
  const draftCount = caseItem._count?.drafts ?? caseItem.drafts?.length ?? 0;
  const subtitle = caseItem.clientName || caseItem.description || 'Tax case';

  const renderMenu = () => {
    if (!menuOpen) return null;
    return (
      <>
        <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); onToggleMenu(); }} />
        <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-xl shadow-lg border border-border-default py-1 z-30" onClick={(e) => e.stopPropagation()}>
          <button onClick={onView} className="w-full text-left px-4 py-2 text-sm text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors">
            <Eye className="w-4 h-4" /> View Details
          </button>
          <button onClick={onOpen} className="w-full text-left px-4 py-2 text-sm text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors">
            <ExternalLink className="w-4 h-4" /> Open Editor
          </button>
          <button onClick={onRename} className="w-full text-left px-4 py-2 text-sm text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors">
            <Pencil className="w-4 h-4" /> Rename
          </button>
          <div className="h-px bg-border-subtle my-1"></div>
          <button onClick={onTrash} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </>
    );
  };

  if (viewMode === 'list') {
    return (
      <div className="relative group/card">
        <button
          onClick={onClick}
          className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-border-default hover:border-primary/30 hover:shadow-sm transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-text-heading truncate pr-8">{caseItem.title}</h4>
            <p className="text-sm text-text-sub truncate pr-8">{subtitle}</p>
            <p className="text-xs text-text-light mt-0.5">Edited {timeAgo(caseItem.updatedAt)}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-light pr-8">
            <span>{docCount} docs</span>
            <span>{draftCount} drafts</span>
          </div>
        </button>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
            className={`p-1.5 rounded-lg text-text-sub hover:bg-background-light transition-colors ${menuOpen ? 'bg-background-light' : 'opacity-0 group-hover/card:opacity-100'}`}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {renderMenu()}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/card">
      <button
        onClick={onClick}
        className="w-full text-left bg-white rounded-xl border border-border-default hover:border-primary/30 hover:shadow-md transition-all p-5 min-h-[180px] flex flex-col"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover/card:bg-primary/20 transition-colors">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
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
      <div className="absolute right-3 top-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
          className={`p-1.5 rounded-lg text-text-sub hover:bg-background-light transition-colors ${menuOpen ? 'bg-background-light' : 'opacity-0 group-hover/card:opacity-100'}`}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        {renderMenu()}
      </div>
    </div>
  );
}
