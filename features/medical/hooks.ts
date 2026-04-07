import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalApi } from './api';
import { CreateMedicalRecordRequest, UpdateMedicalRecordRequest } from './types';
import { toast } from 'sonner';

export const usePatientMedicalRecords = (patientId: string) => {
  return useQuery({
    queryKey: ['medical-records', patientId],
    queryFn: () => medicalApi.getPatientRecords(patientId),
    enabled: !!patientId,
  });
};

export const useMedicalRecord = (recordId: string) => {
  return useQuery({
    queryKey: ['medical-record', recordId],
    queryFn: () => medicalApi.getRecord(recordId),
    enabled: !!recordId,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: string; data: CreateMedicalRecordRequest }) => 
      medicalApi.createRecord(patientId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medical-records', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['timeline', variables.patientId] });
      toast.success('Medical record created successfully');
    },
    onError: () => {
      toast.error('Failed to create medical record');
    }
  });
};

export const useUpdateMedicalRecord = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recordId, data }: { recordId: string; data: UpdateMedicalRecordRequest }) =>
      medicalApi.updateRecord(recordId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medical-record', variables.recordId] });
      queryClient.invalidateQueries({ queryKey: ['medical-records', patientId] });
      queryClient.invalidateQueries({ queryKey: ['timeline', patientId] });
      toast.success('Medical record updated successfully');
    },
    onError: () => {
      toast.error('Failed to update medical record');
    }
  });
};

export const useDeleteMedicalRecord = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => medicalApi.deleteRecord(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records', patientId] });
      queryClient.invalidateQueries({ queryKey: ['timeline', patientId] });
      toast.success('Medical record deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete medical record');
    }
  });
};

export const useAddProcedureToRecord = (recordId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: import('./types').AddProcedureReq) =>
      medicalApi.addProcedureToRecord(recordId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-record', recordId] });
      toast.success('Procedure added to record');
    },
    onError: () => {
      toast.error('Failed to add procedure to record');
    },
  });
};
