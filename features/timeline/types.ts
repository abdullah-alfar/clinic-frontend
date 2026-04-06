export type TimelineItemType =
  | 'appointment'
  | 'medical_record'
  | 'invoice'
  | 'payment'
  | 'note'
  | 'notification'
  | 'attachment';

export interface TimelineItemDTO {
  id: string;
  type: TimelineItemType;
  title: string;
  subtitle: string;
  description: string;
  occurred_at: string;
  status?: string;
  entity_id: string;
  entity_url: string;
  metadata?: Record<string, any>;
}

export interface TimelineResponseDTO {
  patient_id: string;
  items: TimelineItemDTO[];
}
