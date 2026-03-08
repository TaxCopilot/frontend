"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { PaginationPlus } from 'tiptap-pagination-plus';
import { Loader2 } from 'lucide-react';
import { useDraftStore } from '@/stores/draftStore';
import { documentService } from '@/services/documentService';

import { EditorComponent } from '@/components/workspace/EditorComponent';
import { EditorSidebar } from '@/components/workspace/EditorSidebar';

function EditorPageInner() {
  const searchParams = useSearchParams();
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
  }, [draftId, useDraftStore, updateContent]);

  const scheduleAutoSave = useCallback(() => {
    setIsDirty(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 5000);
  }, [handleSave]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      PaginationPlus.configure({
        pageHeight: 1123, pageWidth: 794, pageGap: 24, pageGapBorderSize: 1, 
        pageGapBorderColor: "#e6e4dc", pageBreakBackground: "transparent",
        marginTop: 48, marginBottom: 48, marginLeft: 48, marginRight: 48,
        contentMarginTop: 10, contentMarginBottom: 10,
      }),
    ],
    content: '<p>Loading...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-p:mb-4 prose-p:leading-relaxed prose-headings:mt-6 prose-headings:mb-3 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl font-sans text-text-heading focus:outline-none min-h-[60vh] mx-auto',
      },
    },
    onUpdate: () => {
      scheduleAutoSave();
    },
  });

  useEffect(() => {
    if (draftId) loadDraft(draftId);
  }, [draftId, loadDraft]);

  useEffect(() => {
    if (currentDraft && editor) {
      let rawContent = currentDraft.content || '<p>Start writing...</p>';
      if (rawContent !== '<p>Start writing...</p>' && !/<[a-z][\s\S]*>/i.test(rawContent)) {
        rawContent = rawContent.split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
      }
      editor.commands.setContent(rawContent);
    }
  }, [currentDraft, editor]);

  useEffect(() => {
    return () => setCurrentDraft(null);
  }, [setCurrentDraft]);

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

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex overflow-hidden bg-background-light">
        <EditorComponent 
          editor={editor}
          saving={saving}
          isDirty={isDirty}
          lastSaved={lastSaved}
          handleSave={handleSave}
          uploading={uploading}
          handlePdfUpload={handlePdfUpload}
        />
        <EditorSidebar 
          panelWidth={panelWidth}
          startDrag={startDrag}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendMessage={sendMessage}
          chatEndRef={chatEndRef}
        />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <EditorPageInner />
 suspension: Suspense   </Suspense>
  );
}
