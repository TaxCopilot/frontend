'use client';

import { MoreHorizontal, Eye, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Case } from '@/services/caseService';

function timeAgo(dateString: string) {
  const d = new Date(dateString);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Yesterday';
  if (day < 7) return `${day}d ago`;
  if (day < 30) return `${Math.floor(day / 7)}w ago`;
  return d.toLocaleDateString();
}

interface CaseCardProps {
  caseItem: Case;
  onClick: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onRename: () => void;
  onTrash: () => void;
  onView: () => void;
  onOpen: () => void;
}

export function CaseCard({
  caseItem,
  onClick,
  menuOpen,
  onToggleMenu,
  onRename,
  onTrash,
  onView,
  onOpen
}: CaseCardProps) {
  return (
    <div className="relative group/card">
      <button
        onClick={onClick}
        className="w-full text-left bg-white rounded-2xl border border-border-default hover:border-primary/50 hover:shadow-md transition-all px-6 py-5 min-h-[140px] flex flex-col justify-between overflow-hidden"
      >
        <div className="w-full pr-6">
          <h4 className="font-medium text-[15px] text-text-heading truncate mb-1">{caseItem.title}</h4>
        </div>
        <div>
          <p className="text-[13px] text-text-sub">Updated {timeAgo(caseItem.updatedAt)}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover/card:via-primary/30 transition-all opacity-0 group-hover/card:opacity-100" />
      </button>
      <div className="absolute right-3 top-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
          className={`p-1.5 rounded-lg text-text-sub hover:bg-background-light transition-colors ${menuOpen ? 'bg-background-light' : 'opacity-0 group-hover/card:opacity-100'}`}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-20" onClick={(e) => { e.stopPropagation(); onToggleMenu(); }} />
            <div className="absolute right-0 top-8 mt-1 w-48 bg-white rounded-xl shadow-lg border border-border-default py-1 z-30" onClick={(e) => e.stopPropagation()}>
              <button onClick={onView} className="w-full text-left px-4 py-2 text-sm text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors">
                <Eye className="w-4 h-4" /> View Details
              </button>
              <button onClick={onOpen} className="w-full text-left px-4 py-2 text-sm text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors">
                <ExternalLink className="w-4 h-4" /> Open Editor
              </button>
              <button onClick={onRename} className="w-full text-left px-4 py-2 text-sm text-text-heading hover:bg-background-light flex items-center gap-2 transition-colors">
                <Pencil className="w-4 h-4" /> Rename
              </button>
              <div className="h-px bg-border-subtle my-1"></div>
              <button onClick={onTrash} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
