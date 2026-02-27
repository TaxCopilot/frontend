"use client";

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Save, Download, Sparkles, Bot, Languages, Wand2, Type, GraduationCap, BookCheck, RotateCcw, ChevronRight, Send, Upload, FileText, Loader2 } from 'lucide-react';
import { useDraftStore } from '@/stores/draftStore';
import { draftService } from '@/services/draftService';
import { documentService } from '@/services/documentService';
import { Suspense } from 'react';

function EditorPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const draftId = searchParams.get('id');
  const { currentDraft, loadDraft, updateContent, setCurrentDraft } = useDraftStore();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '<p>Loading...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-3xl mx-auto font-serif text-text-heading leading-relaxed focus:outline-none min-h-[60vh] p-12',
      },
    },
  });

  // Load draft content
  useEffect(() => {
    if (draftId) {
      loadDraft(draftId);
    }
  }, [draftId, loadDraft]);

  // Set editor content when draft loads
  useEffect(() => {
    if (currentDraft && editor) {
      editor.commands.setContent(currentDraft.content || '<p>Start writing...</p>');
    }
  }, [currentDraft, editor]);

  // Clean up on unmount
  useEffect(() => {
    return () => setCurrentDraft(null);
  }, [setCurrentDraft]);

  // Auto-save with debounce
  const handleSave = useCallback(async () => {
    if (!draftId || !editor) return;
    setSaving(true);
    try {
      const html = editor.getHTML();
      await updateContent(draftId, html);
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      /* fail silently */
    } finally {
      setSaving(false);
    }
  }, [draftId, editor, updateContent]);

  // PDF upload handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    try {
      const result = await documentService.upload(file);
      if (result.extractedHtml) {
        // Append extracted content to editor
        editor.commands.setContent(
          editor.getHTML() + '<hr>' + '<p><strong>📄 Extracted from: ' + result.filename + '</strong></p>' + result.extractedHtml
        );
      }
    } catch {
      /* fail silently */
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      <Header title="Document Editor" subtitle={currentDraft?.title || 'Loading...'} />

      <div className="flex-1 flex overflow-hidden bg-background-light">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <div className="bg-surface-light border border-border-default rounded-2xl shadow-card flex flex-col h-full overflow-hidden">

            {/* Toolbar */}
            <div className="border-b border-border-subtle p-3 flex items-center justify-between bg-background-light/50">
              <div className="flex items-center gap-1">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Bold className="w-4 h-4" /></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Italic className="w-4 h-4" /></button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><UnderlineIcon className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-border-default mx-2" />
                <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><AlignLeft className="w-4 h-4" /></button>
                <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><AlignCenter className="w-4 h-4" /></button>
                <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><AlignRight className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-border-default mx-2" />
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><List className="w-4 h-4" /></button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><ListOrdered className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-border-default mx-2" />
                {/* PDF Upload */}
                <label className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors cursor-pointer relative">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <input type="file" accept=".pdf" onChange={handlePdfUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </label>
              </div>
              <div className="flex items-center gap-2">
                {lastSaved && <span className="text-xs text-text-light">Saved {lastSaved}</span>}
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-sub bg-surface-light border border-border-default rounded-lg hover:bg-background-light transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface-light bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>

            {/* TipTap Editor */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Panel */}
        <div className="w-80 bg-surface-light border-l border-border-subtle hidden xl:flex flex-col">
          <div className="p-4 border-b border-border-subtle flex items-center gap-2 bg-background-light/50">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text-heading text-sm">AI Writing Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
            {/* Analysis Card */}
            <div className="bg-active-bg border border-primary/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Draft Analysis</span>
              </div>
              <p className="text-sm text-text-sub leading-relaxed">
                Select text and use AI actions to get suggestions and improvements.
              </p>
            </div>

            {/* AI Actions Grid */}
            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">AI Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Languages, label: 'Translate' },
                  { icon: Wand2, label: 'Improve' },
                  { icon: Type, label: 'Simplify' },
                  { icon: GraduationCap, label: 'Make Formal' },
                  { icon: BookCheck, label: 'Check Citations' },
                  { icon: RotateCcw, label: 'Rewrite' },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Suggestions</h4>
              <ul className="space-y-2.5">
                {[
                  { title: 'Attach Medical Certificate', desc: 'Add: "A copy of the medical certificate is enclosed herewith for your reference."' },
                  { title: 'Cite Payment Challans', desc: 'Mention the specific ARN or Challan numbers for the late fees paid.' },
                  { title: 'Add Compliance History', desc: 'Mention prior tax compliance record to strengthen the case.' },
                ].map((s) => (
                  <li key={s.title} className="text-sm text-text-sub bg-surface-light border border-border-default p-3 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-medium block mb-1 text-text-heading group-hover:text-primary transition-colors">{s.title}</span>
                        <span className="text-[13px]">{s.desc}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-light group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Input */}
          <div className="p-4 border-t border-border-subtle bg-background-light/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI to rewrite or suggest..."
                className="w-full bg-surface-light border border-border-default rounded-xl py-2.5 pl-3 pr-10 text-sm text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <EditorPageInner />
    </Suspense>
  );
}
