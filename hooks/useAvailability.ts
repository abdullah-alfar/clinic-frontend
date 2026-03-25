import { useQuery } from '@tanstack/react-query';
import { getAvailability, getNextAvailable } from '@/lib/api/appointments';

interface UseAvailabilityArgs {
  date_from?: string;
  date_to?: string;
  date?: string;
  doctor_id?: string;
  enabled?: boolean;
}

export function useAvailability({ enabled = true, ...params }: UseAvailabilityArgs) {
  return useQuery({
    queryKey: ['availability', params],
    queryFn: () => getAvailability(params),
    enabled,
  });
}

export function useNextAvailable(doctor_id?: string, enabled = true) {
  return useQuery({
    queryKey: ['next-available', doctor_id],
    queryFn: () => getNextAvailable(doctor_id),
    enabled,
    retry: false, // Don't retry if naturally 404 (no slots)
  });
}
