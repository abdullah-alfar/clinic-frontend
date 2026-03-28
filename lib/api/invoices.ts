import { apiClient } from './client';
import type { ApiResponse, Invoice } from '@/types';

export async function createInvoice(payload: {
  patient_id: string;
  appointment_id?: string;
  amount: number;
}) {
  const { data } = await apiClient.post<ApiResponse<Invoice>>('/invoices', payload);
  return data.data;
}

export async function getPatientInvoices(patientId: string) {
  const { data } = await apiClient.get<ApiResponse<Invoice[]>>(`/patients/${patientId}/invoices`);
  return data.data ?? [];
}

export async function markInvoicePaid(id: string) {
  const { data } = await apiClient.patch<ApiResponse<null>>(`/invoices/${id}/pay`);
  return data.data;
}
