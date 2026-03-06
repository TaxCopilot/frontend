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
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; text: string; time: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(320);

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
          <div className="px-3 py-2.5 border-b border-border-subtle flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="font-semibold text-text-heading text-[12.5px]">AI Writing Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
            {/* Analysis Card */}
            <div className="bg-active-bg border border-primary/10 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
                <span className="text-[12px] font-semibold text-primary">Draft Analysis</span>
              </div>
              <p className="text-[11.5px] text-text-sub leading-snug">
                Select text and use AI actions to get suggestions and improvements.
              </p>
            </div>

            {/* AI Actions — tab bar style */}
            {(() => {
              const actions = [
                { icon: Languages, label: 'Translate' },
                { icon: Wand2, label: 'Improve' },
                { icon: Type, label: 'Simplify' },
                { icon: GraduationCap, label: 'Make Formal' },
                { icon: BookCheck, label: 'Citations' },
                { icon: RotateCcw, label: 'Rewrite' },
              ];
              return (
                <div className="border-b border-border-subtle">
                  <div className="flex overflow-x-auto hover-scrollbar">
                    {actions.map(({ icon: Icon, label }, i) => {
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
              );
            })()}

            {/* Suggestions */}
            <div>
              <h4 className="text-[9.5px] font-bold text-text-light uppercase tracking-wider mb-2">Suggestions</h4>
              <ul className="space-y-1.5">
                {[
                  { title: 'Attach Medical Certificate', desc: 'Add: "A copy of the medical certificate is enclosed herewith for your reference."' },
                  { title: 'Cite Payment Challans', desc: 'Mention the specific ARN or Challan numbers for the late fees paid.' },
                  { title: 'Add Compliance History', desc: 'Mention prior tax compliance record to strengthen the case.' },
                ].map((s) => (
                  <li key={s.title} className="text-text-sub bg-surface-light border border-border-default p-2.5 rounded-lg hover:border-primary transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11.5px] font-medium block mb-0.5 text-text-heading group-hover:text-primary transition-colors">{s.title}</span>
                        <span className="text-[11px] leading-snug">{s.desc}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-text-light group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Messages */}
          {chatMessages.length > 0 && (
            <div className="px-4 pt-3 pb-1 border-t border-border-subtle space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-text-light">{msg.time}</span>
                    <span className="text-[11px] font-semibold text-text-sub">You</span>
                  </div>
                  <div className="bg-primary text-white text-[12.5px] leading-relaxed px-3.5 py-2 rounded-2xl rounded-tr-sm max-w-[90%] text-right">
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* AI Input */}
          <div className="p-4 border-t border-border-subtle bg-background-light/50">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Ask AI to rewrite or suggest..."
                className="w-full bg-surface-light border border-border-default rounded-xl py-2.5 pl-3 pr-10 text-sm text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                onClick={sendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
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
