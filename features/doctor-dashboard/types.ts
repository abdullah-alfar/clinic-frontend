export interface DoctorSummary {
  id: string;
  full_name: string;
  specialty: string;
}

export interface DashboardStats {
  appointments_today: number;
  upcoming_total: number;
  completed_today: number;
  no_show_today: number;
  pending_notes: number;
  unread_notifications: number;
}

export interface AppointmentSummary {
  id: string;
  patient_id: string;
  patient_name: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'canceled' | 'completed' | 'no_show';
  reason: string;
}

export interface RecentPatient {
  id: string;
  full_name: string;
  last_visit: string;
  visit_notes: string;
}

export interface MedicalActivity {
  id: string;
  patient_id: string;
  patient_name: string;
  type: string;
  description: string;
  activity_date: string;
}

export interface DoctorDashboardData {
  doctor: DoctorSummary;
  stats: DashboardStats;
  today_appointments: AppointmentSummary[];
  upcoming_appointments: AppointmentSummary[];
  recent_patients: RecentPatient[];
  recent_medical_activity: MedicalActivity[];
}
