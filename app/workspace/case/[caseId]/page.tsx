"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Search, Sparkles 
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCase } from '@/hooks/useCase';
import { documentService } from '@/services/documentService';
import { draftService } from '@/services/draftService';
import { PageSkeleton } from '@/components/SkeletonLoader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import { useCaseChat, ChatMode } from '@/hooks/useCaseChat';
import { CaseSidebar } from '@/components/workspace/CaseSidebar';
import { CaseChat } from '@/components/workspace/CaseChat';

const MODES: { id: ChatMode; label: string; icon: any; placeholder: string }[] = [
  {
    id: 'chat',
    label: 'Normal Chat',
    icon: MessageCircle,
    placeholder: 'Ask anything about this case...',
  },
  {
    id: 'analysis',
    label: 'Deep Research',
    icon: Search,
    placeholder: 'Describe what to analyze or extract from the document...',
  },
  {
    id: 'draft',
    label: 'Create Draft',
    icon: Sparkles,
    placeholder: 'Describe the draft or response you want to generate...',
  },
];

export default function CaseChatPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params?.caseId as string | null;
  const { caseData, isLoading, fetchCase } = useCase(caseId);

  const [inputValue, setInputValue] = useState('');
  const [leftPanelWidth, setLeftPanelWidth] = useState(280);
  const [draftMenuOpen, setDraftMenuOpen] = useState<string | null>(null);
  const [renameDraftId, setRenameDraftId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [deleteDraftId, setDeleteDraftId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    messages,
    historyLoading,
    sending,
    chatMode,
    setChatMode,
    sendMessage
  } = useCaseChat({ 
    caseId, 
    documents: caseData?.documents ?? [], 
    onFetchCase: fetchCase 
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caseId) {
      fetchCase();
    }
  }, [caseId, fetchCase]);

  const startLeftDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftPanelWidth;
    const onMove = (mv: MouseEvent) => {
      const delta = mv.clientX - startX;
      const next = Math.min(600, Math.max(200, startWidth + delta));
      setLeftPanelWidth(next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !caseId) return;
    setUploading(true);
    try {
      await documentService.uploadForAnalysis(file, caseId);
      await fetchCase();
    } catch {
      // ignore
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const renderMessageContent = (content: string) => {
    if (content.startsWith('[DRAFT_JSON]')) {
      try {
        const data = JSON.parse(content.replace('[DRAFT_JSON]', ''));
        return (
          <div className="flex flex-col gap-3 w-full mt-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
               {data.title || 'Draft'}
            </div>
            <div className="bg-background-light border border-border-default rounded-xl p-3 text-sm text-text-sub">
              {data.snippet || 'Draft content preview...'}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <button onClick={() => router.push(`/workspace/editor?id=${data.id}`)} className="flex-1 py-1.5 px-3 bg-white border border-border-default rounded-lg text-xs font-semibold hover:border-primary/50 hover:text-primary transition-colors text-center">
                 Show
               </button>
            </div>
          </div>
        );
      } catch(e) {}
    }

    if (content.startsWith('Draft created: **') && content.includes('**.')) {
      const titleMatch = content.match(/\*\*(.*?)\*\*/);
      const title = titleMatch ? titleMatch[1] : 'Draft';
      const matchedDraft = caseData?.drafts?.find((d) => d.title === title);
      const draftId = matchedDraft?.id;
      const rawText = String(matchedDraft?.content || '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
      const snippet = rawText ? (rawText.substring(0, 100).trim() + '...') : 'Draft content preview...';

      return (
        <div className="flex flex-col gap-3 w-full mt-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
             {title}
          </div>
          <div className="bg-background-light border border-border-default rounded-xl p-3 text-sm text-text-sub">
            {snippet}
          </div>
          <div className="flex items-center gap-2 mt-1">
             <button 
               disabled={!draftId}
               onClick={() => draftId && router.push(`/workspace/editor?id=${draftId}`)} 
               className="flex-1 py-1.5 px-3 bg-white border border-border-default rounded-lg text-xs font-semibold hover:border-primary/50 hover:text-primary transition-colors text-center disabled:opacity-50"
             >
               Show
             </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="prose prose-sm prose-p:leading-relaxed prose-p:my-2 prose-a:text-primary max-w-none break-words">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
            br: () => <div className="h-3" />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  if (isLoading || !caseData) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light">
        <div className="p-8">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex overflow-hidden h-full bg-background-light">
        <CaseSidebar 
          caseData={caseData}
          leftPanelWidth={leftPanelWidth}
          startLeftDrag={startLeftDrag}
          uploading={uploading}
          onUpload={handleUpload}
          draftMenuOpen={draftMenuOpen}
          setDraftMenuOpen={setDraftMenuOpen}
          onRenameDraft={(id, title) => {
            setRenameDraftId(id);
            setRenameInput(title);
          }}
          onDeleteDraft={(id) => setDeleteDraftId(id)}
          router={router}
        />

        <CaseChat 
          messages={messages}
          historyLoading={historyLoading}
          sending={sending}
          chatMode={chatMode}
          setChatMode={setChatMode}
          sendMessage={sendMessage}
          inputValue={inputValue}
          setInputValue={setInputValue}
          chatEndRef={chatEndRef}
          MODES={MODES}
          renderMessageContent={renderMessageContent}
        />
      </div>

      {renameDraftId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-text-heading mb-4">Rename Draft</h3>
            <input
              autoFocus
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && renameInput.trim()) {
                  try {
                    await draftService.updateDraft(renameDraftId, { title: renameInput.trim() });
                    await fetchCase();
                    setRenameDraftId(null);
                  } catch(err) { console.error(err); }
                }
                if (e.key === 'Escape') setRenameDraftId(null);
              }}
              className="w-full bg-background-light border border-border-default rounded-xl py-2 px-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all mb-4"
              placeholder="Draft Name"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenameDraftId(null)} className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors">Cancel</button>
              <button
                onClick={async () => {
                  if (!renameInput.trim()) return;
                  try {
                    await draftService.updateDraft(renameDraftId, { title: renameInput.trim() });
                    await fetchCase();
                    setRenameDraftId(null);
                  } catch(err) { console.error(err); }
                }}
                disabled={!renameInput.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-dark rounded-xl transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDraftId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-text-heading mb-2">Delete Draft</h3>
            <p className="text-sm text-text-sub mb-6">Are you sure you want to delete this draft? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteDraftId(null)} className="px-4 py-2 text-sm font-medium text-text-sub hover:bg-background-light rounded-xl transition-colors">Cancel</button>
              <button
                onClick={async () => {
                  try {
                    await draftService.trashDraft(deleteDraftId);
                    await fetchCase();
                    setDeleteDraftId(null);
                  } catch(err) { console.error(err); }
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
