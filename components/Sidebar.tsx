"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
    ? (user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${user.avatarUrl}`)
    : null;

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

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
          <span
            className={`text-[13px] font-medium leading-none transition-colors ${active ? 'text-primary' : 'text-text-sub group-hover:text-primary'
              }`}
          >
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
  const isProfileActive = pathname === '/workspace/profile';

  return (
    <aside
      className={`${collapsed ? 'w-[68px]' : 'w-[220px]'
        } flex-shrink-0 bg-sidebar-bg border-r border-border-default flex flex-col transition-all duration-300 z-20 h-screen sticky top-0 relative`}
    >
      {/* Logo + Toggle Row */}
      <div
        className={`h-[60px] flex items-center border-b border-border-default flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-4'
          }`}
      >
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
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex-shrink-0 w-7 h-7 rounded-lg border border-border-default bg-surface-light flex items-center justify-center text-text-light hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
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

        {/* Divider */}
        {!collapsed && <div className="mx-4 border-t border-border-subtle" />}

        {/* ── SETTINGS ── */}
        <div className="px-3">
          {!collapsed && (
            <p className="px-2 mb-2 text-[10px] font-bold tracking-[0.14em] text-text-light uppercase select-none">
              Settings
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {/* Profile */}
            <Link
              href="/workspace/profile"
              title={collapsed ? 'Profile' : undefined}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-150 group ${collapsed ? 'justify-center' : ''}`}
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all ${isProfileActive
                  ? 'bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-text-sub group-hover:bg-aqua-light/70 group-hover:text-primary'
                  }`}
              >
                <UserCircle className="w-[17px] h-[17px]" strokeWidth={isProfileActive ? 2.2 : 1.8} />
              </span>
              {!collapsed && (
                <span className={`text-[13px] font-medium leading-none transition-colors ${isProfileActive ? 'text-primary' : 'text-text-sub group-hover:text-primary'}`}>
                  Profile
                </span>
              )}
              {isProfileActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </Link>

            {/* Settings */}
            <Link
              href="/workspace/settings"
              title={collapsed ? 'Settings' : undefined}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-150 group ${collapsed ? 'justify-center' : ''}`}
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 transition-all ${isSettingsActive
                  ? 'bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-text-sub group-hover:bg-aqua-light/70 group-hover:text-primary'
                  }`}
              >
                <Settings
                  className="w-[17px] h-[17px]"
                  strokeWidth={isSettingsActive ? 2.2 : 1.8}
                />
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

      {/* ── User Profile ── */}
      <div
        className={`border-t border-border-default flex-shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}
      >
        <Link
          href="/workspace/profile"
          className={`flex items-center gap-2.5 group cursor-pointer rounded-xl p-2 transition-all hover:bg-primary/5 ${collapsed ? 'justify-center' : ''}`}
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
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-text-heading truncate group-hover:text-primary transition-colors leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-text-light truncate leading-tight mt-0.5">
                {user?.email || ''}
              </p>
            </div>
          )}
        </Link>

        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 mt-1 rounded-xl text-text-light hover:text-red-500 hover:bg-red-50 transition-all w-full text-left text-[12.5px] font-medium ${collapsed ? 'justify-center px-2' : ''
            }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
