'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, setToken, isLoading, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle Google OAuth callback token
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && pathname === '/login') {
      setToken(token).then(() => {
        router.replace('/workspace');
      });
    }
  }, [searchParams, pathname, setToken, router]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Public routes that don't need auth
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect to login if not authenticated and not on a public route
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router]);

  // Show nothing while loading on protected routes
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-sub">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
