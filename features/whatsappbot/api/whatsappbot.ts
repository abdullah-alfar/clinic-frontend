import { apiClient } from '@/lib/api/client';
import { WhatsAppMessage, WhatsAppBotStatus } from '../types';

export const whatsappApi = {
  getPatientHistory: async (patientId: string): Promise<WhatsAppMessage[]> => {
    return apiClient.get(`/api/v1/patients/${patientId}/whatsapp/history`);
  },
  
  getBotStatus: async (patientId: string): Promise<WhatsAppBotStatus> => {
    return apiClient.get(`/api/v1/patients/${patientId}/whatsapp/status`);
  }
};
