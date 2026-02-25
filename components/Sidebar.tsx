"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutGrid,
  FolderOpen,
  Library,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Workspace', href: '/workspace', icon: LayoutGrid },
    { name: 'Cases', href: '/workspace/intake', icon: FolderOpen },
    { name: 'Law Library', href: '/workspace/library', icon: Library },
    { name: 'Reports', href: '/workspace/reports', icon: BarChart2 },
  ];

  const isActive = (href: string) => {
    if (href === '/workspace') return pathname === '/workspace';
    return pathname.startsWith(href);
  };

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
        <div className="border-t border-border-default pt-4 mt-2 flex items-center gap-3 px-2">
          <Image
            src="https://picsum.photos/seed/user/100/100"
            alt="User Profile"
            width={36}
            height={36}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-surface-light shadow-sm flex-shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-text-heading truncate">
                Arjun Mehta
              </p>
              <p className="text-xs text-text-light truncate">
                Chartered Accountant
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
