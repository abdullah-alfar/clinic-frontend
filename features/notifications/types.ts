export interface OutboundNotification {
  id: string;
  tenant_id: string;
  patient_id?: string;
  appointment_id?: string;
  channel: 'email' | 'whatsapp' | 'in_app';
  event_type: string;
  recipient: string;
  subject?: string;
  message: string;
  status: 'pending' | 'sent' | 'failed' | 'skipped';
  provider?: string;
  provider_message_id?: string;
  error_message?: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
}

export interface PatientNotificationPreferences {
  id: string;
  tenant_id: string;
  patient_id: string;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  reminder_enabled: boolean;
  appointment_created_enabled: boolean;
  appointment_confirmed_enabled: boolean;
  appointment_canceled_enabled: boolean;
  appointment_rescheduled_enabled: boolean;
  created_at: string;
  updated_at: string;
}
