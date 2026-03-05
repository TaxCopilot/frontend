"use client";

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { env } from '@/lib/env';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { Camera, Save, User, Mail, Phone, FileText, Shield, Loader2, Check } from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [registrationId, setRegistrationId] = useState(user?.registrationId || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarUrl = user?.avatarUrl
    ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${env.apiUrl}${user.avatarUrl}`)
    : null;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await authService.updateProfile({ name, phone, registrationId });
      useAuthStore.setState({ user: { ...user!, ...updated } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await authService.uploadAvatar(file);
      useAuthStore.setState({ user: { ...user!, ...updated } });
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" subtitle="Manage your profile and preferences" />
      <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-12 pt-8 scrollbar-thin">
        <div className="max-w-3xl mx-auto">

          {/* Tabs */}
          <div className="flex gap-1 bg-background-light rounded-xl p-1 border border-border-subtle mb-8 w-fit">
            <button onClick={() => setActiveTab('profile')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-surface-light shadow-sm text-primary' : 'text-text-sub hover:text-text-heading'}`}>
              Profile
            </button>
            <button onClick={() => setActiveTab('account')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'account' ? 'bg-surface-light shadow-sm text-primary' : 'text-text-sub hover:text-text-heading'}`}>
              Account
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-surface-light rounded-2xl border border-border-subtle p-6">
                <h3 className="text-sm font-semibold text-text-heading mb-4">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={user?.name || 'Avatar'} className="w-20 h-20 rounded-2xl object-cover border border-border-default shadow-sm" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border border-border-default shadow-sm">
                        {initials}
                      </div>
                    )}
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-heading">{user?.name}</p>
                    <p className="text-xs text-text-light mt-0.5">{user?.email}</p>
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="mt-3 text-xs font-medium text-primary hover:text-primary-dark transition-colors disabled:opacity-50">
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="bg-surface-light rounded-2xl border border-border-subtle p-6">
                <h3 className="text-sm font-semibold text-text-heading mb-5">Personal Information</h3>
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-text-heading mb-1.5" htmlFor="settings-name">
                      <User className="w-3.5 h-3.5 text-text-light" /> Full Name
                    </label>
                    <input id="settings-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-text-heading mb-1.5" htmlFor="settings-email">
                      <Mail className="w-3.5 h-3.5 text-text-light" /> Email Address
                    </label>
                    <input id="settings-email" type="email" value={user?.email || ''} disabled
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-light text-sm cursor-not-allowed" />
                    <p className="text-xs text-text-light mt-1 ml-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-text-heading mb-1.5" htmlFor="settings-phone">
                      <Phone className="w-3.5 h-3.5 text-text-light" /> Phone Number
                    </label>
                    <input id="settings-phone" type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-text-heading mb-1.5" htmlFor="settings-regid">
                      <FileText className="w-3.5 h-3.5 text-text-light" /> Registration / Enrollment ID
                    </label>
                    <input id="settings-regid" type="text" placeholder="e.g. CA Registration Number" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </button>
                  {saved && <span className="text-xs text-green-600">Profile updated successfully</span>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-surface-light rounded-2xl border border-border-subtle p-6">
              <h3 className="text-sm font-semibold text-text-heading mb-3">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-text-light" />
                    <span className="text-sm text-text-heading">Auth Provider</span>
                  </div>
                  <span className="text-sm text-text-sub bg-background-light px-3 py-1 rounded-lg border border-border-subtle">
                    {user?.provider === 'GOOGLE' ? '🔗 Google' : '📧 Email'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-text-light" />
                    <span className="text-sm text-text-heading">Role</span>
                  </div>
                  <span className="text-sm text-text-sub bg-background-light px-3 py-1 rounded-lg border border-border-subtle">{user?.role || 'USER'}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-text-light" />
                    <span className="text-sm text-text-heading">User ID</span>
                  </div>
                  <span className="text-xs text-text-light font-mono bg-background-light px-3 py-1 rounded-lg border border-border-subtle">{user?.id || '—'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
