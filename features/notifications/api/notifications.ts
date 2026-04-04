import { apiClient } from '@/lib/api/client';
import { OutboundNotification } from '../types';

export async function getPatientNotificationHistory(
  patientId: string
): Promise<OutboundNotification[]> {
  const params = new URLSearchParams({ limit: '50' });
  const response = await apiClient.get<OutboundNotification[]>(
    `/patients/${patientId}/notifications?${params.toString()}`
  );
  return response || [];
}
