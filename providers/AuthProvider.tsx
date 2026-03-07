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

  // Show skeleton while loading on protected routes (avoids flash of login page)
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-background-light animate-pulse">
        <div className="h-16 bg-surface-light border-b border-border-subtle flex items-center px-6">
          <div className="h-6 bg-background-light rounded w-32" />
        </div>
        <div className="flex-1 p-8 flex flex-col gap-6">
          <div className="h-8 bg-surface-light rounded-lg w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-surface-light rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
