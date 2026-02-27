import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  provider: string;
  phone?: string;
  registrationId?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async register(email: string, name: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/register', { email, name, password });
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },

  getGoogleAuthUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}/api/auth/google`;
  },

  async getMe(): Promise<{ user: User }> {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  async updateProfile(payload: { name?: string; phone?: string; registrationId?: string }): Promise<User> {
    const { data } = await api.put('/api/users/me', payload);
    return data.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/api/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};
