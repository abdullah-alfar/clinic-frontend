import { useQuery } from '@tanstack/react-query';
import { getAppointment } from '@/lib/api/appointments';

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => getAppointment(id),
    enabled: !!id,
    retry: 1,
  });
}
