export type FollowUpStatus = 'pending' | 'completed' | 'missed' | 'canceled';
export type FollowUpPriority = 'low' | 'medium' | 'high';

export interface FollowUp {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  medical_record_id?: string;
  reason: string;
  due_date: string;
  status: FollowUpStatus;
  priority: FollowUpPriority;
  auto_generated: boolean;
  created_by: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;

  // Enriched
  patient_name?: string;
  doctor_name?: string;
}

export interface CreateFollowUpRequest {
  patient_id: string;
  doctor_id?: string;
  appointment_id?: string;
  medical_record_id?: string;
  reason: string;
  due_date: string;
  priority: FollowUpPriority;
  auto_generated?: boolean;
}

export interface UpdateFollowUpStatusRequest {
  status: FollowUpStatus;
}
