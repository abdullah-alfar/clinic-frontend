import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatientDocuments, uploadDocument, updateDocument, deleteDocument } from '@/lib/api/documents';
import { UpdateDocumentRequest } from './types';

export function usePatientDocuments(patientId: string, category?: string) {
  return useQuery({
    queryKey: ['documents', patientId, category],
    queryFn: () => getPatientDocuments(patientId, category),
    enabled: !!patientId,
  });
}

export function useUploadDocument(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadDocument(patientId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', patientId] });
      queryClient.invalidateQueries({ queryKey: ['timeline', patientId] }); // Invalidate timeline to show the new event
    },
  });
}

export function useUpdateDocument(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateDocumentRequest }) => 
      updateDocument(id, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', patientId] });
    },
  });
}

export function useDeleteDocument(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', patientId] });
    },
  });
}
