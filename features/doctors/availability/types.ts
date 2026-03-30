export type ExceptionType = 'day_off' | 'override';

export interface ScheduleDTO {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface BreakDTO {
  id: string;
  schedule_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  label: string;
}

export interface ExceptionDTO {
  id: string;
  doctor_id: string;
  date: string; // YYYY-MM-DD
  type: ExceptionType;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}

export interface DoctorAvailabilityDTO {
  doctor_id: string;
  schedules: ScheduleDTO[];
  breaks: BreakDTO[];
  exceptions: ExceptionDTO[];
}

export interface CreateScheduleRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface UpdateScheduleRequest {
  start_time?: string;
  end_time?: string;
  is_active?: boolean;
}

export interface CreateBreakRequest {
  start_time: string;
  end_time: string;
  label: string;
}

export interface CreateExceptionRequest {
  date: string;
  type: ExceptionType;
  start_time?: string | null;
  end_time?: string | null;
  reason?: string | null;
}
