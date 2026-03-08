'use client';

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Save, Download, Loader2,
  Heading1, Heading2, Heading3,
  Undo, Redo, PaintBucket, Paintbrush,
  ChevronDown, Minus, Plus, Type,
} from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { EditorContent, useEditorState } from '@tiptap/react';

interface EditorComponentProps {
  editor: any;
  saving: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  handleSave: () => void;
  exportPdf: () => void;
}

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

// PaginationPlus scales the page via CSS transform. This multiplier compensates
// so toolbar pt-like numbers (11,14…) map to visually correct on-screen sizes.
const FONT_SCALE = 1;

const FONT_FAMILIES = [
  { label: 'Default', value: '' },
  { label: 'Sans Serif', value: 'ui-sans-serif, sans-serif' },
  { label: 'Serif', value: 'ui-serif, Georgia, serif' },
  { label: 'Monospace', value: 'ui-monospace, monospace' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
];

const TEXT_COLORS = [
  { label: 'Default', value: '#1a1a1a' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Green', value: '#10B981' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Indigo', value: '#6366F1' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Brown', value: '#92400E' },
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: 'none' },
  { label: 'Yellow', value: '#FEF08A' },
  { label: 'Green', value: '#BBF7D0' },
  { label: 'Blue', value: '#BFDBFE' },
  { label: 'Purple', value: '#DDD6FE' },
  { label: 'Pink', value: '#FECDD3' },
  { label: 'Orange', value: '#FED7AA' },
];

/** Close dropdown when clicking outside */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

/** Toolbar button — active/disabled driven by props only (no inline editor.isActive calls) */
function TBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title?: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button" title={title} disabled={disabled} onClick={onClick}
      className={`p-1.5 rounded-lg transition-all disabled:opacity-30 flex-shrink-0 ${
        active ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'text-text-sub hover:bg-border-subtle'
      }`}
    >
      {children}
    </button>
  );
}

/** Thin divider */
function Divider() {
  return <div className="w-px h-5 bg-border-default mx-0.5 flex-shrink-0" />;
}

/** Dropdown wrapper with click-outside-to-close */
function Dropdown({ trigger, children, open, setOpen }: {
  trigger: React.ReactNode; children: React.ReactNode;
  open: boolean; setOpen: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-border-default rounded-xl shadow-xl z-[300] overflow-hidden min-w-max">
          {children}
        </div>
      )}
    </div>
  );
}

