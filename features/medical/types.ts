export interface MedicalVital {
  id: string;
  medical_record_id: string;
  type: string;
  value: string;
  unit: string | null;
  created_at: string;
}

export interface MedicalMedication {
  id: string;
  medical_record_id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string | null;
  notes: string | null;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  tenant_id: string;
  patient_id: string;
  appointment_id: string | null;
  doctor_id: string;
  diagnosis: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordResponse {
  record: MedicalRecord;
  vitals: MedicalVital[];
  medications: MedicalMedication[];
}

export interface CreateMedicalVitalRequest {
  type: string;
  value: string;
  unit?: string | null;
}

export interface CreateMedicalMedicationRequest {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string | null;
  notes?: string | null;
}

export interface CreateMedicalRecordRequest {
  appointment_id?: string | null;
  diagnosis: string;
  notes: string;
  vitals: CreateMedicalVitalRequest[];
  medications: CreateMedicalMedicationRequest[];
}

export interface UpdateMedicalRecordRequest {
  appointment_id?: string | null;
  diagnosis?: string;
  notes?: string;
  vitals: CreateMedicalVitalRequest[];
  medications: CreateMedicalMedicationRequest[];
}
