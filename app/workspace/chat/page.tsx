"use client";

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Bot, Send, Sparkles, FileText, Scale, Loader2, AlertCircle, Play } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { documentService, AnalysisFile } from '@/services/documentService';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

interface AnalysisResult {
  document_id: string;
  notice_type: string;
  summary: string;
  key_issues: string[];
  recommended_actions: string[];
  draft_reply: string;
  legal_references: string[];
  sources: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isAnalysis?: boolean;
  analysisResult?: AnalysisResult;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  const user = useAuthStore((s) => s.user);

  const [document, setDocument] = useState<AnalysisFile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load document
  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }
    loadDocument();
  }, [docId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const doc = await documentService.getAnalysisFile(docId!);
      setDocument(doc);

      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `I've loaded your document **${doc.filename}**. Click "Run Analysis" to start the AI-powered analysis. I'll identify the notice type, extract key issues, find relevant legal references, and prepare a draft response.`,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      setError('Failed to load document. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!document) return;
    setAnalyzing(true);
    setError(null);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `Please analyze the document "${document.filename}" and provide a comprehensive legal analysis.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await api.post('/api/ai/v1/decode-notice', {
        document_id: document.id,
        notice_type: 'auto-detect',
        s3_bucket: document.s3Bucket,
        s3_key: document.s3Key,
      });

      const result = response.data;

      // Build formatted analysis content
      const analysisContent = formatAnalysisResponse(result);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: analysisContent,
        timestamp: new Date(),
        isAnalysis: true,
        analysisResult: result,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      const errorDetail = err.response?.data?.detail;
      let errorMessage = 'Analysis failed. ';

      if (typeof errorDetail === 'object' && errorDetail?.stage) {
        errorMessage += `Stage: ${errorDetail.stage}. ${errorDetail.error || ''}`;
      } else if (typeof errorDetail === 'string') {
        errorMessage += errorDetail;
      } else {
        errorMessage += 'Please check that the AI service is running and try again.';
      }

      const errMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${errorMessage}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // For now, provide a helpful response about running analysis
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: document
          ? `I understand your query: "${text}". To get a comprehensive AI analysis of your document, please click the **"Run Analysis"** button above. The analysis will use AWS Textract for OCR and Bedrock Claude for legal analysis.`
          : `Please upload a document first from the [Intake page](/workspace/intake) to start analysis.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const formatAnalysisResponse = (result: any): string => {
    let content = '';

    if (result.summary) {
      content += `**Summary:**\n${result.summary}\n\n`;
    }

    if (result.key_issues?.length) {
      content += `**Key Issues:**\n${result.key_issues.map((i: string) => `• ${i}`).join('\n')}\n\n`;
    }

    if (result.recommended_actions?.length) {
      content += `**Recommended Actions:**\n${result.recommended_actions.map((a: string) => `• ${a}`).join('\n')}\n\n`;
    }

    if (result.legal_references?.length) {
      content += `**Legal References:**\n${result.legal_references.map((r: string) => `• ${r}`).join('\n')}\n\n`;
    }

    if (result.draft_reply) {
      content += `**Draft Reply:**\n${result.draft_reply}\n\n`;
    }

    if (result.sources?.length) {
      content += `**Sources:**\n${result.sources.map((s: string) => `• ${s}`).join('\n')}`;
    }

    // If the response has a different structure, show the full response
    if (!content.trim()) {
      content = JSON.stringify(result, null, 2);
    }

    return content;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  if (loading) {
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
          {!document && (
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

              {/* Analyzing indicator */}
              {analyzing && (
                <div className="flex gap-4 max-w-3xl">
                  <div className="w-9 h-9 rounded-xl bg-primary text-surface-light flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-semibold text-sm text-text-heading">TaxCopilot AI</span>
                      <span className="text-[11px] text-text-light italic">Analyzing...</span>
                    </div>
                    <div className="bg-secondary-soft border border-secondary/20 rounded-2xl rounded-tl-none p-5 flex items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-text-sub italic">Running OCR, cross-referencing legal precedents, and generating analysis...</span>
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
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Type your instructions or provide context..."
                    className="flex-1 bg-transparent py-3 px-3 text-text-main placeholder-text-light text-sm focus:outline-none"
                    disabled={analyzing}
                  />
                  <div className="flex gap-1 pr-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || analyzing}
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
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${analyzing ? 'bg-secondary animate-pulse' : messages.length > 1 ? 'bg-primary' : 'bg-border-default'}`} />
                    <div>
                      <p className="text-sm text-text-heading">AWS Textract OCR</p>
                      <p className="text-[11px] text-text-light">Extract text from document</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${analyzing ? 'bg-secondary animate-pulse' : messages.length > 1 ? 'bg-primary' : 'bg-border-default'}`} />
                    <div>
                      <p className="text-sm text-text-heading">Knowledge Base Search</p>
                      <p className="text-[11px] text-text-light">Find relevant legal provisions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${analyzing ? 'bg-secondary animate-pulse' : messages.length > 1 ? 'bg-primary' : 'bg-border-default'}`} />
                    <div>
                      <p className="text-sm text-text-heading">Claude Analysis</p>
                      <p className="text-[11px] text-text-light">Generate analysis & draft reply</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
