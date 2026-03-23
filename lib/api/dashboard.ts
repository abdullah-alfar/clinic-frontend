import { apiClient } from './client';
import type { ApiResponse, DashboardSummary } from '@/types';

export async function getDashboardSummary() {
  const { data } = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
  return data.data;
}
