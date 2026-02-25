import { Header } from '@/components/Header';
import Image from 'next/image';
import { Sparkles, Plus, FileText, File, FolderArchive, AlertTriangle, Scale, MoreVertical, LayoutGrid, List, Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
  return (
    <>
      <Header title="Workspace" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 pt-8 scrollbar-thin">

        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-aqua-tint to-surface-light border border-border-subtle rounded-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-secondary/20 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">AI Agent</span>
            </div>
            <h2 className="text-3xl font-serif text-text-heading mb-3 tracking-tight">Good morning, Arjun.</h2>
            <p className="text-text-sub mb-8 leading-relaxed max-w-lg font-light">
              Your AI agent is ready. Upload a tax notice to analyze root causes, cross-reference laws, and draft response strategies instantly.
            </p>
            <Link
              href="/workspace/chat"
              className="bg-secondary hover:bg-secondary-hover text-text-heading px-6 py-3.5 rounded-xl text-sm font-semibold shadow-float transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2.5"
            >
              <Sparkles className="w-5 h-5" />
              Start Agentic Chat
            </Link>
          </div>
          <div className="hidden md:flex relative z-10 items-center justify-center pr-12 gap-6 opacity-80">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-surface-light rounded-xl shadow-card flex items-center justify-center text-primary/80">
                <Scale className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="w-12 h-12 bg-surface-light rounded-xl shadow-card flex items-center justify-center text-primary/80">
                <FileText className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-surface-light rounded-xl shadow-card flex items-center justify-center text-secondary">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* File Library Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-medium text-text-heading flex items-center gap-2">
            File Library
            <span className="text-xs bg-background-light text-text-light border border-border-subtle px-2 py-0.5 rounded-full font-normal">12</span>
          </h3>
          <div className="flex gap-3">
            <div className="flex bg-background-light rounded-lg p-1 border border-border-subtle">
              <button className="p-1.5 px-2.5 text-primary bg-surface-light rounded shadow-sm">
                <LayoutGrid className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 px-2.5 text-text-light hover:text-text-sub transition-colors">
                <List className="w-[18px] h-[18px]" />
              </button>
            </div>
            <button className="flex items-center gap-2 text-sm font-medium text-text-sub hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-background-light">
              <Filter className="w-[18px] h-[18px]" />
              Filter
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-text-sub hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-background-light">
              <ArrowUpDown className="w-[18px] h-[18px]" />
              Sort by
            </button>
          </div>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* New Draft Card */}
          <Link href="/workspace/create" className="group border border-dashed border-border-default rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all h-56">
            <div className="w-12 h-12 rounded-full bg-background-light group-hover:bg-surface-light flex items-center justify-center transition-colors shadow-sm">
              <Plus className="w-6 h-6 text-text-light group-hover:text-primary" />
            </div>
            <span className="text-sm font-medium text-text-sub group-hover:text-primary transition-colors">New Draft</span>
          </Link>

          {/* File Card 1 */}
          <Link href="/workspace/editor" className="bg-surface-light rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-56 flex flex-col justify-between relative border border-transparent hover:border-primary/20">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-text-light hover:text-text-sub"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-soft text-red-text flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-heading text-base mb-1 line-clamp-2 leading-tight">Notice GST-REG-17 Reply Draft</h4>
              <p className="text-xs text-text-light mt-1">ABC Traders vs. GST Dept</p>
            </div>
            <div className="border-t border-border-subtle pt-4 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-text-light font-medium uppercase tracking-wide">2h ago</span>
              <div className="flex -space-x-2 items-center">
                <div className="w-6 h-6 rounded-full bg-green-soft text-green-text border border-surface-light flex items-center justify-center text-[9px] font-bold">AI</div>
                <Image src="https://picsum.photos/seed/user/100/100" alt="User" width={24} height={24} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full border border-surface-light object-cover" />
              </div>
            </div>
          </Link>

          {/* File Card 2 */}
          <Link href="/workspace/editor" className="bg-surface-light rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-56 flex flex-col justify-between relative border border-transparent hover:border-primary/20">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-text-light hover:text-text-sub"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-soft text-blue-text flex items-center justify-center mb-4">
                <File className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-heading text-base mb-1 line-clamp-2 leading-tight">Appeal Memorandum Form GST APL-01</h4>
              <p className="text-xs text-text-light mt-1">TechSolutions Pvt Ltd</p>
            </div>
            <div className="border-t border-border-subtle pt-4 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-text-light font-medium uppercase tracking-wide">Yesterday</span>
              <div className="flex -space-x-2">
                <Image src="https://picsum.photos/seed/user/100/100" alt="User" width={24} height={24} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full border border-surface-light object-cover" />
              </div>
            </div>
          </Link>

          {/* File Card 3 */}
          <Link href="/workspace/editor" className="bg-surface-light rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-56 flex flex-col justify-between relative border border-transparent hover:border-primary/20">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-text-light hover:text-text-sub"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-soft text-purple-text flex items-center justify-center mb-4">
                <FolderArchive className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-heading text-base mb-1 line-clamp-2 leading-tight">Q3 Financial Reports & Analysis</h4>
              <p className="text-xs text-text-light mt-1">Internal Review</p>
            </div>
            <div className="border-t border-border-subtle pt-4 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-text-light font-medium uppercase tracking-wide">3 days ago</span>
              <span className="text-[10px] bg-background-light text-text-sub px-2 py-0.5 rounded border border-border-subtle">3 Files</span>
            </div>
          </Link>

          {/* File Card 4 */}
          <Link href="/workspace/editor" className="bg-surface-light rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-56 flex flex-col justify-between relative border border-transparent hover:border-primary/20">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-text-light hover:text-text-sub"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-orange-soft text-orange-text flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-heading text-base mb-1 line-clamp-2 leading-tight">Show Cause Notice (SCN) Response</h4>
              <p className="text-xs text-text-light mt-1">Global Exports Ltd</p>
            </div>
            <div className="border-t border-border-subtle pt-4 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-text-light font-medium uppercase tracking-wide">5 days ago</span>
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-soft text-green-text border border-surface-light flex items-center justify-center text-[9px] font-bold">AI</div>
              </div>
            </div>
          </Link>

          {/* File Card 5 */}
          <Link href="/workspace/editor" className="bg-surface-light rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-56 flex flex-col justify-between relative border border-transparent hover:border-primary/20">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-text-light hover:text-text-sub"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-soft text-teal-text flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-text-heading text-base mb-1 line-clamp-2 leading-tight">Legal Precedent Research</h4>
              <p className="text-xs text-text-light mt-1">General Reference</p>
            </div>
            <div className="border-t border-border-subtle pt-4 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-text-light font-medium uppercase tracking-wide">1 week ago</span>
              <span className="text-[10px] bg-background-light text-text-sub px-2 py-0.5 rounded border border-border-subtle">Read Only</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
