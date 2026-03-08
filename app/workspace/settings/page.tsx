"use client";

import { useState } from 'react';
import { Bell, BarChart2, Globe } from 'lucide-react';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-primary' : 'bg-border-default'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [analysisNotifs, setAnalysisNotifs] = useState(true);
  const [draftAutoSave, setDraftAutoSave] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const prefs = [
    {
      icon: Bell,
      title: 'Analysis Notifications',
      desc: 'Get notified when an AI document analysis is complete.',
      value: analysisNotifs,
      onChange: setAnalysisNotifs,
    },
    {
      icon: BarChart2,
      title: 'Draft Auto-Save',
      desc: 'Automatically save draft changes every 5 seconds.',
      value: draftAutoSave,
      onChange: setDraftAutoSave,
    },
    {
      icon: Globe,
      title: 'Public Profile',
      desc: 'Allow clients to discover your profile via the directory.',
      value: publicProfile,
      onChange: setPublicProfile,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 scrollbar-thin bg-[#FAF9F5]">
        <div className="max-w-3xl mx-auto">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-[28px] font-serif text-text-heading tracking-tight">Settings</h1>
            <p className="text-text-sub mt-1">Control how TaxCopilot behaves for your workflow.</p>
          </div>

          {/* TaxCopilot Preferences */}
          <div className="bg-surface-light border border-border-subtle rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none" />

            <div className="relative z-10 mb-8">
              <h3 className="text-xl font-serif font-semibold text-text-heading mb-1.5">TaxCopilot Preferences</h3>
              <p className="text-sm text-text-sub max-w-lg">Control how your AI agent behaves across cases, and manage global visibility for your practice.</p>
            </div>

            <div className="space-y-2 relative z-10">
              {prefs.map(({ icon: Icon, title, desc, value, onChange }) => (
                <div key={title} className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border-default hover:bg-background-light/50 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-heading tracking-tight">{title}</p>
                      <p className="text-sm text-text-sub mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <Toggle value={value} onChange={onChange} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
