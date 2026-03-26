import { apiClient } from './client';
import type { ApiResponse, Visit, TimelineResponse } from '@/types';

export async function getPatientTimeline(patientId: string) {
  const { data } = await apiClient.get<ApiResponse<TimelineResponse>>(`/patients/${patientId}/timeline`);
  return data.data;
}

export async function createVisit(payload: {
  patient_id: string;
  appointment_id?: string;
  notes: string;
  diagnosis?: string;
  prescription?: string;
}) {
  const { data } = await apiClient.post<ApiResponse<Visit>>('/visits', payload);
  return data.data;
}
