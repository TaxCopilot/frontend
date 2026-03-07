"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  FolderOpen,
  FileText,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Trash2,
  UserCircle,
  ChevronUp,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
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

  // Close profile popover on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [profileOpen]);

  const avatarUrl = user?.avatarUrl
    ? user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${user.avatarUrl}`
    : null;

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const NavLink = ({ item }: { item: (typeof navItems)[0] }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        title={collapsed ? item.name : undefined}
        className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-150 group ${collapsed ? 'justify-center' : ''}`}
      >
        <span
          className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all duration-150 ${active
            ? 'bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20'
            : 'text-text-sub group-hover:bg-aqua-light/70 group-hover:text-primary'
          }`}
        >
          <item.icon className="w-[17px] h-[17px]" strokeWidth={active ? 2.2 : 1.8} />
        </span>
        {!collapsed && (
          <span className={`text-[13px] font-medium leading-none transition-colors ${active ? 'text-primary' : 'text-text-sub group-hover:text-primary'}`}>
            {item.name}
          </span>
        )}
        {active && !collapsed && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        )}
      </Link>
    );
  };

  const isSettingsActive = pathname === '/workspace/settings';

  return (
    <aside
      className={`${collapsed ? 'w-[68px]' : 'w-[220px]'
        } flex-shrink-0 bg-sidebar-bg border-r border-border-default flex flex-col transition-all duration-300 z-20 h-screen sticky top-0 relative`}
    >
      {/* Logo + Toggle Row */}
      <div className={`h-[60px] flex items-center border-b border-border-default flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        <Link href="/" className="flex items-center gap-2.5 group flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-serif font-bold text-sm flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
            T
          </div>
          {!collapsed && (
            <span className="font-serif font-semibold text-[15px] tracking-tight text-text-heading truncate">
              TaxCopilot
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex-shrink-0 w-7 h-7 rounded-lg border border-border-default bg-surface-light flex items-center justify-center text-text-light hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-4 flex flex-col gap-6">
        {/* ── MAIN MENU ── */}
        <div className="px-3">
          {!collapsed && (
            <p className="px-2 mb-2 text-[10px] font-bold tracking-[0.14em] text-text-light uppercase select-none">
              Main Menu
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        {/* Push to bottom container */}
        <div className="mt-auto pt-4">
          {/* Divider */}
          {!collapsed && <div className="mx-4 mb-4 border-t border-border-subtle" />}

          {/* ── Settings ── */}
          <div className="px-3">
            <Link
              href="/workspace/settings"
              title={collapsed ? 'Settings' : undefined}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-150 group ${collapsed ? 'justify-center' : ''}`}
            >
              <span className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all ${isSettingsActive
                ? 'bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20'
                : 'text-text-sub group-hover:bg-aqua-light/70 group-hover:text-primary'
              }`}>
                <Settings className="w-[17px] h-[17px]" strokeWidth={isSettingsActive ? 2.2 : 1.8} />
              </span>
              {!collapsed && (
                <span className={`text-[13px] font-medium leading-none transition-colors ${isSettingsActive ? 'text-primary' : 'text-text-sub group-hover:text-primary'}`}>
                  Settings
                </span>
              )}
              {isSettingsActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── User Profile Card (with popover) ── */}
      <div className={`border-t border-border-default flex-shrink-0 ${collapsed ? 'p-2' : 'p-3'} relative`} ref={profileRef}>
        {/* Profile Popover Panel */}
        {profileOpen && (
          <div className={`absolute bottom-full mb-2 ${collapsed ? 'left-full ml-2 bottom-0' : 'left-3 right-3'} bg-surface-light border border-border-default rounded-2xl shadow-xl py-2 z-50 overflow-hidden`}>
            {/* User info header inside popover */}
            {!collapsed && (
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-[13px] font-semibold text-text-heading truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-text-light truncate mt-0.5">{user?.email || ''}</p>
              </div>
            )}
            <div className="py-1">
              <Link
                href="/workspace/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <UserCircle className="w-4 h-4 flex-shrink-0" />
                <span>View Profile</span>
              </Link>
              <Link
                href="/workspace/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span>Settings</span>
              </Link>
              <div className="mx-3 my-1 border-t border-border-subtle" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Trigger button */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className={`flex items-center gap-2.5 group cursor-pointer rounded-xl p-2 transition-all hover:bg-primary/5 w-full ${collapsed ? 'justify-center' : ''} ${profileOpen ? 'bg-primary/5 ring-1 ring-primary/20' : ''}`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-border-default shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 border border-primary/20">
              {initials}
            </div>
          )}
          {!collapsed && (
            <>
              <div className="overflow-hidden flex-1 min-w-0 text-left">
                <p className="text-[12.5px] font-semibold text-text-heading truncate group-hover:text-primary transition-colors leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-text-light truncate leading-tight mt-0.5">
                  {user?.email || ''}
                </p>
              </div>
              <ChevronUp className={`w-3.5 h-3.5 text-text-light flex-shrink-0 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
