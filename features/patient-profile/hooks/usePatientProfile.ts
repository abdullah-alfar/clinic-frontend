import { useQuery } from '@tanstack/react-query';
import { fetchPatientProfile } from '../api/patient-profile';

export function usePatientProfile(id: string) {
  return useQuery({
    queryKey: ['patient-profile', id],
    queryFn: () => fetchPatientProfile(id),
    enabled: !!id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
