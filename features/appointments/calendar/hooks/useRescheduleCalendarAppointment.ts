import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { rescheduleCalendarAppointment } from '../api/calendar-api';
import {
  RESCHEDULE_ERROR_MESSAGES,
  type RescheduleErrorCode,
} from '../types';
import type { AxiosError } from 'axios';

interface RescheduleVariables {
  id: string;
  start_time: string;
  end_time: string;
  /** FullCalendar revert callback — called when the backend rejects the drop. */
  revert: () => void;
}

interface ErrorResponse {
  message: string;
  error: { code: RescheduleErrorCode } | null;
}

/**
 * Mutation hook for drag-and-drop rescheduling.
 *
 * On success: invalidates calendar queries and shows a success toast.
 * On failure: calls the FullCalendar revert() to snap the event back,
 *             then shows a typed, human-readable error message.
 */
export function useRescheduleCalendarAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ErrorResponse>, RescheduleVariables>({
    mutationFn: ({ id, start_time, end_time }) =>
      rescheduleCalendarAppointment(id, { start_time, end_time }),

    onSuccess: (_data, _variables) => {
      // Invalidate all calendar date ranges so the UI stays fresh
      queryClient.invalidateQueries({ queryKey: ['calendar-appointments'] });
      toast.success('Appointment rescheduled successfully.');
    },

    onError: (error, variables) => {
      // Always revert the drag so the UI is not left in an inconsistent state
      variables.revert();

      const errorCode = error.response?.data?.error?.code;
      const message =
        errorCode && errorCode in RESCHEDULE_ERROR_MESSAGES
          ? RESCHEDULE_ERROR_MESSAGES[errorCode]
          : error.response?.data?.message ?? 'Failed to reschedule appointment.';

      toast.error(message);
    },
  });
}
