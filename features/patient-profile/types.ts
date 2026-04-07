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

export interface PatientFlag {
  type: 'alert' | 'medical' | 'billing' | 'info';
  label: string;
}

export interface ActivityItemDTO {
  id: string;
  type: 'appointment' | 'medical_record' | 'invoice' | 'communication';
  title: string;
  subtitle: string;
  status: string;
  occurred_at: string;
}

export interface ActivityStreamResponse {
  data: ActivityItemDTO[];
  total_items: number;
  page: number;
  limit: number;
  message: string;
}

export interface PatientProfileData {
  patient: PatientDTO;
  flags: PatientFlag[];
}

export interface PatientProfileResponse {
  data: PatientProfileData;
  message: string;
  error: string | null;
}
