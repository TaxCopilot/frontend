"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { caseService } from '@/services/caseService';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseId: string) => void;
}

export function CreateCaseModal({ isOpen, onClose, onSuccess }: CreateCaseModalProps) {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const c = await caseService.create({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
      onSuccess(c.id);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !creating && onClose()}>
      <div className="bg-surface-light rounded-2xl shadow-2xl border border-border-subtle w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-text-heading mb-4">Create Case</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-heading mb-1.5">Title *</label>
            <input
              type="text"
              placeholder="e.g. GST Notice – ABC Traders"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-heading mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              placeholder="Brief context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => !creating && onClose()} className="flex-1 px-4 py-2.5 border border-border-default rounded-xl text-sm font-medium text-text-sub hover:bg-background-light">
              Cancel
            </button>
            <button type="submit" disabled={creating || !title.trim()} className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2">
              {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