/** Click-based color picker (no hover-flicker) */
function ColorPicker({ icon, title, colors, onSelect }: {
  icon: React.ReactNode;
  title: string;
  colors: { label: string; value: string }[];
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button type="button" title={title} onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg text-text-sub hover:bg-border-subtle transition-colors">
        {icon}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-border-default rounded-xl shadow-xl z-[300] p-3" style={{ minWidth: 186 }}>
          <p className="text-[10px] font-semibold text-text-light uppercase tracking-wide mb-2">{title}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button key={c.value} title={c.label}
                onClick={() => { onSelect(c.value); setOpen(false); }}
                className="w-7 h-7 rounded-full shadow ring-1 ring-border-default hover:scale-110 transition-transform flex items-center justify-center"
                style={{ backgroundColor: c.value === 'none' ? '#f9fafb' : c.value }}>
                {c.value === 'none' && <span className="text-red-400 font-bold text-sm leading-none">✕</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function EditorComponent({
  editor, saving, isDirty, lastSaved, handleSave, exportPdf,
}: EditorComponentProps) {
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [fontFamilyOpen, setFontFamilyOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(14);

  // ── All active formatting states — reactive via useEditorState ──
  const fmt = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor;
      if (!e) return {
        canUndo: false, canRedo: false,
        bold: false, italic: false, underline: false, strike: false, highlight: false,
        h1: false, h2: false, h3: false,
        bulletList: false, orderedList: false,
        alignLeft: false, alignCenter: false, alignRight: false,
      };
      return {
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
        bold: e.isActive('bold'),
        italic: e.isActive('italic'),
        underline: e.isActive('underline'),
        strike: e.isActive('strike'),
        highlight: e.isActive('highlight'),
        h1: e.isActive('heading', { level: 1 }),
        h2: e.isActive('heading', { level: 2 }),
        h3: e.isActive('heading', { level: 3 }),
        bulletList: e.isActive('bulletList'),
        orderedList: e.isActive('orderedList'),
        alignLeft: e.isActive({ textAlign: 'left' }),
        alignCenter: e.isActive({ textAlign: 'center' }),
        alignRight: e.isActive({ textAlign: 'right' }),
      };
    },
  }) ?? {
    canUndo: false, canRedo: false,
    bold: false, italic: false, underline: false, strike: false, highlight: false,
    h1: false, h2: false, h3: false,
    bulletList: false, orderedList: false,
    alignLeft: false, alignCenter: false, alignRight: false,
  };

  // Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  // Sync font size display with cursor position
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      // Check heading FIRST — takes priority over any inline textStyle fontSize
      if (editor.isActive('heading', { level: 1 })) { setCurrentFontSize(28); return; }
      if (editor.isActive('heading', { level: 2 })) { setCurrentFontSize(24); return; }
      if (editor.isActive('heading', { level: 3 })) { setCurrentFontSize(20); return; }
      // Only then check explicit textStyle font size
      const fs = editor.getAttributes('textStyle').fontSize;
      if (fs) {
        const n = parseInt(String(fs), 10);
        if (!isNaN(n)) { setCurrentFontSize(n); return; }
      }
      setCurrentFontSize(14); // 14px base
    };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => { editor.off('selectionUpdate', update); editor.off('transaction', update); };
  }, [editor]);

  const applyFontSize = useCallback((size: number) => {
    setCurrentFontSize(size);
    setFontSizeOpen(false);
    editor?.chain().focus().setFontSize(`${size}px`).run();
  }, [editor]);

  const applyFontFamily = useCallback((family: string) => {
    setFontFamilyOpen(false);
    if (!family) editor?.chain().focus().unsetFontFamily().run();
    else editor?.chain().focus().setFontFamily(family).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
      {/* ── ProseMirror CSS ── */}
      <style>{`
        /* Base body font — 14px standard */
        .tiptap-wrap .ProseMirror { font-size: 14px; line-height: 1.5; color: #1a1a1a; }
        .tiptap-wrap .ProseMirror:focus { outline: none; }
        .tiptap-wrap .ProseMirror p { margin-bottom: 12px; line-height: 1.5; }

        /* Headings — standard sizes */
        .tiptap-wrap .ProseMirror h1,
        .tiptap-wrap .ProseMirror h1 * { font-size: 28px !important; font-weight: 700 !important; line-height: 1.2 !important; color: #111827 !important; letter-spacing: -0.5px !important; }
        .tiptap-wrap .ProseMirror h1 { margin-top: 24px !important; margin-bottom: 12px !important; }

        .tiptap-wrap .ProseMirror h2,
        .tiptap-wrap .ProseMirror h2 * { font-size: 24px !important; font-weight: 600 !important; line-height: 1.25 !important; color: #1f2937 !important; letter-spacing: -0.3px !important; }
        .tiptap-wrap .ProseMirror h2 { margin-top: 20px !important; margin-bottom: 10px !important; }

        .tiptap-wrap .ProseMirror h3,
        .tiptap-wrap .ProseMirror h3 * { font-size: 20px !important; font-weight: 600 !important; line-height: 1.3 !important; color: #374151 !important; }
        .tiptap-wrap .ProseMirror h3 { margin-top: 16px !important; margin-bottom: 8px !important; }

        /* Lists */
        .tiptap-wrap .ProseMirror ul { list-style-type: disc !important; padding-left: 1.6em !important; margin: 4px 0 10px !important; }
        .tiptap-wrap .ProseMirror ol { list-style-type: decimal !important; padding-left: 1.6em !important; margin: 4px 0 10px !important; }
        .tiptap-wrap .ProseMirror li { display: list-item !important; margin: 3px 0 !important; line-height: 1.5 !important; }
        .tiptap-wrap .ProseMirror li > p { margin: 0 !important; }

        /* Other blocks */
        .tiptap-wrap .ProseMirror blockquote { border-left: 3px solid #d1d5db; padding-left: 1em; color: #6b7280; font-style: italic; margin: 10px 0; }
        .tiptap-wrap .ProseMirror code { background: #f3f4f6; border-radius: 3px; padding: 1px 4px; font-family: monospace; font-size: 0.9em; }

        /* Page centering: PaginationPlus renders .rm-page elements — center them */
        .tiptap-wrap [data-rm-pagination],
        .tiptap-wrap .rm-page-break { margin-left: auto !important; margin-right: auto !important; }
      `}</style>

      <div className="bg-surface-light border border-border-default rounded-2xl shadow-card flex flex-col h-full overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="border-b border-border-subtle px-3 py-2 flex flex-wrap items-center gap-1 bg-background-light/50 min-h-[50px]">

          {/* Undo / Redo */}
          <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!fmt.canUndo} title="Undo (Ctrl+Z)"><Undo className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!fmt.canRedo} title="Redo (Ctrl+Y)"><Redo className="w-4 h-4" /></TBtn>

          <Divider />

          {/* Font Family */}
          <Dropdown open={fontFamilyOpen} setOpen={setFontFamilyOpen} trigger={
            <button type="button" className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[12px] text-text-sub hover:bg-border-subtle transition-colors" title="Font Family">
              <Type className="w-3.5 h-3.5 flex-shrink-0" />
              <ChevronDown className="w-3 h-3 flex-shrink-0" />
            </button>
          }>
            {FONT_FAMILIES.map(f => (
              <button key={f.value || 'def'} onClick={() => applyFontFamily(f.value)}
                className="w-full text-left px-4 py-2 text-[13px] hover:bg-primary/5 text-text-main transition-colors block"
                style={{ fontFamily: f.value || undefined }}>
                {f.label}
              </button>
            ))}
          </Dropdown>

          {/* Font Size − / number / + */}
          <div className="flex items-center border border-border-default rounded-lg overflow-visible bg-white flex-shrink-0">
            <button type="button" title="Decrease size"
              onClick={() => applyFontSize(Math.max(8, currentFontSize - 1))}
              className="px-1.5 py-1.5 hover:bg-border-subtle transition-colors text-text-sub">
              <Minus className="w-3 h-3" />
            </button>
            <Dropdown open={fontSizeOpen} setOpen={setFontSizeOpen} trigger={
              <button type="button" title="Font Size"
                className="px-2 py-1.5 text-[12px] font-medium text-text-main min-w-[34px] text-center hover:bg-border-subtle transition-colors">
                {currentFontSize}
              </button>
            }>
              <div className="py-1 max-h-52 overflow-y-auto w-14">
                {FONT_SIZES.map(s => (
                  <button key={s} onClick={() => applyFontSize(s)}
                    className={`w-full text-center px-2 py-1.5 text-[13px] hover:bg-primary/5 transition-colors block ${currentFontSize === s ? 'text-primary font-semibold bg-primary/5' : 'text-text-main'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </Dropdown>
            <button type="button" title="Increase size"
              onClick={() => applyFontSize(Math.min(96, currentFontSize + 1))}
              className="px-1.5 py-1.5 hover:bg-border-subtle transition-colors text-text-sub">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <Divider />

          {/* Text formatting — all driven from reactive fmt state */}
          <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={fmt.bold} title="Bold"><Bold className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={fmt.italic} title="Italic"><Italic className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={fmt.underline} title="Underline"><UnderlineIcon className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={fmt.strike} title="Strikethrough"><Strikethrough className="w-4 h-4" /></TBtn>

          <Divider />

          {/* Text Color — Paintbrush (old icon) */}
          <ColorPicker
            icon={<Paintbrush className="w-4 h-4" />}
            title="Text Color"
            colors={TEXT_COLORS}
            onSelect={(c) => editor.chain().focus().setColor(c).run()}
          />

          {/* Highlight — PaintBucket (old icon) */}
          <ColorPicker
            icon={<PaintBucket className="w-4 h-4" />}
            title="Highlight Color"
            colors={HIGHLIGHT_COLORS}
            onSelect={(c) => {
              if (c === 'none') editor.chain().focus().unsetHighlight().run();
              else editor.chain().focus().setHighlight({ color: c }).run();
            }}
          />

          <Divider />

          {/* Headings */}
          <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={fmt.h1} title="Heading 1"><Heading1 className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={fmt.h2} title="Heading 2"><Heading2 className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={fmt.h3} title="Heading 3"><Heading3 className="w-4 h-4" /></TBtn>

          <Divider />

          {/* Alignment */}
          <TBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={fmt.alignLeft} title="Align Left"><AlignLeft className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={fmt.alignCenter} title="Align Center"><AlignCenter className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={fmt.alignRight} title="Align Right"><AlignRight className="w-4 h-4" /></TBtn>

          <Divider />

          {/* Lists */}
          <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={fmt.bulletList} title="Bullet List"><List className="w-4 h-4" /></TBtn>
          <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={fmt.orderedList} title="Ordered List"><ListOrdered className="w-4 h-4" /></TBtn>

          {/* Right side: status + Save + Export PDF */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            {saving ? (
              <span className="flex items-center gap-1 text-xs text-text-light"><Loader2 className="w-3 h-3 animate-spin" /> Saving…</span>
            ) : isDirty ? (
              <span className="text-xs text-amber-500 font-medium">Unsaved</span>
            ) : lastSaved ? (
              <span className="text-xs text-text-light">Saved {lastSaved}</span>
            ) : null}

            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-sub bg-surface-light border border-border-default rounded-lg hover:bg-background-light transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
            <button onClick={exportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Editor content area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#FAF9F5] pt-8 pb-32 tiptap-wrap">
          <EditorContent editor={editor} className="bg-transparent mx-auto" style={{ maxWidth: 794 }} />
          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}
