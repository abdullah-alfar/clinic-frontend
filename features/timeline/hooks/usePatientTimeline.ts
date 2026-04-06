import { useQuery } from '@tanstack/react-query';
import { fetchPatientTimeline } from '../api/timeline';

export const usePatientTimeline = (patientId: string, type?: string, limit?: number) => {
  return useQuery({
    queryKey: ['patient-timeline', patientId, type, limit],
    queryFn: () => fetchPatientTimeline(patientId, type, limit),
    enabled: !!patientId,
  });
};
