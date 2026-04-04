import { apiClient } from '@/lib/api/client';
import { PatientNotificationPreferences } from '../types';
import { NotificationPreferencesFormValues } from '../schemas';

export async function getPatientNotificationPreferences(
  patientId: string
): Promise<PatientNotificationPreferences> {
  const response = await apiClient.get<PatientNotificationPreferences>(
    `/patients/${patientId}/notification-preferences`
  );
  return response;
}

export async function updatePatientNotificationPreferences(
  patientId: string,
  data: NotificationPreferencesFormValues
): Promise<PatientNotificationPreferences> {
  const response = await apiClient.put<PatientNotificationPreferences>(
    `/patients/${patientId}/notification-preferences`,
    data
  );
  return response;
}
