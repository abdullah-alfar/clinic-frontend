export interface PatientDTO {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  created_at: string;
}

export interface PatientSummary {
  last_visit_at: string | null;
  upcoming_appointment_at: string | null;
  preferred_doctor_id: string | null;
  preferred_doctor_name: string;
  total_appointments: number;
  completed_appointments: number;
  canceled_appointments: number;
  no_show_count: number;
  total_invoices: number;
  unpaid_invoices_count: number;
  attachments_count: number;
  medical_records_count: number;
  average_rating_given: number | null;
}

export interface PatientFlag {
  type: 'alert' | 'medical' | 'billing' | 'info';
  label: string;
}

export interface RecentActivity {
  type: 'appointment' | 'medical_record' | 'report' | 'invoice' | 'communication';
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  status: string;
}

export interface PatientRecentActivity {
  appointments: RecentActivity[];
  medical_records: RecentActivity[];
  reports: RecentActivity[];
  invoices: RecentActivity[];
  communications: RecentActivity[];
}

export interface PatientProfileData {
  patient: PatientDTO;
  summary: PatientSummary;
  flags: PatientFlag[];
  recent_activity: PatientRecentActivity;
}

export interface PatientProfileResponse {
  data: PatientProfileData;
  message: string;
  error: string | null;
}
