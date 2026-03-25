import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/lib/api/appointments';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['next-available'] });
    },
  });
}
