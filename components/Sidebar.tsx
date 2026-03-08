"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Library,
  Settings,
  Menu,
  LogOut,
  Trash2,
  Plus,
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
  // `collapsed` drives GSAP; `visualCollapsed` drives CSS layout classes
  const [collapsed, setCollapsed] = useState(false);
  const [visualCollapsed, setVisualCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
        setVisualCollapsed(true);
      } else {
        setCollapsed(false);
        setVisualCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    // On expand: immediately apply expanded layout so text has space to grow into
    if (!next) setVisualCollapsed(false);
    // On collapse: visualCollapsed will be set to true after GSAP animation via onComplete
  };

  // Set initial GSAP state so it knows the baseline to tween from
  useGSAP(() => {
    gsap.set('.sidebar-text', { maxWidth: 300, opacity: 1, overflow: 'hidden' });
  }, { scope: sidebarRef, dependencies: [] });

  useGSAP(() => {
    if (!sidebarRef.current) return;

    const ctx = gsap.context(() => {
      if (collapsed) {
        // 1. Fade text out first
        // 2. Then shrink sidebar width
        // 3. Only AFTER width finishes, flip visualCollapsed → layout goes to icon-only
        const tl = gsap.timeline({
          onComplete: () => setVisualCollapsed(true),
        });
        // Animate gap to 0 simultaneously with text fade so icon never jumps
        tl.to('.sidebar-nav-link', {
          columnGap: 0,
          duration: 0.18,
          ease: 'power2.in',
        }, 0);
        tl.to('.sidebar-text', {
          opacity: 0,
          maxWidth: 0,
          duration: 0.18,
          ease: 'power2.in',
        }, 0).to(
          sidebarRef.current,
          {
            width: isMobile ? 76 : 76,
            duration: 0.28,
            ease: 'power2.inOut',
          },
          '-=0.05'
        );
      } else {
        // Layout already expanded (visualCollapsed=false set instantly in handleToggle)
        // Just grow the sidebar and fade text back in simultaneously
        const tl = gsap.timeline();
        tl.to('.sidebar-nav-link', {
          columnGap: 12, // gap-3 is 12px
          duration: 0.15,
          ease: 'power2.out',
        }, 0);
        tl.to(sidebarRef.current, {
          width: 280,
          duration: 0.25,
          ease: 'power2.out',
        }, 0).to(
          '.sidebar-text',
          {
            opacity: 1,
            maxWidth: 300,
            duration: 0.25,
            ease: 'power2.out',
          },
          '-=0.15'
        );
      }
    }, sidebarRef);

    return () => ctx.revert();
  }, [collapsed]);

  // Use visualCollapsed for all CSS layout classes to prevent premature centering
  const vc = visualCollapsed;

  return (
    <aside
      ref={sidebarRef}
      className={`flex-shrink-0 flex flex-col z-50 top-0 overflow-hidden transition-all duration-300 ${
        isMobile && collapsed
          ? 'absolute bg-transparent border-none pointer-events-none h-auto'
          : 'bg-[#F8F7F3] border-r border-[#e6e4dc] h-screen sticky relative pointer-events-auto max-md:absolute'
      }`}
      style={{ width: isMobile && collapsed ? 76 : 280 }}
    >
      <div className={`bg-transparent pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] ${vc ? 'mx-2 my-4 p-1.5 rounded-[24px]' : 'p-2 m-3 rounded-2xl'}`}>

        {/* ── Dark Header ── */}
        <div className={`flex items-center flex-shrink-0 transition-all duration-300 bg-primary ease-[cubic-bezier(0.87,0,0.13,1)] overflow-hidden ${vc ? 'w-[48px] h-[48px] justify-center rounded-[16px] px-0 mx-auto' : 'w-full h-[60px] justify-between rounded-2xl px-4'}`}>
          {!vc && (
            <div className="flex items-center sidebar-text whitespace-nowrap overflow-hidden">
              <Link href="/" className="flex items-center gap-3 group min-w-0 pr-2">
                <span className="font-semibold text-[17px] tracking-tight text-white/90 truncate">
                  TaxCopilot
                </span>
              </Link>
            </div>
          )}
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors w-10 h-10`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* ── Create Cards ── */}
        <div className={`pt-2 flex flex-col gap-2 relative pointer-events-auto transition-opacity duration-300 ${isMobile && collapsed ? 'opacity-0' : 'opacity-100'}`}>
          <div className={`sidebar-text flex gap-3 overflow-hidden ${vc ? 'pointer-events-none' : ''}`}>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex-1 flex flex-col justify-between items-start bg-white border border-dashed border-[#d1d5db] rounded-2xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden whitespace-nowrap"
            >
              <div className="w-full flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-sm font-semibold text-text-heading truncate">New Case</span>
                <Plus className="w-4 h-4 text-text-light flex-shrink-0" />
              </div>
            </button>
          </div>

          <div className={`absolute top-2 left-0 right-0 transition-opacity duration-300 ${vc ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center w-full h-[60px] border-2 border-dashed border-[#d1d5db] rounded-[20px] text-text-sub hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-6 h-6 text-text-sub" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Navigation List ── */}
      <div className={`flex-1 overflow-y-auto scrollbar-thin flex flex-col ${vc ? 'px-2' : 'px-3'} transition-all duration-300 pointer-events-auto ${isMobile && collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className={`flex flex-col gap-1 bg-transparent border border-transparent transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] ${vc ? 'rounded-[24px] p-1.5' : 'rounded-2xl'}`}>
          {navItems.map((item, i) => {
            const active = isActive(item.href);
            return (
              <div key={item.href} className={`transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] ${vc ? 'rounded-[20px] mb-1.5 relative group' : 'm-1 rounded-2xl'}`}>
                <Link
                  href={item.href}
                  title={vc ? item.name : undefined}
                  className={`sidebar-nav-link flex items-center transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group ${vc ? 'px-[13px] py-2 h-[44px]' : 'px-3 py-3 rounded-xl gap-3'} ${active ? 'bg-[#F9F8F4]' : 'hover:bg-[#F9F8F4]'}`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : 'text-text-sub group-hover:text-primary'} transition-all duration-300`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`sidebar-text text-[14px] font-medium leading-none whitespace-nowrap overflow-hidden transition-colors ${active ? 'text-text-heading' : 'text-text-sub group-hover:text-text-heading'}`}>
                    {item.name}
                  </span>
                </Link>
                {i < navItems.length - 1 && !vc && (
                  <div className="mx-4 border-b border-[#f3f4f6]" />
                )}
              </div>
            );
          })}

          {!vc && <div className="mx-4 border-b border-[#f3f4f6]" />}
          <div key="logout">
            <button
              onClick={handleLogout}
              title={vc ? 'Logout' : undefined}
              className={`sidebar-nav-link flex items-center w-full border-none bg-transparent transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group ${vc ? 'px-[13px] py-2 h-[44px]' : 'px-3 py-3 rounded-xl gap-3'}`}
            >
              <LogOut
                className={`w-5 h-5 flex-shrink-0 text-text-sub group-hover:text-red-500 transition-all duration-300`}
                strokeWidth={2}
              />
              <span className="sidebar-text text-[14px] font-medium leading-none text-text-sub group-hover:text-red-600 whitespace-nowrap overflow-hidden">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Download Buttons Area ── */}
      <div className={`flex flex-col gap-3 mt-auto flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] pointer-events-auto ${vc ? 'px-3 pb-6 items-center' : 'p-4 overflow-hidden'} ${isMobile && collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          title={vc ? 'Android' : undefined}
          className={`w-full rounded-[20px] bg-[#ebd5fc] hover:bg-[#e4c2f9] transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] text-[#6b21a8] font-semibold text-[13px] flex items-center justify-center ${vc ? 'h-[52px] p-0 gap-0' : 'py-3 px-3 gap-2'} overflow-hidden whitespace-nowrap`}
        >
          <Smartphone className={`flex-shrink-0 transition-all duration-300 ${vc ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <span className="sidebar-text truncate">Download Android app</span>
        </button>
        <button
          title={vc ? 'iOS' : undefined}
          className={`w-full rounded-[20px] bg-[#dcfce7] hover:bg-[#bbf7d0] transition-all duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] text-[#166534] font-semibold text-[13px] flex items-center justify-center ${vc ? 'h-[52px] p-0 gap-0' : 'py-3 px-3 gap-2'} overflow-hidden whitespace-nowrap`}
        >
          <Apple className={`flex-shrink-0 transition-all duration-300 ${vc ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <span className="sidebar-text truncate">Download iOS app</span>
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
