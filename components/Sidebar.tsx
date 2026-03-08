"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Library,
  Settings,
  Menu,
  LogOut,
  Trash2,
  ChevronRight,
  Plus,
  Compass,
  Bot,
  Apple,
  Smartphone,
  FileChartColumnIncreasing,
  CircleUserRound
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { CreateCaseModal } from '@/components/CreateCaseModal';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const navItems = [
    { name: 'Cases', href: '/workspace', icon: FileChartColumnIncreasing },
    { name: 'Library', href: '/workspace/library', icon: Library },
    { name: 'Profile', href: '/workspace/profile', icon: CircleUserRound },
    { name: 'Settings', href: '/workspace/settings', icon: Settings },
    { name: 'Trash', href: '/workspace/trash', icon: Trash2 },
  ];

  const isActive = (href: string) => {
    if (href === '/workspace') return pathname === '/workspace';
    return pathname.startsWith(href);
  };


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
      className={`${collapsed ? 'w-[76px]' : 'w-[280px]'
        } flex-shrink-0 bg-[#F8F7F3] border-r border-[#e6e4dc] flex flex-col transition-all duration-300 z-20 h-screen sticky top-0 relative`}
    >

      <div className={`bg-transparent transition-all duration-300 ${collapsed ? 'mx-2 my-4 p-1.5 rounded-[24px]' : 'p-2 m-3 rounded-2xl'}`}>

        {/* ── Dark Header ── */}
        <div className={`${collapsed ? 'aspect-square justify-center rounded-[20px]' : 'h-[60px] px-4 justify-between rounded-2xl'} bg-primary flex items-center flex-shrink-0 transition-all duration-300`}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 group min-w-0">
              <span className="font-semibold text-[17px] tracking-tight text-white/90 truncate">
                TaxCopilot
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex-shrink-0 ${collapsed ? 'w-full h-full' : 'w-8 h-8 ml-2'} rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors`}
          >
            <Menu className={collapsed ? "w-6 h-6" : "w-5 h-5"} />
          </button>
        </div>

        {/* ── Create Cards ── */}
        <div className={`pt-2 ${collapsed ? 'hidden' : 'flex'} gap-3`}>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 flex flex-col justify-between items-start bg-white border border-dashed border-[#d1d5db] rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >

            <div className="w-full flex items-center justify-between">
              <span className="text-sm font-semibold text-text-heading">Create</span>
              <Plus className="w-4 h-4 text-text-light" />
            </div>
          </button>
        </div>

        {collapsed && (
          <div className="flex flex-col gap-2 pt-1.5">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center w-full aspect-square border-2 border-dashed border-[#d1d5db] rounded-[20px] text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-6 h-6 text-text-sub" />
            </button>
          </div>
        )}
      </div>


      {/* ── Navigation List ── */}
      <div className={`flex-1 overflow-y-auto scrollbar-thin flex flex-col ${collapsed ? 'px-2' : 'px-3'}`}>
        <div className={`flex flex-col gap-1 bg-transparent border border-transparent transition-all duration-300 ${collapsed ? 'rounded-[24px] p-1.5' : 'rounded-2xl'}`}>
          {navItems.map((item, i) => {
            const active = isActive(item.href);
            return (
              <div key={item.href} className={`transition-all duration-300 ${collapsed ? 'rounded-[20px] mb-1.5 relative group' : 'm-1 rounded-2xl'}`}>
                <Link
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-4 transition-all group ${collapsed ? 'justify-center aspect-square' : 'px-3 py-3 rounded-xl'} ${active ? 'bg-[#F9F8F4]' : 'hover:bg-[#F9F8F4]'} `}
                >
                  <item.icon className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-[20px] h-[20px]'} ${active ? 'text-primary' : 'text-text-sub group-hover:text-primary'} transition-all`} strokeWidth={active ? 2.5 : 2} />
                  {!collapsed && (
                    <span className={`text-[14px] font-medium leading-none ${active ? 'text-text-heading' : 'text-text-sub group-hover:text-text-heading'}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
                {/* Subtle divider */}
                {i < navItems.length - 1 && !collapsed && (
                  <div className="mx-4 border-b border-[#f3f4f6]" />
                )}
              </div>
            );
          })}

          {!collapsed && <div className="mx-4 border-b border-[#f3f4f6]" />}
          <div key="logout">
            <button
              onClick={handleLogout}
              title={collapsed ? 'Logout' : undefined}
              className={`flex items-center gap-4 w-full border-none bg-transparent transition-all group ${collapsed ? 'justify-center aspect-square' : 'px-3 py-3 rounded-xl'}`}
            >
              <LogOut className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-[20px] h-[20px]'} text-text-sub group-hover:text-red-500`} strokeWidth={2} />
              {!collapsed && (
                <span className="text-[14px] font-medium leading-none text-text-sub group-hover:text-red-600">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* ── Download Buttons Area ── */}
      <div className={`flex flex-col gap-3 mt-auto flex-shrink-0 transition-all duration-300 ${collapsed ? 'px-3 pb-6 items-center' : 'p-4'}`}>
        <button title={collapsed ? "Android" : undefined} className={`w-full rounded-[20px] bg-[#ebd5fc] hover:bg-[#e4c2f9] transition-colors text-[#6b21a8] font-semibold text-[13px] flex items-center justify-center gap-2 ${collapsed ? 'aspect-square p-0' : 'py-3'}`}>
          <Smartphone className={collapsed ? "w-5 h-5" : "w-4 h-4"} />
          {!collapsed && 'Download Android app'}
        </button>
        <button title={collapsed ? "iOS" : undefined} className={`w-full rounded-[20px] bg-[#dcfce7] hover:bg-[#bbf7d0] transition-colors text-[#166534] font-semibold text-[13px] flex items-center justify-center gap-2 ${collapsed ? 'aspect-square p-0' : 'py-3'}`}>
          <Apple className={collapsed ? "w-5 h-5" : "w-4 h-4"} />
          {!collapsed && 'Download iOS app'}
        </button>
      </div>

      <CreateCaseModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={(caseId) => {
          setCreateModalOpen(false);
          router.push(`/workspace/case/${caseId}`);
        }}
      />
    </aside>
  );
}
