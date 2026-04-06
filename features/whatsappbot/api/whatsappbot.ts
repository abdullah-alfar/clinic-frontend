import { apiClient } from '@/lib/api/client';
import { WhatsAppMessage, WhatsAppBotStatus } from '../types';
import { ApiResponse } from '@/types';

export const whatsappApi = {
  getPatientHistory: async (patientId: string): Promise<WhatsAppMessage[]> => {
    const { data } = await apiClient.get<ApiResponse<WhatsAppMessage[]>>(`/patients/${patientId}/whatsapp/history`);
    return data.data ?? [];
  },
  
  getBotStatus: async (patientId: string): Promise<WhatsAppBotStatus> => {
    const { data } = await apiClient.get<ApiResponse<WhatsAppBotStatus>>(`/patients/${patientId}/whatsapp/status`);
    return data.data;
  }
};
