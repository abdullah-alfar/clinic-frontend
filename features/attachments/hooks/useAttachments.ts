import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadAttachment, getPatientAttachments, deleteAttachment } from '../api/attachments';
import { analyzeReport, getAnalyses } from '../api/report-ai';
import { toast } from 'sonner';

export function usePatientAttachments(patientId: string) {
  return useQuery({
    queryKey: ['patient-attachments', patientId],
    queryFn: () => getPatientAttachments(patientId),
  });
}

export function useUploadAttachment(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { file: File; appointmentId?: string }) => uploadAttachment(patientId, args.file, args.appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-attachments', patientId] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error('Failed to upload file');
      console.error(error);
    },
  });
}

export function useDeleteAttachment(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-attachments', patientId] });
      toast.success('File deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete file');
      console.error(error);
    },
  });
}

export function useReportAnalyses(attachmentId: string) {
  return useQuery({
    queryKey: ['report-analyses', attachmentId],
    queryFn: () => getAnalyses(attachmentId),
    enabled: !!attachmentId,
  });
}

export function useAnalyzeReport(attachmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (analysisType: string) => analyzeReport(attachmentId, { analysis_type: analysisType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-analyses', attachmentId] });
      toast.success('Analysis completed');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to perform analysis');
      console.error(error);
    },
  });
}
