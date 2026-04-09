export type DocumentCategory = 
  | 'lab_report' 
  | 'prescription' 
  | 'id_document' 
  | 'insurance' 
  | 'consent_form' 
  | 'general';

export interface Document {
  id: string;
  patient_id: string;
  appointment_id?: string;
  medical_record_id?: string;
  name: string;
  mime_type: string;
  size: number;
  category: DocumentCategory;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  download_url: string;
}

export interface UpdateDocumentRequest {
  name: string;
  category: DocumentCategory;
  appointment_id?: string;
  medical_record_id?: string;
}
