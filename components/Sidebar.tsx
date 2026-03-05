"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { env } from '@/lib/env';
import { useState } from 'react';
import {
  LayoutGrid,
  FolderOpen,
  FileText,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const navItems = [
    { name: 'Workspace', href: '/workspace', icon: LayoutGrid },
    { name: 'Upload', href: '/workspace/intake', icon: FolderOpen },
    { name: 'Documents', href: '/workspace/documents', icon: FileText },
    { name: 'Law Library', href: '/workspace/library', icon: BookOpen },
    { name: 'Trash', href: '/workspace/trash', icon: Trash2 },
  ];

  const isActive = (href: string) => {
    if (href === '/workspace') return pathname === '/workspace';
    return pathname.startsWith(href);
  };

  const avatarUrl = user?.avatarUrl
    ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${env.apiUrl}${user.avatarUrl}`)
    : null;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } flex-shrink-0 bg-sidebar-bg border-r border-slate-100 flex flex-col justify-between transition-all duration-300 z-20 h-screen sticky top-0 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 z-30 w-6 h-6 bg-surface-light border border-border-default rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-text-light hover:text-primary"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      <div>
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-xl flex-shrink-0">
              T
            </div>
            {!collapsed && (
              <span className="font-serif font-semibold text-lg tracking-tight text-text-heading">
                TaxCopilot
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  active
                    ? 'bg-active-bg text-primary font-semibold'
                    : 'text-text-sub hover:text-primary hover:bg-surface-light/60'
                }`}
              >
                <item.icon className="w-[22px] h-[22px] flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        {/* Settings */}
        <Link
          href="/workspace/settings"
          title={collapsed ? 'Settings' : undefined}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group mb-1 ${
            pathname === '/workspace/settings'
              ? 'bg-active-bg text-primary font-semibold'
              : 'text-text-sub hover:text-primary hover:bg-surface-light/60'
          }`}
        >
          <Settings className="w-[22px] h-[22px] flex-shrink-0" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </Link>

        {/* User Profile */}
        <div className="border-t border-border-default pt-4 mt-2">
          <Link href="/workspace/settings" className="flex items-center gap-3 px-2 group cursor-pointer">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || 'User'}
                className="w-9 h-9 rounded-full object-cover border border-surface-light shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 border border-surface-light shadow-sm">
                {initials}
              </div>
            )}
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-medium text-text-heading truncate group-hover:text-primary transition-colors">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-text-light truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => { logout(); window.location.href = '/login'; }}
              className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-all w-full text-left text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
