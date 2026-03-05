"use client";

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export function NavCTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return (
      <Link
        href="/workspace"
        className="bg-text-heading hover:bg-text-main text-surface-light px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all transform hover:-translate-y-0.5"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-text-heading hover:bg-text-main text-surface-light px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition-all transform hover:-translate-y-0.5"
    >
      Get Started
    </Link>
  );
}
