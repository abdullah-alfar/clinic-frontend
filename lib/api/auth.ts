import { apiClient } from './client';
import type { ApiResponse, User } from '@/types';

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
    '/auth/login',
    { email, password }
  );
  return data.data;
}

export async function getMe() {
  const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
  return data.data;
}

export async function refresh(refreshToken: string) {
  const { data } = await apiClient.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
    '/auth/refresh',
    { refresh_token: refreshToken }
  );
  return data.data;
}
