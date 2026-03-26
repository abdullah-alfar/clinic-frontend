export type UserRole = 'admin' | 'doctor' | 'receptionist';

export interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  subdomain: string;
  name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  border_radius: string;
  font_family: string;
}

export interface Patient {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  tenant_id: string;
  user_id?: string;
  full_name: string;
  specialty: string;
  license_number: string;
  created_at: string;
  updated_at: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'canceled';

export interface Appointment {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  status: AppointmentStatus;
  start_time: string;
  end_time: string;
  reason: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type NotificationStatus = 'pending' | 'sent' | 'read';

export interface Notification {
  id: string;
  tenant_id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  status: NotificationStatus;
  related_entity_type?: string;
  related_entity_id?: string;
  scheduled_for?: string;
  sent_at?: string;
  read_at?: string;
  created_at: string;
}

export interface DashboardSummary {
  total_patients: number;
  total_doctors: number;
  appointments_today: number;
  upcoming_appointments: number;
  completed_appointments: number;
  canceled_appointments: number;
}

export interface ApiResponse<T> {
  data: T;
  timezone?: string;
  message: string;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type SlotStatus = 'available' | 'booked' | 'unavailable';

export interface Slot {
  start_time: string;
  end_time: string;
  status: SlotStatus;
}

export interface DoctorAvailabilityResponse {
  doctor_id: string;
  doctor_name: string;
  slots: Slot[];
}

export interface Visit {
  id: string;
  tenant_id: string;
  patient_id: string;
  appointment_id?: string;
  doctor_id: string;
  notes: string;
  diagnosis: string;
  prescription: string;
  created_at: string;
}

export interface TimelineResponse {
  appointments: Appointment[];
  visits: Visit[];
  notes: Visit[];
}
