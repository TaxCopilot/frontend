'use client';

import { useRef, useEffect } from 'react';
import {
  Send, Loader2, MessageSquare, Scale
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { ChatMessage, ChatMode } from '@/hooks/useCaseChat';

interface CaseChatProps {
  messages: ChatMessage[];
  historyLoading: boolean;
  sending: boolean;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  sendMessage: (text: string) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  MODES: { id: ChatMode; label: string; icon: any; placeholder: string }[];
  renderMessageContent: (content: string) => React.ReactNode;
}

export function CaseChat({
  messages,
  historyLoading,
  sending,
  chatMode,
  setChatMode,
  sendMessage,
  inputValue,
  setInputValue,
  chatEndRef,
  MODES,
  renderMessageContent
}: CaseChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 192) + 'px';
  }, [inputValue]);

  // Auto-scroll to bottom when messages change or typing begins
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, sending, chatEndRef]);

  const activeMode = MODES.find((m) => m.id === chatMode)!;

  const handleSend = () => {
    if (!inputValue.trim() || sending) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <main className="flex-1 flex flex-col bg-background-light min-w-0 h-full overflow-hidden relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 scrollbar-thin min-h-0 pb-40">
        {historyLoading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-text-sub">Loading chat...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-text-heading mb-2">Start a conversation</h3>
            <p className="text-text-sub text-sm leading-relaxed mb-8">
              Select a mode below, type your prompt, and press Send.
            </p>
            {/* Mode hints */}
            <div className="grid grid-cols-3 gap-3 w-full">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setChatMode(m.id); textareaRef.current?.focus(); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all text-xs font-medium
                    ${chatMode === m.id
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-border-default text-text-sub hover:border-primary/20 hover:bg-primary/5'
                    }`}
                >
                  <m.icon className="w-5 h-5" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 bg-primary/10 border border-primary/20 text-primary shadow-sm">
                  <Scale className="w-4 h-4" />
                </div>
              )}
              <div className={`flex flex-col gap-1 min-w-0 ${msg.role === 'user' ? 'max-w-[85%]' : 'flex-1 pr-8'}`}>
                <div className={`text-[15px] leading-relaxed text-text-heading ${msg.role === 'user'
                    ? 'bg-[#F0EEE7] px-5 py-3 rounded-[24px] rounded-tr-[8px]'
                    : 'pt-1.5'
                  }`}>
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {sending && (
          <div className="flex gap-4 max-w-3xl">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Scale className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 text-text-sub text-sm py-3 px-4 rounded-2xl bg-white border border-border-default shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              {chatMode === 'analysis' ? 'Running deep research...' : chatMode === 'draft' ? 'Generating draft...' : 'Thinking...'}
            </div>
          </div>
        )}
        {/* Empty space so the last message isn't hidden behind the floating input */}
        <div className="h-32 flex-shrink-0" ref={chatEndRef} />
      </div>

      {/* ── Floating Input Area ── */}
      <div className="absolute bottom-6 left-0 right-0 px-4 lg:px-6 pointer-events-none flex justify-center">
        <div className="w-full max-w-3xl pointer-events-auto shadow-xl rounded-2xl bg-white border border-border-default transition-all duration-150 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={activeMode.placeholder}
            rows={1}
            className="w-full min-h-[52px] max-h-48 resize-none bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed focus:outline-none placeholder-text-light text-text-main"
            disabled={sending}
            aria-label="Message"
          />

          <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {MODES.map((m) => {
                const active = chatMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setChatMode(m.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border ${active
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'text-text-sub border-border-default hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    <m.icon className="w-3.5 h-3.5" />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || sending}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Send"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
