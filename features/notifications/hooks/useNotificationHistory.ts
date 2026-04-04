import { useQuery } from '@tanstack/react-query';
import { getPatientNotificationHistory } from '../api/notifications';
import { OutboundNotification } from '../types';

export const notificationKeys = {
  all: ['notifications'] as const,
  history: (patientId: string) => [...notificationKeys.all, 'history', patientId] as const,
};

export function useNotificationHistory(patientId: string) {
  return useQuery<OutboundNotification[], Error>({
    queryKey: notificationKeys.history(patientId),
    queryFn: () => getPatientNotificationHistory(patientId),
    enabled: !!patientId,
  });
}
