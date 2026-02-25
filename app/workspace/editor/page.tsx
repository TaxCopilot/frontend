"use client";

import { Header } from '@/components/Header';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Save, Download, Sparkles, Bot, Languages, Wand2, Type, GraduationCap, BookCheck, RotateCcw, ChevronRight, Send } from 'lucide-react';

export default function EditorPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Document Editor" subtitle="Notice GST-REG-17 Reply Draft" />

      <div className="flex-1 flex overflow-hidden bg-background-light">
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-hidden">
          <div className="bg-surface-light border border-border-default rounded-2xl shadow-card flex flex-col h-full overflow-hidden">

            {/* Toolbar */}
            <div className="border-b border-border-subtle p-3 flex items-center justify-between bg-background-light/50">
              <div className="flex items-center gap-1">
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><Italic className="w-4 h-4" /></button>
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-border-default mx-2" />
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><AlignCenter className="w-4 h-4" /></button>
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><AlignRight className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-border-default mx-2" />
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><List className="w-4 h-4" /></button>
                <button className="p-2 text-text-sub hover:bg-border-subtle rounded-lg transition-colors"><ListOrdered className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-sub bg-surface-light border border-border-default rounded-lg hover:bg-background-light transition-colors">
                  <Save className="w-4 h-4" /> Save
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface-light bg-primary rounded-lg hover:bg-primary-dark transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>

            {/* Editable Content */}
            <div className="flex-1 overflow-y-auto p-12 focus:outline-none scrollbar-thin" contentEditable suppressContentEditableWarning>
              <div className="max-w-3xl mx-auto font-serif text-text-heading leading-relaxed space-y-6">
                <p className="text-right">Date: October 24, 2023</p>
                <p>To,<br/>The Assistant Commissioner of State Tax,<br/>Zone-4, GST Bhavan.</p>
                <p className="font-bold">Subject: Reply to Show Cause Notice for Cancellation of Registration (Reference No: ZA2710230000000)</p>
                <p>Respected Sir/Madam,</p>
                <p>This is with reference to the Show Cause Notice issued in FORM GST REG-17 dated 15-10-2023, proposing the cancellation of our GST registration for non-filing of returns for a continuous period of six months.</p>
                <p>We humbly submit that the delay in filing the returns was not intentional but due to the severe illness and subsequent hospitalization of our primary accountant for three months. During this period, the firm faced significant administrative challenges.</p>
                <p>We wish to inform your good office that we have now filed all pending GSTR-1 and GSTR-3B returns up to the current tax period and have discharged all tax liabilities along with the applicable late fees and interest.</p>
                <p>In light of the above facts, and relying on the principle established in <em>TVL. Suguna Cutpiece Center vs. The Appellate Deputy Commissioner (ST)</em>, where the Hon&apos;ble High Court held that cancellation is a drastic measure and taxpayers should be allowed to rectify defaults, we request you to kindly drop the proceedings for cancellation of our registration.</p>
                <p>Thanking you,</p>
                <p>Yours faithfully,<br/>For ABC Traders<br/><br/>Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Agentic AI Panel */}
        <div className="w-80 bg-surface-light border-l border-border-subtle hidden xl:flex flex-col">
          <div className="p-4 border-b border-border-subtle flex items-center gap-2 bg-background-light/50">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text-heading text-sm">AI Writing Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">

            {/* Analysis Card */}
            <div className="bg-active-bg border border-primary/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Draft Analysis</span>
              </div>
              <p className="text-sm text-text-sub leading-relaxed">
                The draft addresses the core issue effectively. It provides a valid reason (medical emergency), confirms compliance, and cites relevant precedent.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[11px] font-semibold bg-green-soft text-green-text px-2 py-0.5 rounded-full">Score: 8.5/10</span>
              </div>
            </div>

            {/* AI Actions Grid */}
            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">AI Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                  <Languages className="w-5 h-5" />
                  <span className="text-xs font-medium">Translate</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                  <Wand2 className="w-5 h-5" />
                  <span className="text-xs font-medium">Improve</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                  <Type className="w-5 h-5" />
                  <span className="text-xs font-medium">Simplify</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-xs font-medium">Make Formal</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                  <BookCheck className="w-5 h-5" />
                  <span className="text-xs font-medium">Check Citations</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border-default bg-surface-light hover:border-primary hover:bg-active-bg text-text-sub hover:text-primary transition-all group">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-xs font-medium">Rewrite</span>
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-3">Suggestions</h4>
              <ul className="space-y-2.5">
                <li className="text-sm text-text-sub bg-surface-light border border-border-default p-3 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium block mb-1 text-text-heading group-hover:text-primary transition-colors">Attach Medical Certificate</span>
                      <span className="text-[13px]">Add: &quot;A copy of the medical certificate is enclosed herewith for your reference.&quot;</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-light group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </li>
                <li className="text-sm text-text-sub bg-surface-light border border-border-default p-3 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium block mb-1 text-text-heading group-hover:text-primary transition-colors">Cite Payment Challans</span>
                      <span className="text-[13px]">Mention the specific ARN or Challan numbers for the late fees paid.</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-light group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </li>
                <li className="text-sm text-text-sub bg-surface-light border border-border-default p-3 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-medium block mb-1 text-text-heading group-hover:text-primary transition-colors">Add Compliance History</span>
                      <span className="text-[13px]">Mention prior tax compliance record to strengthen the case.</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-light group-hover:text-primary flex-shrink-0 mt-1 transition-colors" />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* AI Input */}
          <div className="p-4 border-t border-border-subtle bg-background-light/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI to rewrite or suggest..."
                className="w-full bg-surface-light border border-border-default rounded-xl py-2.5 pl-3 pr-10 text-sm text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
