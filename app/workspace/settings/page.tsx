import { Header } from '@/components/Header';
import Image from 'next/image';
import { User, Bell, Shield, Key, CreditCard, Building, Mail, Phone, BadgeCheck, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">

          {/* Settings Nav Sidebar */}
          <div className="w-full md:w-60 flex-shrink-0 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-active-bg text-primary shadow-sm border border-primary/10">
              <User className="w-5 h-5" /> Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-sub hover:bg-background-light hover:text-text-heading transition-colors">
              <Shield className="w-5 h-5" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-sub hover:bg-background-light hover:text-text-heading transition-colors">
              <CreditCard className="w-5 h-5" /> Billing
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-sub hover:bg-background-light hover:text-text-heading transition-colors">
              <Bell className="w-5 h-5" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-sub hover:bg-background-light hover:text-text-heading transition-colors">
              <Building className="w-5 h-5" /> Integrations
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-text-sub hover:bg-background-light hover:text-text-heading transition-colors">
              <Key className="w-5 h-5" /> API Keys
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-8">

            {/* Profile Card */}
            <div className="bg-surface-light border border-border-default rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-serif text-text-heading mb-6">Profile Information</h2>

              {/* Avatar Section */}
              <div className="flex items-center gap-5 mb-8 pb-6 border-b border-border-subtle">
                <div className="relative">
                  <Image src="https://picsum.photos/seed/user/150/150" alt="Profile" width={80} height={80} referrerPolicy="no-referrer" className="w-20 h-20 rounded-2xl object-cover border-2 border-border-subtle shadow-sm" />
                  <button className="absolute -bottom-1 -right-1 bg-primary text-surface-light p-1.5 rounded-lg shadow-sm hover:bg-primary-dark transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-text-heading text-lg">Arjun Mehta</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">Verified Professional</span>
                  </div>
                  <button className="mt-2 text-sm text-text-sub font-medium hover:text-primary transition-colors">Change Photo</button>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading">Full Name</label>
                  <input type="text" defaultValue="Arjun Mehta" className="w-full bg-background-light border border-border-default rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-heading">CA Registration ID</label>
                  <input type="text" defaultValue="MCA-2019-0892" className="w-full bg-background-light border border-border-default rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-heading">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                    <input type="email" defaultValue="arjun.mehta@taxfirm.com" className="w-full bg-background-light border border-border-default rounded-xl pl-12 pr-4 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-text-heading">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-background-light border border-border-default rounded-xl pl-12 pr-4 py-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-surface-light border border-border-default rounded-2xl p-8 shadow-card">
              <h2 className="text-xl font-serif text-text-heading mb-6">Preferences</h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-text-heading">Two-Factor Authentication</h4>
                    <p className="text-sm text-text-sub mt-0.5">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-border-default peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-light after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-light after:border-border-default after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                <div className="border-t border-border-subtle" />

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-text-heading">Email Notifications</h4>
                    <p className="text-sm text-text-sub mt-0.5">Receive updates on draft status and new case laws</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-border-default peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-light after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-light after:border-border-default after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>

                <div className="border-t border-border-subtle" />

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium text-text-heading">AI Drafting Style</h4>
                    <p className="text-sm text-text-sub mt-0.5">Default tone for generated legal responses</p>
                  </div>
                  <select className="bg-background-light border border-border-default text-text-sub text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 cursor-pointer">
                    <option>Formal & Aggressive</option>
                    <option>Formal & Polite</option>
                    <option>Concise</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-surface-light border border-red-200 rounded-2xl p-8 shadow-card">
              <h2 className="text-lg font-semibold text-red-text mb-2">Danger Zone</h2>
              <p className="text-sm text-text-sub mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <button className="flex items-center gap-2 text-sm font-medium bg-red-soft text-red-text border border-red-200 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button className="px-5 py-2.5 text-sm font-medium text-text-sub bg-surface-light border border-border-default rounded-xl hover:bg-background-light transition-colors">
                Cancel
              </button>
              <button className="px-5 py-2.5 text-sm font-bold text-secondary-text bg-secondary hover:bg-secondary-hover rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
