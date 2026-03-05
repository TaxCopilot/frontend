"use client";

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export function LandingNav() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-primary font-serif font-bold text-xl">T</span>
        </div>
        <span className="text-xl font-bold text-text-heading tracking-tight">TaxCopilot</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-sub">
        <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
        <Link href="#workflow" className="hover:text-primary transition-colors">How it Works</Link>
        <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <Link href="/workspace" className="text-sm font-medium text-text-sub hover:text-primary transition-colors">Dashboard</Link>
        ) : (
          <Link href="/login" className="text-sm font-medium text-text-sub hover:text-primary transition-colors">Log in</Link>
        )}
        <Link
          href={isAuthenticated ? '/workspace' : '/login'}
          className="bg-text-heading hover:bg-text-main text-surface-light px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all transform hover:-translate-y-0.5"
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </Link>
      </div>
    </nav>
  );
}
