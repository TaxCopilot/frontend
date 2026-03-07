"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
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
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; time: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(320);
  const [activeAiTab, setActiveAiTab] = useState<'chat' | 'analysis'>('chat');

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { id: Date.now().toString(), text, time }]);
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = panelWidth;
    const onMove = (mv: MouseEvent) => {
      const delta = startX - mv.clientX;
      const next = Math.min(520, Math.max(240, startWidth + delta));
      setPanelWidth(next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Schedule an auto-save 5 s after the last edit
  const scheduleAutoSave = useCallback(() => {
    setIsDirty(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      handleSaveRef.current?.();
    }, 5000);
  }, []);

  // Keep a stable ref to handleSave so scheduleAutoSave closure stays fresh
  const handleSaveRef = useRef<(() => void) | null>(null);

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
    onUpdate: () => {
      scheduleAutoSave();
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

  // Auto-save logic
  const handleSave = useCallback(async () => {
    if (!draftId || !editor) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setSaving(true);
    try {
      const html = editor.getHTML();
      await updateContent(draftId, html);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsDirty(false);
    } catch {
      /* fail silently */
    } finally {
      setSaving(false);
    }
  }, [draftId, editor, updateContent]);

  // Keep handleSaveRef in sync
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  // Clear auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  // PDF upload handler
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    try {
      const result = await documentService.upload(file);
      if (result.extractedHtml) {
        editor.commands.setContent(
          editor.getHTML() + '<hr>' + '<p><strong>📄 Extracted from: ' + result.filename + '</strong></p>' + result.extractedHtml
        );
      }
    } catch {
      /* fail silently */
    } finally {
      setUploading(false);
      e.target.value = '';
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
                {/* Auto-save status indicator */}
                {saving ? (
                  <span className="flex items-center gap-1 text-xs text-text-light">
                    <Loader2 className="w-3 h-3 animate-spin" /> Saving…
                  </span>
                ) : isDirty ? (
                  <span className="text-xs text-amber-500">Unsaved changes</span>
                ) : lastSaved ? (
                  <span className="text-xs text-text-light">Saved {lastSaved}</span>
                ) : null}
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

        {/* Drag handle */}
        <div
          onMouseDown={startDrag}
          className="hidden xl:flex w-1.5 flex-shrink-0 cursor-col-resize group items-center justify-center hover:bg-primary/10 transition-colors"
          title="Drag to resize"
        >
          <div className="w-0.5 h-8 rounded-full bg-border-default group-hover:bg-primary/40 transition-colors" />
        </div>

        {/* Right Sidebar - AI Panel */}
        <div style={{ width: panelWidth }} className="bg-surface-light border-l border-border-subtle hidden xl:flex flex-col flex-shrink-0">
          {/* Panel header */}
          <div className="px-3 py-2.5 border-b border-border-subtle flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="font-semibold text-text-heading text-[12.5px]">AI Writing Assistant</h3>
          </div>

          {/* Tabs: chat | analysis */}
          <div className="flex border-b border-border-subtle flex-shrink-0">
            {(['chat', 'analysis'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAiTab(tab)}
                className={`flex-1 py-2.5 text-[12px] font-medium transition-all border-b-2 capitalize ${activeAiTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-light hover:text-text-sub'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Fact check buttons */}
          <div className="flex gap-2 p-3 border-b border-border-subtle flex-shrink-0">
            <button className="flex-1 py-2 text-[11px] font-medium border border-border-default rounded-lg hover:bg-primary/5 text-text-sub hover:text-primary transition-colors">
              Fact Check
            </button>
            <button className="flex-1 py-2 text-[11px] font-medium border border-border-default rounded-lg hover:bg-primary/5 text-text-sub hover:text-primary transition-colors">
              Fact Check
            </button>
          </div>

          {/* Tab content */}
          {activeAiTab === 'chat' ? (
            /* ── AI CHAT ── */
            <>
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-[12px] text-text-light leading-relaxed max-w-[180px]">
                      Ask the AI anything about your document
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-text-light">{msg.time}</span>
                        <span className="text-[11px] font-semibold text-text-sub">You</span>
                      </div>
                      <div className="bg-primary text-white text-[12.5px] leading-relaxed px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[90%] text-right">
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Chat input */}
              <div className="p-3 border-t border-border-subtle flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder="Ask AI anything..."
                    className="w-full bg-background-light border border-border-default rounded-xl py-2.5 pl-3 pr-10 text-[12.5px] text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ── ANALYSIS ── */
            <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
              {/* Horizontal action tab bar */}
              <div className="border-b border-border-subtle">
                <div className="flex overflow-x-auto hover-scrollbar">
                  {([
                    { icon: Languages, label: 'Translate' },
                    { icon: Wand2, label: 'Improve' },
                    { icon: Type, label: 'Simplify' },
                    { icon: GraduationCap, label: 'Make Formal' },
                    { icon: BookCheck, label: 'Citations' },
                    { icon: RotateCcw, label: 'Rewrite' },
                  ] as const).map(({ icon: Icon, label }, i) => {
                    const active = i === 0;
                    return (
                      <button
                        key={label}
                        className={`flex items-center gap-1 px-2.5 py-2 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${active
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-text-light hover:text-text-sub hover:border-border-default'
                          }`}
                      >
                        <Icon className="w-[11px] h-[11px]" strokeWidth={active ? 2.2 : 1.8} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
