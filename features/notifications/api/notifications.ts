import { apiClient } from '@/lib/api/client';
import { type ApiResponse } from '@/types';
import { OutboundNotification } from '../types';

export async function getPatientNotificationHistory(
  patientId: string
): Promise<OutboundNotification[]> {
  const params = new URLSearchParams({ limit: '50' });
  const { data } = await apiClient.get<ApiResponse<OutboundNotification[]>>(
    `/patients/${patientId}/notifications?${params.toString()}`
  );
  return data.data ?? [];
}
