import { apiClient } from './client';
import type { ApiResponse, Appointment, AppointmentStatus } from '@/types';

export async function getAppointments(params?: { status?: AppointmentStatus; date_from?: string; date_to?: string }) {
  const { data } = await apiClient.get<ApiResponse<Appointment[]>>('/reports/appointments', { params });
  return data.data ?? [];
}

export async function getAppointment(id: string) {
  const { data } = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`);
  return data.data;
}

export async function createAppointment(payload: {
  patient_id: string;
  doctor_id: string;
  start_time: string;
  end_time: string;
  reason?: string;
  notes?: string;
}) {
  const { data } = await apiClient.post<ApiResponse<Appointment>>('/appointments', payload);
  return data.data;
}

export async function confirmAppointment(id: string) {
  const { data } = await apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/confirm`);
  return data.data;
}

export async function cancelAppointment(id: string) {
  const { data } = await apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/cancel`);
  return data.data;
}

export async function completeAppointment(id: string) {
  const { data } = await apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}/complete`);
  return data.data;
}

export async function getAvailability(params: { date_from?: string; date_to?: string; date?: string; doctor_id?: string }) {
  const { data } = await apiClient.get<ApiResponse<import('@/types').DoctorAvailabilityResponse[]>>('/appointments/availability', { params });
  return data;
}

export async function getNextAvailable(doctor_id?: string) {
  const { data } = await apiClient.get<ApiResponse<import('@/types').Slot>>('/appointments/next-available', { params: { doctor_id } });
  return data.data;
}
