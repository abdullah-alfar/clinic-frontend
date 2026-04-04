import { apiClient } from '@/lib/api/client';
import { type ApiResponse } from '@/types';
import { PatientNotificationPreferences } from '../types';
import { NotificationPreferencesFormValues } from '../schemas';

export async function getPatientNotificationPreferences(
  patientId: string
): Promise<PatientNotificationPreferences> {
  const { data } = await apiClient.get<ApiResponse<PatientNotificationPreferences>>(
    `/patients/${patientId}/notification-preferences`
  );
  return data.data;
}

export async function updatePatientNotificationPreferences(
  patientId: string,
  data: NotificationPreferencesFormValues
): Promise<PatientNotificationPreferences> {
  const { data: res } = await apiClient.put<ApiResponse<PatientNotificationPreferences>>(
    `/patients/${patientId}/notification-preferences`,
    data
  );
  return res.data;
}
