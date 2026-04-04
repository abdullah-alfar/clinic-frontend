import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePatientNotificationPreferences } from '../api/preferences';
import { NotificationPreferencesFormValues } from '../schemas';
import { preferenceKeys } from './usePatientNotificationPreferences';
import { toast } from 'sonner';

export function useUpdatePatientNotificationPreferences(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NotificationPreferencesFormValues) =>
      updatePatientNotificationPreferences(patientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preferenceKeys.detail(patientId) });
      toast.success('Notification preferences updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });
}
