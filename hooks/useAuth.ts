'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login: storeLogin, register: storeRegister, logout: storeLogout } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    await storeLogin(email, password);
  }, [storeLogin]);

  const register = useCallback(async (email: string, name: string, password: string) => {
    await storeRegister(email, name, password);
  }, [storeRegister]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const googleLogin = useCallback(() => {
    window.location.href = authService.getGoogleAuthUrl();
  }, []);

  return { user, isAuthenticated, isLoading, login, register, logout, googleLogin };
}
