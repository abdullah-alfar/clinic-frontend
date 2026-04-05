import { SlotSuggestion, SuggestionResponse, CreateRecurrenceRequest, RecurrenceRule } from '@/types';
import { apiClient } from '@/lib/api/client';

export async function getSmartSuggestions(params: {
  patient_id: string;
  doctor_id?: string;
  date_from: string;
  date_to: string;
  duration_minutes?: number;
  strategy?: string;
}): Promise<SlotSuggestion[]> {
  const cleanParams: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      cleanParams[k] = String(v);
    }
  }
  const query = new URLSearchParams(cleanParams).toString();
  const res = await apiClient.get<SuggestionResponse>(`/appointments/smart-suggestions?${query}`);
  return res.data.data;
}

export async function createRecurringAppointment(data: CreateRecurrenceRequest): Promise<{ data: RecurrenceRule; meta: { appointments_created: number } }> {
  const res = await apiClient.post<{ data: RecurrenceRule; meta: { appointments_created: number } }>('/appointments/recurring', data);
  return res.data;
}

export async function getRecurrenceRules(patientId: string): Promise<RecurrenceRule[]> {
  const res = await apiClient.get<{ data: RecurrenceRule[] }>(`/appointments/recurring?patient_id=${patientId}`);
  return res.data.data;
}
