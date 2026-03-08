'use client';

import { Sparkles, Bot, Send } from 'lucide-react';

interface EditorSidebarProps {
  panelWidth: number;
  startDrag: (e: React.MouseEvent) => void;
  chatMessages: { id: string; text: string; time: string }[];
  chatInput: string;
  setChatInput: (val: string) => void;
  sendMessage: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export function EditorSidebar({
  panelWidth,
  startDrag,
  chatMessages,
  chatInput,
  setChatInput,
  sendMessage,
  chatEndRef
}: EditorSidebarProps) {
  return (
    <>
      <div
        onMouseDown={startDrag}
        className="hidden xl:flex w-1.5 flex-shrink-0 cursor-col-resize group items-center justify-center hover:bg-primary/10 transition-colors"
        title="Drag to resize"
      >
        <div className="w-0.5 h-8 rounded-full bg-border-default group-hover:bg-primary/40 transition-colors" />
      </div>

      <div style={{ width: panelWidth }} className="bg-surface-light border-l border-border-subtle hidden xl:flex flex-col flex-shrink-0">
        <div className="px-3 py-2.5 border-b border-border-subtle flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-semibold text-text-heading text-[12.5px]">AI Writing Assistant</h3>
        </div>

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
      </div>
    </>
  );
}
