"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FontSizeExtension } from '@/lib/extensions/FontSizeExtension';
import Highlight from '@tiptap/extension-highlight';
import { PaginationPlus } from 'tiptap-pagination-plus';
import { Loader2 } from 'lucide-react';
import { useDraftStore } from '@/stores/draftStore';
import { documentService } from '@/services/documentService';
import html2pdf from 'html2pdf.js';

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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      FontFamily,
      FontSizeExtension,
      Color,
      Highlight.configure({ multicolor: true }),
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
        class: 'focus:outline-none min-h-[60vh] mx-auto text-text-heading',
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!draftId || !editor) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setSaving(true);
    try {
      const html = editor.getHTML();
      await updateContent(draftId, html);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  }, [draftId, editor, updateContent]);

  const scheduleAutoSave = useCallback(() => {
    setIsDirty(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 5000);
  }, [handleSave]);

  useEffect(() => {
    if (!editor) return;
    const onUpdate = () => scheduleAutoSave();
    editor.on('update', onUpdate);
    return () => {
      editor.off('update', onUpdate);
    };
  }, [editor, scheduleAutoSave]);

  const exportPdf = () => {
    if (!editor) return;
    const element = document.createElement('div');
    element.innerHTML = `
      <style>
        .pdf-wrap { font-family: ui-sans-serif, sans-serif; font-size: 14px; line-height: 1.5; color: #1a1a1a; padding: 40px; }
        .pdf-wrap p { margin-bottom: 12px; line-height: 1.5; }
        .pdf-wrap h1 { font-size: 28px; font-weight: 700; line-height: 1.2; color: #111827; margin-top: 24px; margin-bottom: 12px; letter-spacing: -0.5px; }
        .pdf-wrap h2 { font-size: 24px; font-weight: 600; line-height: 1.25; color: #1f2937; margin-top: 20px; margin-bottom: 10px; letter-spacing: -0.3px; }
        .pdf-wrap h3 { font-size: 20px; font-weight: 600; line-height: 1.3; color: #374151; margin-top: 16px; margin-bottom: 8px; }
        .pdf-wrap ul { list-style-type: disc; padding-left: 1.6em; margin: 4px 0 10px; }
        .pdf-wrap ol { list-style-type: decimal; padding-left: 1.6em; margin: 4px 0 10px; }
        .pdf-wrap li { margin: 3px 0; line-height: 1.5; }
        .pdf-wrap blockquote { border-left: 3px solid #d1d5db; padding-left: 1em; color: #6b7280; font-style: italic; margin: 10px 0; }
        .pdf-wrap code { background: #f3f4f6; border-radius: 3px; padding: 1px 4px; font-family: monospace; font-size: 0.9em; }
      </style>
      <div class="pdf-wrap">
        ${editor.getHTML()}
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `${currentDraft?.title || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    if (draftId) loadDraft(draftId);
  }, [draftId, loadDraft]);

  useEffect(() => {
    if (currentDraft && editor) {
      let rawContent = currentDraft.content || '';
      if (rawContent !== '' && !/<[a-z][\s\S]*>/i.test(rawContent)) {
        rawContent = rawContent.split(/\n\s*\n/).map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
      } else if (rawContent === '') {
        rawContent = '<p>Start writing...</p>';
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
          editor.getHTML() + '<hr>' + result.extractedHtml
        );
      }
    } catch (err) {
      console.error('Upload failed:', err);
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
          exportPdf={exportPdf}
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
    </Suspense>
  );
}
