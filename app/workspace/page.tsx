"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, FileText, Scale, MoreVertical, LayoutGrid, List, Filter, ArrowUpDown, X, Loader2, FileType, Gavel, ScrollText, Upload, AlertTriangle, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useDrafts } from '@/hooks/useDrafts';
import { useAuthStore } from '@/stores/authStore';
import { useDraftStore } from '@/stores/draftStore';
import { documentService } from '@/services/documentService';

const TEMPLATE_ICONS: Record<string, typeof FileText> = {
  scn_reply: AlertTriangle,
  appeal_memorandum: Gavel,
  legal_opinion: ScrollText,
  general: FileType,
};

const TEMPLATE_COLORS: Record<string, string> = {
  scn_reply: 'bg-red-soft text-red-text',
  appeal_memorandum: 'bg-blue-soft text-blue-text',
  legal_opinion: 'bg-purple-soft text-purple-text',
  general: 'bg-teal-soft text-teal-text',
};

export default function WorkspacePage() {
  const { drafts, templates, loadTemplates, createDraft, isLoading } = useDrafts();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  // Step 2 form state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null); // null = blank
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAuthor, setDraftAuthor] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);

  // Draft Context Menu State
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('GENERAL');

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setDropdownOpenId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (showTemplateModal) {
      loadTemplates();
    }
  }, [showTemplateModal, loadTemplates]);

  const openStep2 = (templateId: string | null) => {
    setSelectedTemplate(templateId);
    setDraftTitle('');
    setDraftAuthor(user?.name || '');
    setDraftDescription('');
    setPdfFile(null);
    setModalStep(2);
  };

  const closeModal = () => {
    setShowTemplateModal(false);
    setModalStep(1);
    setSelectedTemplate(null);
  };

  const handleCreate = async () => {
    if (!draftTitle.trim()) return;
    setCreating(true);
    try {
      // If PDF is attached, upload and extract text first
      let pdfContent: string | undefined;
      if (pdfFile) {
        setPdfUploading(true);
        const uploadResult = await documentService.upload(pdfFile);
        if (uploadResult.extractedHtml) {
          pdfContent = uploadResult.extractedHtml;
        }
        setPdfUploading(false);
      }

      const draft = await createDraft({
        title: draftTitle.trim(),
        templateId: selectedTemplate || undefined,
        content: pdfContent,
      });
      closeModal();
      router.push(`/workspace/editor?id=${draft.id}`);
    } catch {
      setCreating(false);
      setPdfUploading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingDraft) return;
    try {
      await useDraftStore.getState().updateMetadata(editingDraft.id, {
        title: editTitle,
        category: editCategory,
      });
      setShowEditModal(false);
      setEditingDraft(null);
    } catch (error) {
      console.error('Failed to update draft:', error);
    }
  };

  const handleTrash = async (id: string) => {
    try {
      await useDraftStore.getState().trashDraft(id);
      setDropdownOpenId(null);
    } catch (error) {
      console.error('Failed to trash draft:', error);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <>
      <Header title="Workspace" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 pt-8 scrollbar-thin">

        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-aqua-tint to-surface-light border border-border-subtle rounded-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-secondary/20 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">AI Agent</span>
            </div>
            <h2 className="text-3xl font-serif text-text-heading mb-3 tracking-tight">Good morning, {firstName}.</h2>
            <p className="text-text-sub mb-8 leading-relaxed max-w-lg font-light">
              Your AI agent is ready. Upload a tax notice to analyze root causes, cross-reference laws, and draft response strategies instantly.
            </p>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-secondary hover:bg-secondary-hover text-text-heading px-6 py-3.5 rounded-xl text-sm font-semibold shadow-float transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2.5"
            >
              <Plus className="w-5 h-5" />
              Create New Draft
            </button>
          </div>
          <div className="hidden md:flex relative z-10 items-center justify-center pr-12 gap-6 opacity-80">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-surface-light rounded-xl shadow-card flex items-center justify-center text-primary/80">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="w-12 h-12 bg-surface-light rounded-xl shadow-card flex items-center justify-center text-primary/80">
                <FileText className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-surface-light rounded-xl shadow-card flex items-center justify-center text-secondary">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* File Library Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-medium text-text-heading flex items-center gap-2">
            My Drafts
            <span className="text-xs bg-background-light text-text-light border border-border-subtle px-2 py-0.5 rounded-full font-normal">{drafts.length}</span>
          </h3>
          <div className="flex gap-3">
            <div className="flex bg-background-light rounded-lg p-1 border border-border-subtle">
              <button className="p-1.5 px-2.5 text-primary bg-surface-light rounded shadow-sm">
                <LayoutGrid className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 px-2.5 text-text-light hover:text-text-sub transition-colors">
                <List className="w-[18px] h-[18px]" />
              </button>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-text-sub hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-background-light">
              <Filter className="w-[18px] h-[18px]" />
              Filter
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-text-sub hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-background-light">
              <ArrowUpDown className="w-[18px] h-[18px]" />
              Sort by
            </button>
          </div>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* New Draft Card */}
          <button onClick={() => setShowTemplateModal(true)} className="group border border-dashed border-border-default rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all h-56">
            <div className="w-12 h-12 rounded-full bg-background-light group-hover:bg-surface-light flex items-center justify-center transition-colors shadow-sm">
              <Plus className="w-6 h-6 text-text-light group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium text-text-sub group-hover:text-primary transition-colors">New Draft</span>
          </button>

          {/* Draft Cards from API */}
          {isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : drafts.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-text-sub">
              <FileText className="w-10 h-10 mb-3 text-text-light" />
              <p className="text-sm">No drafts yet. Create your first draft to get started.</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div key={draft.id} className="relative bg-surface-light rounded-xl shadow-card hover:shadow-card-hover transition-all group h-56 flex flex-col border border-transparent hover:border-primary/20">
                
                {/* Background Link */}
                <Link 
                  href={`/workspace/editor?id=${draft.id}`} 
                  className="absolute inset-0 z-0 rounded-xl"
                  title="Open draft"
                >
                  <span className="sr-only">Open draft</span>
                </Link>
                
                {/* Three-Dot Menu (Higher z-index) */}
                <div className="absolute top-4 right-4 z-20">
                  <div className={`transition-opacity ${dropdownOpenId === draft.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Delay state update slightly to prevent document listener from immediately closing it
                        setTimeout(() => {
                           setDropdownOpenId(dropdownOpenId === draft.id ? null : draft.id);
                        }, 0);
                      }}
                      className="text-text-light hover:text-text-sub p-1.5 rounded-lg bg-background-light hover:bg-border-subtle/50 transition-colors shadow-sm relative z-50"
                    >
                      <MoreVertical className="w-5 h-5 pointer-events-none" />
                    </button>
                    
                    {dropdownOpenId === draft.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-surface-light border border-border-default rounded-xl shadow-lg py-1 z-[100]">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingDraft(draft);
                            setEditTitle(draft.title);
                            setEditCategory(draft.category);
                            setShowEditModal(true);
                            setDropdownOpenId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-text-sub hover:bg-background-light hover:text-primary flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4 pointer-events-none" /> Edit Details
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTrash(draft.id);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4 pointer-events-none" /> Move to Trash
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content (Foreground) */}
                <div className="relative z-10 p-5 flex-1 flex flex-col justify-between pointer-events-none">
                  <div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${getCategoryColor(draft.category)}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-text-heading text-base mb-1 line-clamp-2 leading-tight">{draft.title}</h4>
                    <p className="text-xs text-text-light mt-1">{draft.case?.clientName || draft.category.replace('_', ' ')}</p>
                  </div>
                  
                  <div className="border-t border-border-subtle pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-text-light font-medium uppercase tracking-wide">{timeAgo(draft.updatedAt)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusBadge(draft.status)}`}>{draft.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-surface-light rounded-2xl shadow-2xl border border-border-subtle w-full max-w-xl mx-4 relative" onClick={(e) => e.stopPropagation()}>

            {modalStep === 1 ? (
              <>
                {/* Step 1: Choose template */}
                <div className="flex items-center justify-between p-6 border-b border-border-subtle">
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading">Choose a Template</h3>
                    <p className="text-sm text-text-sub mt-1">Select a template to start your draft, or create a blank one.</p>
                  </div>
                  <button onClick={closeModal} className="p-2 rounded-lg hover:bg-background-light text-text-light hover:text-text-sub transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-3">
                  <button onClick={() => openStep2(null)} className="w-full flex items-center gap-4 p-4 rounded-xl border border-dashed border-border-default hover:border-primary hover:bg-primary/5 transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-background-light group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Plus className="w-5 h-5 text-text-light group-hover:text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-heading group-hover:text-primary transition-colors">Blank Draft</h4>
                      <p className="text-xs text-text-light mt-0.5">Start from scratch</p>
                    </div>
                  </button>
                  {templates.map((t) => {
                    const Icon = TEMPLATE_ICONS[t.id] || FileText;
                    const colorClass = TEMPLATE_COLORS[t.id] || 'bg-teal-soft text-teal-text';
                    return (
                      <button key={t.id} onClick={() => openStep2(t.id)} className="w-full flex items-center gap-4 p-4 rounded-xl border border-border-default hover:border-primary hover:bg-primary/5 transition-all text-left group">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-text-heading group-hover:text-primary transition-colors">{t.title}</h4>
                          <p className="text-xs text-text-light mt-0.5">{t.category.replace('_', ' ')}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {/* Step 2: Fill in details */}
                <div className="flex items-center justify-between p-6 border-b border-border-subtle">
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading">Draft Details</h3>
                    <p className="text-sm text-text-sub mt-1">
                      {selectedTemplate
                        ? `Using: ${templates.find(t => t.id === selectedTemplate)?.title || 'Template'}`
                        : 'Creating a blank draft'}
                    </p>
                  </div>
                  <button onClick={closeModal} className="p-2 rounded-lg hover:bg-background-light text-text-light hover:text-text-sub transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1.5" htmlFor="draft-title">Title <span className="text-red-400">*</span></label>
                    <input
                      id="draft-title"
                      type="text"
                      placeholder="e.g. Reply to GST Notice for ABC Traders"
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1.5" htmlFor="draft-author">Author</label>
                    <input
                      id="draft-author"
                      type="text"
                      placeholder="Your name or firm name"
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
                      value={draftAuthor}
                      onChange={(e) => setDraftAuthor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1.5" htmlFor="draft-desc">Description <span className="text-text-light font-normal">(optional)</span></label>
                    <textarea
                      id="draft-desc"
                      rows={3}
                      placeholder="Brief context about this draft..."
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all resize-none"
                      value={draftDescription}
                      onChange={(e) => setDraftDescription(e.target.value)}
                    />
                  </div>

                  {/* PDF Upload (optional) */}
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1.5">
                      Attach PDF <span className="text-text-light font-normal">(optional — text will be extracted)</span>
                    </label>
                    {pdfFile ? (
                      <div className="flex items-center gap-3 p-3 border border-primary/30 bg-primary/5 rounded-xl">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm text-text-heading flex-1 truncate">{pdfFile.name}</span>
                        <button onClick={() => setPdfFile(null)} className="text-text-light hover:text-red-500 transition-colors p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 p-4 border border-dashed border-border-default rounded-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                        <Upload className="w-5 h-5 text-text-light group-hover:text-primary" />
                        <span className="text-xs text-text-light group-hover:text-primary">Click to upload PDF</span>
                        <input type="file" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) setPdfFile(e.target.files[0]); e.target.value = ''; }} className="hidden" />
                      </label>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setModalStep(1)} className="flex-1 px-4 py-2.5 border border-border-default rounded-xl text-sm font-medium text-text-sub hover:bg-background-light transition-colors">
                      Back
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={creating || !draftTitle.trim()}
                      className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Draft'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {creating && (
              <div className="absolute inset-0 bg-surface-light/80 rounded-2xl flex items-center justify-center z-10">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-text-sub">Creating draft...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Helpers
function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    SCN_REPLY: 'bg-red-soft text-red-text',
    APPEAL_MEMORANDUM: 'bg-blue-soft text-blue-text',
    LEGAL_OPINION: 'bg-purple-soft text-purple-text',
    GENERAL: 'bg-teal-soft text-teal-text',
  };
  return map[category] || 'bg-teal-soft text-teal-text';
}

function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'bg-background-light text-text-sub border-border-subtle',
    IN_REVIEW: 'bg-blue-soft text-blue-text border-blue-text/20',
    APPROVED: 'bg-green-soft text-green-text border-green-text/20',
    EXPORTED: 'bg-purple-soft text-purple-text border-purple-text/20',
  };
  return map[status] || 'bg-background-light text-text-sub border-border-subtle';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
