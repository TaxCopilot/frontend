import { Header } from '@/components/Header';
import { UploadCloud, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function IntakePage() {
  return (
    <>
      <Header title="Document Intake" subtitle="Upload notices or case files for AI analysis" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-4xl mx-auto">

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-default -z-10" />

            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-10 h-10 rounded-full bg-primary text-surface-light flex items-center justify-center font-bold shadow-md ring-4 ring-surface-light">1</div>
              <span className="text-sm font-medium text-text-heading">Upload</span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-10 h-10 rounded-full bg-surface-light border-2 border-border-default text-text-light flex items-center justify-center font-bold ring-4 ring-surface-light">2</div>
              <span className="text-sm font-medium text-text-light">Analyze</span>
            </div>

            <div className="flex flex-col items-center gap-2 bg-background-light px-2">
              <div className="w-10 h-10 rounded-full bg-surface-light border-2 border-border-default text-text-light flex items-center justify-center font-bold ring-4 ring-surface-light">3</div>
              <span className="text-sm font-medium text-text-light">Draft</span>
            </div>
          </div>

          <div className="bg-surface-light border border-border-default rounded-3xl p-8 shadow-card mb-8">
            <h2 className="text-2xl font-serif text-text-heading mb-6">Upload Document</h2>

            <div className="border-2 border-dashed border-border-default rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group mb-8">
              <div className="w-20 h-20 bg-background-light rounded-full flex items-center justify-center mb-6 group-hover:bg-surface-light group-hover:shadow-sm transition-all">
                <UploadCloud className="w-10 h-10 text-text-light group-hover:text-primary" />
              </div>
              <h3 className="text-xl font-medium text-text-heading mb-2">Drag & drop your files here</h3>
              <p className="text-text-sub mb-6 max-w-md">
                Support for PDF, DOCX, JPG, and PNG. Maximum file size 50MB.
              </p>
              <button className="bg-surface-light border border-border-default text-text-sub hover:bg-background-light px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all">
                Browse Files
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-text-heading">Recent Uploads</h4>

              <div className="flex items-center justify-between p-4 border border-border-subtle rounded-xl bg-background-light/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-soft text-red-text rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-heading">Notice_GST_REG_17_ABC_Traders.pdf</p>
                    <p className="text-xs text-text-light">2.4 MB • Uploaded just now</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-text" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/workspace/chat" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-secondary-text px-8 py-3.5 rounded-xl font-semibold shadow-float transition-all transform hover:-translate-y-0.5">
              Proceed to Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
