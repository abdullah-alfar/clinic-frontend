export interface Attachment {
  id: string;
  tenant_id: string;
  patient_id: string;
  appointment_id?: string;
  name: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportAIAnalysis {
  id: string;
  tenant_id: string;
  patient_id: string;
  attachment_id: string;
  analysis_type: string;
  status: 'pending' | 'completed' | 'failed';
  summary?: string;
  structured_data?: {
    abnormal_results?: boolean;
    key_metrics?: string[];
    recommendations?: string[];
    disclaimer?: string;
  };
  error_message?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeReportRequest {
  analysis_type: string;
}
