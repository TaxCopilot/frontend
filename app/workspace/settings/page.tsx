"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
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
      <Header title="Settings" subtitle="Control how TaxCopilot behaves for your workflow." />

      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-2xl mx-auto">

          {/* TaxCopilot Preferences */}
          <div className="bg-surface-light border border-border-default rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-text-heading mb-1">TaxCopilot Preferences</h3>
            <p className="text-xs text-text-light mb-4">Control how TaxCopilot behaves for your workflow.</p>

            <div className="divide-y divide-border-subtle">
              {prefs.map(({ icon: Icon, title, desc, value, onChange }) => (
                <div key={title} className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-text-light mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-text-heading">{title}</p>
                      <p className="text-xs text-text-sub mt-0.5">{desc}</p>
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
