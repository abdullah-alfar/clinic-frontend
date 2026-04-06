export type WhatsAppMessageDirection = 'inbound' | 'outbound';

export interface WhatsAppMessage {
  id: string;
  tenant_id: string;
  patient_id?: string;
  direction: WhatsAppMessageDirection;
  phone_number: string;
  message_type: string;
  content: string;
  metadata: any;
  provider_message_id?: string;
  created_at: string;
}

export interface WhatsAppBotStatus {
  is_ready: boolean;
  phone_number: string | null;
  last_interaction: string | null;
  opt_in_status: boolean;
}
