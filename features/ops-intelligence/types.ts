export type RiskLevel = 'low' | 'medium' | 'high';

export interface NoShowRisk {
  appointment_id: string;
  risk_score: number;
  risk_level: RiskLevel;
  factors: string[];
}

export interface MissingRevenue {
  appointment_id: string;
  missing_services: string[];
}

export type CommunicationChannel = 'whatsapp' | 'email' | 'sms';
export type CommunicationDirection = 'inbound' | 'outbound';
export type CommunicationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Communication {
  id: string;
  patient_id: string;
  patient_name: string;
  channel: CommunicationChannel;
  direction: CommunicationDirection;
  message: string;
  status: string;
  priority: CommunicationPriority;
  category: string;
  created_at: string;
}
