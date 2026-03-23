import { apiClient } from './client';
import type { ApiResponse, Notification } from '@/types';

export async function getNotifications(limit = 50) {
  const { data } = await apiClient.get<ApiResponse<Notification[]>>('/notifications', { params: { limit } });
  return data.data ?? [];
}

export async function markNotificationRead(id: string) {
  const { data } = await apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
  return data.data;
}
