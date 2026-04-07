export interface AIRequest {
  session_id?: string;
  patient_id?: string;
  input: string;
  source: string;
  context?: Record<string, any>;
}

export interface AIResponse {
  session_id: string;
  message: string;
  action?: string;
  data?: any;
}
