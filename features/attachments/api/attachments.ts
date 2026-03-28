import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import type { Attachment } from '../types';

export async function uploadAttachment(patientId: string, file: File, appointmentId?: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('patient_id', patientId);
  if (appointmentId) {
    formData.append('appointment_id', appointmentId);
  }

  const { data } = await apiClient.post<ApiResponse<Attachment>>(
    `/patients/${patientId}/attachments`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data.data;
}

export async function getPatientAttachments(patientId: string) {
  const { data } = await apiClient.get<ApiResponse<Attachment[]>>(`/patients/${patientId}/attachments`);
  return data.data ?? [];
}

export async function deleteAttachment(attachmentId: string) {
  await apiClient.delete(`/attachments/${attachmentId}`);
}
