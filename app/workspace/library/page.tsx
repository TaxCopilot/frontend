"use client";

import { useState, useEffect } from 'react';
import { Loader2, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/useCases';
import { caseService, Case, CaseDocument } from '@/services/caseService';
import { documentService } from '@/services/documentService';
import { CreateCaseModal } from '@/components/CreateCaseModal';

import { LibraryHeader } from '@/components/workspace/LibraryHeader';
import { CaseCard } from '@/components/workspace/CaseCard';
import { LibraryCaseDetail } from '@/components/workspace/LibraryCaseDetail';

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

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameCase, setRenameCase] = useState<Case | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [deleteCase, setDeleteCase] = useState<Case | null>(null);

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

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-12 py-6 md:py-10 scrollbar-thin bg-[#FAF9F5]">
        <div className="max-w-5xl mx-auto">
          {!selectedCase ? (
            <div className="flex flex-col gap-6">
              <LibraryHeader 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDropdownOpen={sortDropdownOpen}
                setSortDropdownOpen={setSortDropdownOpen}
                onNewCase={() => setShowCreateModal(true)}
              />

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
                    <CaseCard 
                      key={c.id} 
                      caseItem={c} 
                      onClick={() => setSelectedCase(c)}
                      menuOpen={menuOpenId === c.id}
                      onToggleMenu={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)}
                      onRename={() => { setRenameCase(c); setRenameInput(c.title); setMenuOpenId(null); }}
                      onTrash={() => { setDeleteCase(c); setMenuOpenId(null); }}
                      onView={() => { setSelectedCase(c); setMenuOpenId(null); }}
                      onOpen={() => { router.push(`/workspace/case/${c.id}`); setMenuOpenId(null); }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {loadingDetail || !caseDetail ? (
                <div className="flex items-center justify-center py-20 mt-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <LibraryCaseDetail 
                  caseDetail={caseDetail}
                  onBack={() => setSelectedCase(null)}
                  onOpenCase={() => router.push(`/workspace/case/${selectedCase?.id}`)}
                  onDownload={handleDownload}
                  downloading={downloading}
                  onOpenDraft={(id) => router.push(`/workspace/editor?id=${id}`)}
                />
              )}
            </>
          )}
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
                    if (selectedCase?.id === renameCase.id) {
                      setCaseDetail(prev => prev ? { ...prev, title: renameInput.trim() } : null);
                    }
                    setRenameCase(null);
                  } catch(err) { console.error(err); }
                }
                if (e.key === 'Escape') setRenameCase(null);
              }}
              className="w-full bg-background-light border border-border-default rounded-xl py-2 px-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-4"
              placeholder="Case Name"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenameCase(null)} className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors">Cancel</button>
              <button
                onClick={async () => {
                  if (!renameInput.trim()) return;
                  try {
                    await caseService.update(renameCase.id, { title: renameInput.trim() });
                    await fetchCases();
                    if (selectedCase?.id === renameCase.id) {
                      setCaseDetail(prev => prev ? { ...prev, title: renameInput.trim() } : null);
                    }
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
              <button onClick={() => setDeleteCase(null)} className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await caseService.delete(deleteCase.id);
                    await fetchCases();
                    if (selectedCase?.id === deleteCase.id) setSelectedCase(null);
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
