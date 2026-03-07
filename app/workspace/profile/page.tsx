"use client";

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/stores/authStore';
import { useDraftStore } from '@/stores/draftStore';
import { authService } from '@/services/authService';
import { documentService } from '@/services/documentService';
import {
    Camera, Save, Phone,
    Loader2, Check,
    Trash2, FolderOpen, ClipboardList,
} from 'lucide-react';

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className="block text-[11px] font-semibold text-text-light uppercase tracking-widest mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);
    const { drafts, fetchDrafts } = useDraftStore();

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [docCount, setDocCount] = useState<number | null>(null);

    useEffect(() => {
        fetchDrafts();
        documentService.listAnalysisFiles().then((files) => setDocCount(files.length)).catch(() => setDocCount(0));
    }, []);

    const avatarUrl = user?.avatarUrl
        ? (user.avatarUrl.startsWith('http')
            ? user.avatarUrl
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${user.avatarUrl}`)
        : null;

    const initials = user?.name
        ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    const memberYear = user?.createdAt
        ? new Date(user.createdAt).getFullYear()
        : new Date().getFullYear();

    const activeDrafts = drafts.filter((d) => d.status !== 'TRASH').length;

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            const updated = await authService.updateProfile({ name, phone });
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
            <Header title="Profile" subtitle="Manage your personal information and account details." />

            <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-28 pt-10 scrollbar-thin bg-background-light relative">
                {/* Decorative background glow */}
                <div className="absolute left-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
                
                <div className="max-w-3xl mx-auto space-y-8 relative z-10">

                    {/* ── Identity Card ── */}
                    <div className="bg-surface-light border border-border-subtle rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-20 pointer-events-none" />
                        
                        <div className="relative z-10 flex items-start justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-5">
                                {/* Avatar */}
                                <div className="relative group flex-shrink-0">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={user?.name || 'Avatar'} className="w-[72px] h-[72px] rounded-full object-cover border-2 border-border-default shadow" />
                                    ) : (
                                        <div className="w-[72px] h-[72px] rounded-full bg-primary/15 text-primary flex items-center justify-center text-xl font-bold border-2 border-primary/20 shadow">
                                            {initials}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        {uploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-text-heading">{user?.name || 'Your Name'}</h2>
                                    <p className="text-sm text-text-sub mt-0.5">{user?.email}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <span className="text-[11px] text-text-light">Member since {memberYear}</span>
                                        {user?.role === 'ADMIN' && (
                                            <span className="text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">Admin</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Activity stats */}
                            <div className="flex gap-4 flex-shrink-0">
                                <div className="text-center">
                                    <p className="text-2xl font-semibold text-text-heading">{activeDrafts}</p>
                                    <p className="text-[11px] text-text-light mt-0.5 flex items-center gap-1"><ClipboardList className="w-3 h-3" /> Drafts</p>
                                </div>
                                <div className="w-px bg-border-subtle" />
                                <div className="text-center">
                                    <p className="text-2xl font-semibold text-text-heading">{docCount ?? '—'}</p>
                                    <p className="text-[11px] text-text-light mt-0.5 flex items-center gap-1"><FolderOpen className="w-3 h-3" /> Analysed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Professional Information ── */}
                    <div className="bg-surface-light border border-border-subtle rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
                        <h3 className="text-lg font-serif font-semibold text-text-heading mb-6 relative z-10">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                            <Field label="Full Name" id="p-name">
                                <input
                                    id="p-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-border-default rounded-xl bg-background-light text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </Field>

                            <Field label="Email Address" id="p-email">
                                <input
                                    id="p-email"
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 border border-border-default rounded-xl bg-background-light text-text-light text-sm cursor-not-allowed shadow-sm"
                                />
                                <p className="text-[11px] text-text-light mt-1">Cannot be changed</p>
                            </Field>

                            <Field label="Phone Number" id="p-phone">
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-light" />
                                    <input
                                        id="p-phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-border-default rounded-xl bg-background-light text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                            </Field>
                        </div>
                    </div>

                    {/* ── Account Info ── */}
                    <div className="bg-surface-light border border-border-subtle rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden">
                        <h3 className="text-lg font-serif font-semibold text-text-heading mb-6 relative z-10">Account Status</h3>
                        <div className="space-y-2 relative z-10">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border-default hover:bg-background-light/50 transition-all duration-300">
                                <span className="text-sm font-medium text-text-sub">Sign-in method</span>
                                <span className="text-text-heading font-medium">
                                    {user?.provider === 'GOOGLE' ? '🔗 Google OAuth' : '📧 Email & Password'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border-default hover:bg-background-light/50 transition-all duration-300">
                                <span className="text-sm font-medium text-text-sub">Account role</span>
                                <span className="text-text-heading font-medium">{user?.role || 'USER'}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border-default hover:bg-background-light/50 transition-all duration-300">
                                <span className="text-sm font-medium text-text-sub">User ID</span>
                                <span className="text-xs font-mono text-text-light bg-background-light px-2 py-1 rounded-lg border border-border-subtle">{user?.id || '—'}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Danger Zone ── */}
                    <div className="bg-red-50/50 border border-red-200 rounded-3xl p-8 flex items-center justify-between gap-6 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-red-600 flex items-center gap-1.5"><Trash2 className="w-4 h-4" /> Delete Account</p>
                            <p className="text-xs text-red-400 mt-0.5">Permanently deletes your account, all drafts, and uploaded documents.</p>
                        </div>
                        <button className="flex-shrink-0 px-6 py-2.5 text-sm font-bold text-red-600 bg-white border border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all shadow-sm relative z-10">
                            Delete
                        </button>
                    </div>

                </div>
            </div>

            {/* ── Sticky Save Bar ── */}
            <div className="sticky bottom-0 bg-surface-light/80 backdrop-blur-md border-t border-border-subtle px-8 lg:px-12 py-5 flex items-center justify-end gap-4 z-20">
                <button
                    onClick={() => { setName(user?.name || ''); setPhone(user?.phone || ''); }}
                    className="px-5 py-2.5 text-sm font-medium text-text-sub border border-border-default rounded-xl hover:bg-background-light transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
