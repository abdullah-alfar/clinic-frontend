import { apiClient } from '@/lib/api';
import { TimelineResponseDTO } from '../types';

export const fetchPatientTimeline = async (
  patientId: string,
  type?: string,
  limit?: number
): Promise<{ data: TimelineResponseDTO; message: string }> => {
  const url = new URL(`/api/v1/patients/${patientId}/timeline`, window.location.origin);
  if (type) url.searchParams.append('type', type);
  if (limit) url.searchParams.append('limit', limit.toString());

  const response = await apiClient.get<{ data: TimelineResponseDTO; message: string }>(
    url.pathname + url.search
  );
  return response.data;
};
