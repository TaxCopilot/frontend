import { Header } from '@/components/Header';
import Image from 'next/image';
import { Bot, Send, Paperclip, Sparkles, FileText, ChevronRight, Scale, Mic, Download, Upload, Clock, MoreHorizontal } from 'lucide-react';

export default function ChatPage() {
  return (
    <>
      <Header title="Agentic Analysis" subtitle="Notice_GST_REG_17_ABC_Traders.pdf" />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background-light relative">

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 scrollbar-thin">

            {/* AI Welcome Message */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-9 h-9 rounded-xl bg-primary text-surface-light flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-text-heading">TaxCopilot AI</span>
                  <span className="text-[11px] text-text-light">10:42 AM</span>
                </div>
                <div className="bg-secondary-soft border border-secondary/20 rounded-2xl rounded-tl-none p-5 text-text-main leading-relaxed text-[15px]">
                  <p className="mb-4">I&apos;ve analyzed the uploaded document <strong className="text-text-heading">Notice_GST_REG_17_ABC_Traders.pdf</strong>.</p>
                  <p className="mb-4">This is a Show Cause Notice (SCN) issued under Section 29 of the CGST Act, 2017, proposing cancellation of GST registration. The stated reason is: <em>&quot;Non-filing of returns for a continuous period of six months.&quot;</em></p>

                  <div className="bg-surface-light border border-border-default rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-text-heading text-sm mb-2.5 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-primary" />
                      Legal Context
                    </h4>
                    <ul className="text-sm space-y-2 text-text-sub list-disc list-inside">
                      <li><strong className="text-text-heading">Section 29(2)(c)</strong> of CGST Act allows proper officer to cancel registration if returns are not furnished for a continuous period of six months.</li>
                      <li><strong className="text-text-heading">Rule 22(1)</strong> of CGST Rules requires issuing notice in FORM GST REG-17.</li>
                      <li>Reply must be filed in <strong className="text-text-heading">FORM GST REG-18</strong> within 7 working days.</li>
                    </ul>
                  </div>

                  <p>Would you like me to draft a response in FORM GST REG-18? I will need the reason for the delay in filing returns to make the draft complete.</p>
                </div>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 max-w-3xl ml-auto flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src="https://picsum.photos/seed/user/100/100" alt="User" width={36} height={36} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 flex flex-col items-end">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-text-light">10:45 AM</span>
                  <span className="font-semibold text-sm text-text-heading">You</span>
                </div>
                <div className="bg-primary text-surface-light rounded-2xl rounded-tr-none p-5 leading-relaxed text-[15px]">
                  <p>Yes, please draft the response. The delay was due to the severe illness of the primary accountant, who was hospitalized for 3 months. We have since filed all pending returns and paid the late fees.</p>
                </div>
              </div>
            </div>

            {/* AI Generating Message */}
            <div className="flex gap-4 max-w-3xl">
              <div className="w-9 h-9 rounded-xl bg-primary text-surface-light flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-text-heading">TaxCopilot AI</span>
                  <span className="text-[11px] text-text-light italic">Drafting...</span>
                </div>
                <div className="bg-secondary-soft border border-secondary/20 rounded-2xl rounded-tl-none p-5 flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-text-sub italic">Cross-referencing precedents and formatting draft...</span>
                </div>

                {/* File Attachment Card */}
                <div className="bg-surface-light border border-border-default rounded-xl p-3 flex items-center justify-between max-w-md shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-soft text-red-text rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-heading">GST_REG18_Reply.pdf</p>
                      <p className="text-[11px] text-text-light">Generating • 1.2 MB</p>
                    </div>
                  </div>
                  <button className="text-text-light hover:text-primary transition-colors p-1.5 hover:bg-background-light rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Action Chips */}
          <div className="px-6 lg:px-8 pb-3 flex gap-2 flex-wrap">
            <button className="bg-surface-light border border-border-default hover:border-primary text-text-sub hover:text-primary text-xs px-3 py-1.5 rounded-lg font-medium transition-all">
              What is Circular 183?
            </button>
            <button className="bg-surface-light border border-border-default hover:border-primary text-text-sub hover:text-primary text-xs px-3 py-1.5 rounded-lg font-medium transition-all">
              Add penalty waiver clause
            </button>
            <button className="bg-surface-light border border-border-default hover:border-primary text-text-sub hover:text-primary text-xs px-3 py-1.5 rounded-lg font-medium transition-all">
              Summarize notice
            </button>
            <button className="bg-surface-light border border-border-default hover:border-primary text-text-sub hover:text-primary text-xs px-3 py-1.5 rounded-lg font-medium transition-all">
              Find related case laws
            </button>
          </div>

          {/* Input Area */}
          <div className="p-4 lg:px-8 bg-surface-light border-t border-border-subtle">
            <div className="max-w-3xl mx-auto relative">
              <div className="flex items-center bg-background-light border border-border-default rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <div className="flex gap-1 pl-3">
                  <button className="p-2 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-surface-light">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-surface-light">
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Type your instructions or provide context..."
                  className="flex-1 bg-transparent py-3 px-3 text-text-main placeholder-text-light text-sm focus:outline-none"
                />
                <div className="flex gap-1 pr-3">
                  <button className="p-2 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-surface-light">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 bg-primary text-surface-light rounded-xl hover:bg-primary-dark transition-colors shadow-sm">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Context Documents */}
        <div className="w-80 bg-surface-light border-l border-border-subtle hidden xl:flex flex-col">
          <div className="p-4 border-b border-border-subtle">
            <h3 className="font-semibold text-text-heading text-sm">Context Documents</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Source Files</h4>
              <div className="space-y-2">
                <div className="bg-background-light border border-border-subtle rounded-xl p-3 flex items-start gap-3 cursor-pointer hover:border-primary transition-colors group">
                  <FileText className="w-7 h-7 text-red-text flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-heading truncate group-hover:text-primary transition-colors">Notice_GST_REG_17.pdf</p>
                    <p className="text-[11px] text-text-light mt-0.5">Uploaded 10:40 AM</p>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-primary font-medium py-2 border border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Generated Drafts</h4>
              <div className="border-2 border-dashed border-border-default rounded-xl p-5 flex flex-col items-center justify-center text-center text-text-sub">
                <Sparkles className="w-5 h-5 mb-2 text-text-light" />
                <p className="text-sm">AI is currently generating the draft reply...</p>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Relevant Case Laws</h4>
              <ul className="space-y-2">
                <li className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  TVL. Suguna Cutpiece vs ADC (2022)
                </li>
                <li className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Poonamchand Saran vs UOI (2023)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Case History</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-text-heading">Analysis started</p>
                    <div className="flex items-center gap-1 text-[11px] text-text-light mt-0.5">
                      <Clock className="w-3 h-3" /> 10:42 AM
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-text-heading">Draft requested</p>
                    <div className="flex items-center gap-1 text-[11px] text-text-light mt-0.5">
                      <Clock className="w-3 h-3" /> 10:45 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
