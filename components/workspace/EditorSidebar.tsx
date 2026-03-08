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
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-[14px] font-semibold text-text-heading mb-1">AI Writing Assistant</h3>
              <p className="text-[12px] text-text-light leading-relaxed max-w-[200px] mx-auto">
                Ask the AI anything about your document or request a draft.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.id.includes('assistant') ? 'justify-start' : 'justify-end'}`}>
                  {msg.id.includes('assistant') && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 bg-white border border-border-default text-text-heading shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`flex flex-col gap-1 min-w-0 ${msg.id.includes('assistant') ? 'flex-1' : 'max-w-[85%]'}`}>
                    <div className={`text-[13px] leading-relaxed text-text-heading ${
                      !msg.id.includes('assistant')
                        ? 'bg-[#F0EEE7] px-4 py-2 rounded-[20px] rounded-tr-[4px]'
                        : 'pt-1'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-text-light mt-1 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-border-subtle flex-shrink-0">
          <div className="relative group shadow-sm rounded-xl overflow-hidden border border-border-default focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Ask AI anything..."
              className="w-full bg-white py-3 pl-4 pr-12 text-[13px] text-text-main placeholder-text-light focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
