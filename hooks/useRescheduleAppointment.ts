import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rescheduleAppointment } from '@/lib/api/appointments';

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { start_time: string; end_time: string } }) =>
      rescheduleAppointment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['next-available'] });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['next-available'] });
    },
  });
}
