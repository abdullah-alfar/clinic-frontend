import { apiClient } from '@/lib/api/client';
import type { CalendarApiResponse, ReschedulePayload } from '../types';

export interface CalendarQueryParams {
  date_from: string;
  date_to: string;
  doctor_id?: string;
}

/**
 * Fetches enriched appointments (with patient and doctor names) for the calendar view.
 * Returns the raw CalendarApiResponse including the clinic timezone.
 */
export async function getCalendarAppointments(
  params: CalendarQueryParams
): Promise<CalendarApiResponse> {
  const { data } = await apiClient.get<CalendarApiResponse>(
    '/appointments/calendar',
    { params }
  );
  return data;
}

/**
 * Reschedules an appointment to a new time window.
 * Calls the dedicated /reschedule endpoint so business rules are applied server-side.
 */
export async function rescheduleCalendarAppointment(
  id: string,
  payload: ReschedulePayload
): Promise<void> {
  await apiClient.patch(`/appointments/${id}/reschedule`, payload);
}
