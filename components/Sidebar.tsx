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

  const isSettingsActive = pathname === '/workspace/settings';

  const NavItem = ({ item }: { item: (typeof navItems)[0] }) => {
    const active = isActive(item.href);
    return (
      <Link
        href={item.href}
        title={item.name}
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group ${collapsed ? 'justify-center' : ''
          } ${active
            ? 'bg-primary/10 text-primary'
            : 'text-text-light hover:text-text-sub hover:bg-aqua-light/50'
          }`}
      >
        <item.icon
          className="w-4 h-4 flex-shrink-0"
          strokeWidth={active ? 2.2 : 1.7}
        />
        {!collapsed && (
          <span className={`text-[12.5px] font-medium leading-none truncate ${active ? 'text-primary' : ''}`}>
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`${collapsed ? 'w-[52px]' : 'w-[192px]'
        } flex-shrink-0 bg-sidebar-bg border-r border-border-default flex flex-col transition-all duration-250 h-screen sticky top-0`}
    >
      {/* Logo row */}
      <div className={`h-[52px] flex items-center border-b border-border-default flex-shrink-0 ${collapsed ? 'justify-center px-2' : 'px-3'}`}>
        <Link href="/" className="flex items-center gap-2 group flex-1 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
            T
          </div>
          {!collapsed && (
            <span className="font-semibold text-[13.5px] tracking-tight text-text-heading truncate">
              TaxCopilot
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
          className="flex-shrink-0 w-6 h-6 rounded-md border border-border-default bg-surface-light flex items-center justify-center text-text-light hover:text-primary hover:border-primary/30 transition-all"
        >
          {collapsed
            ? <ChevronRight className="w-3 h-3" />
            : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 flex flex-col gap-4">
        {/* Main */}
        <div className="flex flex-col gap-0.5">
          {!collapsed && (
            <p className="px-2.5 mb-1 text-[9.5px] font-bold tracking-[0.13em] text-text-light uppercase select-none">
              Menu
            </p>
          )}
          {navItems.map((item) => <NavItem key={item.href} item={item} />)}
        </div>

        <div className="border-t border-border-subtle mx-1" />

        {/* Settings */}
        <div className="flex flex-col gap-0.5">
          {!collapsed && (
            <p className="px-2.5 mb-1 text-[9.5px] font-bold tracking-[0.13em] text-text-light uppercase select-none">
              Settings
            </p>
          )}
          <Link
            href="/workspace/settings"
            title="Settings"
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group ${collapsed ? 'justify-center' : ''
              } ${isSettingsActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-light hover:text-text-sub hover:bg-aqua-light/50'
              }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" strokeWidth={isSettingsActive ? 2.2 : 1.7} />
            {!collapsed && (
              <span className={`text-[12.5px] font-medium leading-none ${isSettingsActive ? 'text-primary' : ''}`}>
                Settings
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* User footer */}
      <div className={`border-t border-border-default flex-shrink-0 px-2 py-2 flex flex-col gap-0.5`}>
        <Link
          href="/workspace/settings"
          title={user?.name || 'Profile'}
          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-primary/5 transition-all group ${collapsed ? 'justify-center' : ''}`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name || 'User'}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col overflow-hidden flex-1 min-w-0">
              <span className="text-[12px] font-medium text-text-heading truncate group-hover:text-primary transition-colors leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-[10.5px] text-text-light truncate leading-tight">
                {user?.email || ''}
              </span>
            </div>
          )}
        </Link>

        <button
          onClick={() => { logout(); window.location.href = '/login'; }}
          title="Logout"
          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-all w-full text-[12px] font-medium ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
