import { useQuery } from '@tanstack/react-query';
import { getCalendarAppointments } from '../api/calendar-api';
import type { CalendarAppointment } from '../types';

interface UseCalendarAppointmentsResult {
  appointments: CalendarAppointment[];
  timezone: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Fetches enriched appointments for the calendar view.
 * Re-fetches automatically when the date range or doctor filter changes.
 */
export function useCalendarAppointments(
  dateFrom: string,
  dateTo: string,
  doctorId?: string
): UseCalendarAppointmentsResult {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['calendar-appointments', dateFrom, dateTo, doctorId],
    queryFn: () =>
      getCalendarAppointments({
        date_from: dateFrom,
        date_to: dateTo,
        doctor_id: doctorId,
      }),
    enabled: Boolean(dateFrom && dateTo),
    staleTime: 30_000, // 30s — calendar data is relatively stable
  });

  return {
    appointments: data?.data ?? [],
    timezone: data?.timezone ?? 'UTC',
    isLoading,
    isError,
    refetch,
  };
}
