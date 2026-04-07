import { apiClient } from '@/lib/api/client';
import { TimelineResponseDTO } from '../types';

export const fetchPatientTimeline = async (
  patientId: string,
  type?: string,
  limit?: number
): Promise<{ data: TimelineResponseDTO; message: string }> => {
  const response = await apiClient.get<{ data: TimelineResponseDTO; message: string }>(
    `/patients/${patientId}/timeline`,
    {
      params: {
        type,
        limit,
      },
    }
  );
  return response.data;
};
