import { apiClient } from './client';
import type { ApiResponse, Patient } from '@/types';

export async function getPatients() {
  const { data } = await apiClient.get<ApiResponse<Patient[]>>('/patients');
  return data.data ?? [];
}

export async function getPatient(id: string) {
  const { data } = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
  return data.data;
}

export async function createPatient(payload: {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
  notes?: string;
}) {
  const { data } = await apiClient.post<ApiResponse<Patient>>('/patients', payload);
  return data.data;
}

export async function updatePatient(id: string, payload: Partial<Patient>) {
  const { data } = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, payload);
  return data.data;
}

export async function deletePatient(id: string) {
  await apiClient.delete(`/patients/${id}`);
}
