import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppointment } from '@/lib/api/appointments';
import axios from 'axios';

/** Safely extract a readable message from an Axios API error */
export function extractApiError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    // Backend returns { data, error, message } — the error field is a string from Go
    const payload = e.response?.data;
    if (payload) {
      if (typeof payload.error === 'string' && payload.error) return payload.error;
      if (typeof payload.message === 'string' && payload.message) return payload.message;
    }
    if (e.message) return e.message;
  }
  if (e instanceof Error) return e.message;
  return 'An unexpected error occurred.';
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['next-available'] });
    },
    onError: () => {
      // Refresh availability immediately so stale selected slots get cleared
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['next-available'] });
    },
  });
}
