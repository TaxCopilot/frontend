"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { UploadCloud, FileText, Scale, MessageSquare, FileQuestion, ArrowRight, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export default function CreateDraftPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  const categories = [
    { id: 'scn', name: 'SCN Reply', icon: FileText, desc: 'Respond to Show Cause Notices', color: 'text-red-text bg-red-soft' },
    { id: 'appeal', name: 'Appeal Memorandum', icon: Scale, desc: 'Draft appeals to higher authorities', color: 'text-blue-text bg-blue-soft' },
    { id: 'opinion', name: 'Legal Opinion', icon: MessageSquare, desc: 'Internal advisory and opinions', color: 'text-purple-text bg-purple-soft' },
    { id: 'other', name: 'General Draft', icon: FileQuestion, desc: 'Custom legal documents', color: 'text-teal-text bg-teal-soft' },
  ];

  const handleFakeUpload = () => {
    setFiles([...files, 'Notice_GST_REG_17_ABC_Traders.pdf']);
  };

  return (
    <>
      <Header title="Create New Draft" subtitle="Fill in the details to start a new case draft" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Case Details Form */}
          <div className="bg-surface-light border border-border-default rounded-2xl p-8 shadow-card">
            <h2 className="text-xl font-serif text-text-heading mb-6">Case Details</h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading">Draft Title <span className="text-red-text">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. GST REG-17 Reply for ABC Traders"
                    className="w-full bg-background-light border border-border-default rounded-xl px-4 py-2.5 text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC Traders Pvt Ltd"
                    className="w-full bg-background-light border border-border-default rounded-xl px-4 py-2.5 text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading">Reference / Case Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ZA2710230000000"
                    className="w-full bg-background-light border border-border-default rounded-xl px-4 py-2.5 text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-background-light border border-border-default rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-heading">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the case or add instructions for the AI..."
                  className="w-full bg-background-light border border-border-default rounded-xl px-4 py-3 text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Category Selection (Optional) */}
          <div className="bg-surface-light border border-border-default rounded-2xl p-8 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-text-heading">Draft Category</h2>
              <span className="text-xs text-text-light bg-background-light px-2.5 py-1 rounded-full border border-border-subtle">Optional</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-primary bg-active-bg shadow-card-hover'
                        : 'border-border-default bg-surface-light hover:border-primary/50 hover:bg-background-light'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${isSelected ? 'bg-primary/10 text-primary' : cat.color} flex items-center justify-center mb-3 transition-colors`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-semibold text-sm mb-0.5 ${isSelected ? 'text-primary' : 'text-text-heading'}`}>{cat.name}</h3>
                    <p className="text-[11px] text-text-sub leading-snug">{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Upload (Optional) */}
          <div className="bg-surface-light border border-border-default rounded-2xl p-8 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-text-heading">Attach Files</h2>
              <span className="text-xs text-text-light bg-background-light px-2.5 py-1 rounded-full border border-border-subtle">Optional</span>
            </div>

            <div
              className="border-2 border-dashed border-border-default rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
              onClick={handleFakeUpload}
            >
              <div className="w-14 h-14 bg-background-light rounded-full flex items-center justify-center mb-4 group-hover:bg-surface-light group-hover:shadow-sm transition-all">
                <UploadCloud className="w-7 h-7 text-text-light group-hover:text-primary" />
              </div>
              <h3 className="text-base font-medium text-text-heading mb-1">Drag & drop files here</h3>
              <p className="text-text-sub text-sm max-w-sm">
                Upload notices, orders, or client data. PDF, DOCX, JPG. Max 50MB.
              </p>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mt-5 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border-subtle rounded-xl bg-background-light/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-soft text-red-text rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-heading">{file}</p>
                        <p className="text-[11px] text-text-light">2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-text" />
                      <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-text-light hover:text-red-text transition-colors p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="flex justify-end gap-3 pb-4">
            <Link
              href="/workspace"
              className="px-5 py-3 text-sm font-medium text-text-sub bg-surface-light border border-border-default rounded-xl hover:bg-background-light transition-colors"
            >
              Cancel
            </Link>
            <Link
              href="/workspace/editor"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-md transition-all bg-secondary text-secondary-text hover:bg-secondary-hover hover:-translate-y-0.5"
            >
              Create Draft
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
