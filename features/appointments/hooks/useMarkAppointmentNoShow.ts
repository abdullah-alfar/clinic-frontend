import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsNoShow } from '../api/appointments';
import { toast } from 'sonner';

export function useMarkAppointmentNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsNoShow(id),
    onSuccess: () => {
      toast.success('Appointment marked as no-show');
      // Invalidate both the calendar data and the general appointments reports
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['calendar'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || 'Failed to mark as no-show';
      toast.error(msg);
    },
  });
}
