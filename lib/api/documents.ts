import { apiClient } from './client';
import { Document, UpdateDocumentRequest } from '@/features/documents/types';

export async function getPatientDocuments(patientId: string, category?: string) {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  
  const response = await apiClient.get(`/patients/${patientId}/documents?${params.toString()}`);
  return response.data.data as Document[];
}

export async function uploadDocument(patientId: string, formData: FormData) {
  const response = await apiClient.post(`/patients/${patientId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data as Document;
}

export async function updateDocument(id: string, req: UpdateDocumentRequest) {
  const response = await apiClient.patch(`/documents/${id}`, req);
  return response.data.data as Document;
}

export async function deleteDocument(id: string) {
  const response = await apiClient.delete(`/documents/${id}`);
  return response.data;
}
