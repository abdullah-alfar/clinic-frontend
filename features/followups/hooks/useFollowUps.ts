import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFollowUps, getPatientFollowUps, createFollowUp, updateFollowUpStatus } from '../api/followups';
import { CreateFollowUpRequest, UpdateFollowUpStatusRequest } from '../types';
import { toast } from 'sonner';

export function useFollowUps(params: { status?: string; overdue?: boolean; due_today?: boolean; doctor_id?: string } = {}) {
  return useQuery({
    queryKey: ['followups', params],
    queryFn: () => getFollowUps(params),
  });
}

export function usePatientFollowUps(patientId: string) {
  return useQuery({
    queryKey: ['followups', 'patient', patientId],
    queryFn: () => getPatientFollowUps(patientId),
    enabled: !!patientId,
  });
}

export function useCreateFollowUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateFollowUpRequest) => createFollowUp(req),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['followups'] });
      qc.invalidateQueries({ queryKey: ['followups', 'patient', variables.patient_id] });
      toast.success('Follow-up created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create follow-up');
    },
  });
}

export function useUpdateFollowUpStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateFollowUpStatusRequest }) => updateFollowUpStatus(id, req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['followups'] });
      toast.success('Follow-up status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });
}
