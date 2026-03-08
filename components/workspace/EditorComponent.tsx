'use client';

import { 
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Save, Download, Upload, Loader2, Heading1, Heading2, Heading3 
} from 'lucide-react';
import { EditorContent } from '@tiptap/react';

interface EditorComponentProps {
  editor: any;
  saving: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  handleSave: () => void;
  uploading: boolean;
  handlePdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EditorComponent({
  editor,
  saving,
  isDirty,
  lastSaved,
  handleSave,
  uploading,
  handlePdfUpload
}: EditorComponentProps) {
  if (!editor) return null;

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
      <div className="bg-surface-light border border-border-default rounded-2xl shadow-card flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-border-subtle p-3 flex items-center justify-between bg-background-light/50">
          <div className="flex items-center gap-1">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Bold className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Italic className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><UnderlineIcon className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-border-default mx-2" />
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Heading1 className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Heading2 className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><Heading3 className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-border-default mx-2" />
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><AlignLeft className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><AlignCenter className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><AlignRight className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-border-default mx-2" />
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><List className="w-4 h-4" /></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-text-sub hover:bg-border-subtle'}`}><ListOrdered className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-border-default mx-2" />
            
            <label className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors cursor-pointer relative">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <input type="file" accept=".pdf" onChange={handlePdfUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>
          </div>
          <div className="flex items-center gap-2">
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
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#FAF9F5] flex justify-center pt-8 pb-32">
          <div className="w-full flex flex-col items-center">
            <EditorContent editor={editor} className="bg-transparent" />
            {/* Extra spacer at the bottom of inner container */}
            <div className="h-12 w-full flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
