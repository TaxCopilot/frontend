"use client";

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Bot, Send, Sparkles, FileText, Scale, Loader2, Play } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useDocument } from '@/hooks/useDocument';
import { useChat } from '@/hooks/useChat';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  const user = useAuthStore((s) => s.user);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { document, loading: docLoading, error: docError } = useDocument(docId);
  const { messages, analyzing, chatLoading, historyLoading, runAnalysis, sendMessage } = useChat({
    document,
    docId,
  });

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    await sendMessage(text);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  // ── Loading state ─────────────────────────────────────────────────────────
  if (docLoading) {
    return (
      <>
        <Header title="Agentic Analysis" subtitle="Loading..." />
        <div className="flex-1 flex items-center justify-center bg-background-light">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-text-sub">Loading document...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Agentic Analysis"
        subtitle={document?.filename || 'No document selected'}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background-light relative">

          {/* Error Banner */}
          {docError && (
            <div className="px-6 lg:px-8 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
              {docError}
            </div>
          )}

          {/* Analysis Action Bar */}
          {document && !analyzing && (
            <div className="px-6 lg:px-8 py-3 bg-surface-light border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-soft text-red-text rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-heading">{document.filename}</p>
                  <p className="text-[11px] text-text-light">
                    {(document.sizeBytes / (1024 * 1024)).toFixed(1)} MB • S3
                  </p>
                </div>
              </div>
              <button
                onClick={runAnalysis}
                className="inline-flex items-center gap-2 bg-primary text-surface-light px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-dark transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4" />
                Run Analysis
              </button>
            </div>
          )}

          {/* No Document State */}
          {!document && !docLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-background-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-text-light" />
                </div>
                <h3 className="text-lg font-semibold text-text-heading mb-2">No Document Selected</h3>
                <p className="text-text-sub mb-6">
                  Upload a document from the intake page to start AI analysis.
                </p>
                <a
                  href="/workspace/intake"
                  className="inline-flex items-center gap-2 bg-primary text-surface-light px-6 py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-dark transition-all"
                >
                  Go to Intake
                </a>
              </div>
            </div>
          )}

          {/* Chat History */}
          {document && (
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scrollbar-thin">
              {historyLoading && (
                <div className="flex items-center gap-3 justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-text-sub">Loading conversation history...</span>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-primary/10'
                      : 'bg-primary text-surface-light shadow-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <span className="text-xs font-bold text-primary">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`space-y-2 ${msg.role === 'user' ? 'flex flex-col items-end' : 'flex-1'}`}>
                    <div className="flex items-center gap-2.5">
                      {msg.role === 'user' && <span className="text-[11px] text-text-light">{formatTime(msg.timestamp)}</span>}
                      <span className="font-semibold text-sm text-text-heading">
                        {msg.role === 'user' ? 'You' : 'TaxCopilot AI'}
                      </span>
                      {msg.role !== 'user' && <span className="text-[11px] text-text-light">{formatTime(msg.timestamp)}</span>}
                    </div>
                    <div className={`rounded-2xl p-5 leading-relaxed text-[15px] ${
                      msg.role === 'user'
                        ? 'bg-primary text-surface-light rounded-tr-none'
                        : 'bg-secondary-soft border border-secondary/20 rounded-tl-none text-text-main'
                    }`}>
                      {msg.isAnalysis ? (
                        <div className="space-y-4">
                          {msg.content.split('\n\n').map((block, i) => {
                            if (block.startsWith('**') && block.includes(':**')) {
                              const [title, ...rest] = block.split('\n');
                              return (
                                <div key={i}>
                                  <h4 className="font-semibold text-text-heading text-sm mb-2 flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-primary" />
                                    {title.replace(/\*\*/g, '').replace(':', '')}
                                  </h4>
                                  <div className="text-sm space-y-1 text-text-sub">
                                    {rest.map((line, j) => (
                                      <p key={j}>{line.replace(/^• /, '').trim()}</p>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return <p key={i}>{block}</p>;
                          })}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {msg.content.split('**').map((part, i) =>
                            i % 2 === 1 ? (
                              <strong key={i} className={msg.role === 'user' ? '' : 'text-text-heading'}>{part}</strong>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading states */}
              {(chatLoading || analyzing) && (
                <div className="flex gap-4 max-w-3xl">
                  <div className="w-9 h-9 rounded-xl bg-primary text-surface-light flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-text-heading">TaxCopilot AI</span>
                      <span className="text-[11px] text-text-light italic">
                        {analyzing ? 'Analyzing...' : 'Thinking...'}
                      </span>
                    </div>
                    <div className="bg-secondary-soft border border-secondary/20 rounded-2xl rounded-tl-none p-5 flex items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-text-sub italic">
                        {analyzing
                          ? 'Running OCR, cross-referencing legal precedents, and generating analysis...'
                          : 'Searching legal knowledge base...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* Input Area */}
          {document && (
            <div className="p-4 lg:px-8 bg-surface-light border-t border-border-subtle">
              <div className="max-w-3xl mx-auto relative">
                <div className="flex items-center bg-background-light border border-border-default rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <div className="flex gap-1 pl-3">
                    <button className="p-2 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-surface-light">
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your instructions or provide context..."
                    className="flex-1 bg-transparent py-3 px-3 text-text-main placeholder-text-light text-sm focus:outline-none"
                    disabled={analyzing || chatLoading}
                  />
                  <div className="flex gap-1 pr-3">
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || analyzing || chatLoading}
                      className="p-2.5 bg-primary text-surface-light rounded-xl hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        {document && (
          <div className="w-80 bg-surface-light border-l border-border-subtle hidden xl:flex flex-col">
            <div className="p-4 border-b border-border-subtle">
              <h3 className="font-semibold text-text-heading text-sm">Document Info</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
              <div>
                <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Source File</h4>
                <div className="bg-background-light border border-border-subtle rounded-xl p-3 flex items-start gap-3">
                  <FileText className="w-7 h-7 text-red-text flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-heading truncate">{document.filename}</p>
                    <p className="text-[11px] text-text-light mt-0.5">
                      {(document.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <p className="text-[11px] text-text-light">
                      Stored in S3: {document.s3Bucket}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Analysis Pipeline</h4>
                <div className="space-y-3">
                  {[
                    { label: 'AWS Textract OCR', sub: 'Extract text from document' },
                    { label: 'Knowledge Base Search', sub: 'Find relevant legal provisions' },
                    { label: 'Claude Analysis', sub: 'Generate analysis & draft reply' },
                  ].map((step) => (
                    <div key={step.label} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        analyzing ? 'bg-secondary animate-pulse' : messages.length > 1 ? 'bg-primary' : 'bg-border-default'
                      }`} />
                      <div>
                        <p className="text-sm text-text-heading">{step.label}</p>
                        <p className="text-[11px] text-text-light">{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
