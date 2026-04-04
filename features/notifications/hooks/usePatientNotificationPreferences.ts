import { useQuery } from '@tanstack/react-query';
import { getPatientNotificationPreferences } from '../api/preferences';
import { PatientNotificationPreferences } from '../types';

export const preferenceKeys = {
  all: ['notification-preferences'] as const,
  detail: (patientId: string) => [...preferenceKeys.all, patientId] as const,
};

export function usePatientNotificationPreferences(patientId: string) {
  return useQuery<PatientNotificationPreferences, Error>({
    queryKey: preferenceKeys.detail(patientId),
    queryFn: () => getPatientNotificationPreferences(patientId),
    enabled: !!patientId,
  });
}
