"use client";

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { ArrowRight } from 'lucide-react';

interface GetStartedLinkProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'block' | 'inline';
}

export function GetStartedLink({ children, className = '', variant = 'primary' }: GetStartedLinkProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const href = isAuthenticated ? '/workspace' : '/login';

  if (variant === 'primary') {
    return (
      <Link
        href={href}
        className={`w-full sm:w-auto bg-secondary hover:bg-secondary-hover text-secondary-text px-8 py-4 rounded-full text-lg font-semibold shadow-float transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${className}`}
      >
        {children}
        <ArrowRight className="w-5 h-5" />
      </Link>
    );
  }

  if (variant === 'block') {
    return (
      <Link
        href={href}
        className={`flex items-center justify-center gap-2 ${className}`}
      >
        {children}
        <ArrowRight className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
