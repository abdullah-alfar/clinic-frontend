import { apiClient } from './client';
import type { ApiResponse, Doctor } from '@/types';

export async function getDoctors() {
  const { data } = await apiClient.get<ApiResponse<Doctor[]>>('/doctors');
  return data.data ?? [];
}

export async function getDoctor(id: string) {
  const { data } = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  return data.data;
}

export async function createDoctor(payload: {
  full_name: string;
  specialty: string;
  license_number: string;
}) {
  const { data } = await apiClient.post<ApiResponse<Doctor>>('/doctors', payload);
  return data.data;
}

export async function updateDoctor(id: string, payload: Partial<Doctor>) {
  const { data } = await apiClient.put<ApiResponse<Doctor>>(`/doctors/${id}`, payload);
  return data.data;
}

export async function deleteDoctor(id: string) {
  await apiClient.delete(`/doctors/${id}`);
}
