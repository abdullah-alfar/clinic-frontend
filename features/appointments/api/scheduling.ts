import { SlotSuggestion, SuggestionResponse, CreateRecurrenceRequest, RecurrenceRule } from '@/types';

export async function getSmartSuggestions(params: {
  patient_id: string;
  doctor_id?: string;
  date_from: string;
  date_to: string;
  duration_minutes?: number;
  strategy?: string;
}): Promise<SlotSuggestion[]> {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`/api/v1/appointments/smart-suggestions?${query}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch smart suggestions');
  const body: SuggestionResponse = await res.json();
  return body.data;
}

export async function createRecurringAppointment(data: CreateRecurrenceRequest): Promise<{ data: RecurrenceRule; meta: { appointments_created: number } }> {
  const res = await fetch('/api/v1/appointments/recurring', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create recurring appointment');
  return res.json();
}

export async function getRecurrenceRules(patientId: string): Promise<RecurrenceRule[]> {
  const res = await fetch(`/api/v1/appointments/recurring?patient_id=${patientId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Failed to fetch recurrence rules');
  const body = await res.json();
  return body.data;
}
