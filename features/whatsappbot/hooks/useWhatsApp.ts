import { useQuery } from '@tanstack/react-query';
import { whatsappApi } from '../api/whatsappbot';

export function usePatientWhatsAppHistory(patientId: string) {
  return useQuery({
    queryKey: ['whatsapp-history', patientId],
    queryFn: () => whatsappApi.getPatientHistory(patientId),
    enabled: !!patientId,
  });
}

export function useWhatsAppBotStatus(patientId: string) {
  return useQuery({
    queryKey: ['whatsapp-status', patientId],
    queryFn: () => whatsappApi.getBotStatus(patientId),
    enabled: !!patientId,
  });
}
