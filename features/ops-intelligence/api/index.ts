import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { NoShowRisk, MissingRevenue, Communication } from '../types';

export const opsApi = {
  getNoShowRisk: async (appointmentId: string, patientId: string): Promise<NoShowRisk> => {
    const { data } = await apiClient.get<NoShowRisk>(`/appointments/${appointmentId}/no-show-risk`, {
      params: { patient_id: patientId }
    });
    return data;
  },

  getMissingRevenue: async (appointmentId: string): Promise<MissingRevenue> => {
    const { data } = await apiClient.get<MissingRevenue>('/revenue/missing', {
      params: { appointment_id: appointmentId }
    });
    return data;
  },

  getCommunications: async (patientId?: string): Promise<Communication[]> => {
    const { data } = await apiClient.get<Communication[]>('/communications', {
      params: { patient_id: patientId }
    });
    return data;
  }
};

export const useNoShowRisk = (appointmentId: string, patientId: string) => {
  return useQuery({
    queryKey: ['no-show-risk', appointmentId],
    queryFn: () => opsApi.getNoShowRisk(appointmentId, patientId),
    enabled: !!appointmentId && !!patientId,
  });
};

export const useMissingRevenue = (appointmentId: string) => {
  return useQuery({
    queryKey: ['missing-revenue', appointmentId],
    queryFn: () => opsApi.getMissingRevenue(appointmentId),
    enabled: !!appointmentId,
  });
};

export const useCommunications = (patientId?: string) => {
  return useQuery({
    queryKey: ['communications', patientId],
    queryFn: () => opsApi.getCommunications(patientId),
  });
};
