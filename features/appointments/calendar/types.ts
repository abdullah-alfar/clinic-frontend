import type { AppointmentStatus } from '@/types';

/** Enriched appointment returned by the calendar endpoint. */
export interface CalendarAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  status: AppointmentStatus;
  start_time: string; // ISO 8601 UTC
  end_time: string;   // ISO 8601 UTC
  reason: string | null;
}

/** Top-level envelope from GET /appointments/calendar */
export interface CalendarApiResponse {
  data: CalendarAppointment[];
  timezone: string;
  message: string;
  error: string | null;
}

/** Payload sent to PATCH /appointments/{id}/reschedule */
export interface ReschedulePayload {
  start_time: string; // ISO 8601
  end_time: string;
}

/** Typed error codes returned by the reschedule endpoint. */
export type RescheduleErrorCode =
  | 'DOUBLE_BOOKING'
  | 'OUTSIDE_AVAILABILITY'
  | 'NOT_MUTABLE'
  | 'PAST_APPOINTMENT'
  | 'INVALID_TIME'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

/** Human-readable messages for each backend error code. */
export const RESCHEDULE_ERROR_MESSAGES: Record<RescheduleErrorCode, string> = {
  DOUBLE_BOOKING: 'This time slot is already booked for the doctor.',
  OUTSIDE_AVAILABILITY: "This time is outside the doctor's available hours.",
  NOT_MUTABLE: 'Completed or cancelled appointments cannot be rescheduled.',
  PAST_APPOINTMENT: 'Cannot move an appointment to a past time.',
  INVALID_TIME: 'The selected time range is invalid.',
  NOT_FOUND: 'Appointment not found.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
};
