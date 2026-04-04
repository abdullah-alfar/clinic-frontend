import { apiClient } from '@/lib/api/client';
import type { ApiResponse, Appointment } from '@/types';

/**
 * Marks an appointment as a no-show.
 * Implementation of PATCH /api/v1/appointments/{id}/no-show
 */
export async function markAsNoShow(id: string): Promise<Appointment> {
  const { data } = await apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/no-show`);
  if (!data.data) {
    throw new Error(data.error || 'Failed to mark appointment as no-show');
  }
  return data.data;
}
