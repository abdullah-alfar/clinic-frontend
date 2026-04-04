import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/scheduling';
import { CreateRecurrenceRequest } from '@/types';

export const schedulingKeys = {
  all: ['scheduling'] as const,
  suggestions: (params: any) => [...schedulingKeys.all, 'suggestions', params] as const,
  recurrence: (patientId: string) => [...schedulingKeys.all, 'recurrence', patientId] as const,
};

export function useSmartSuggestions(params: {
  patient_id: string;
  doctor_id?: string;
  date_from: string;
  date_to: string;
  duration_minutes?: number;
  strategy?: string;
}) {
  return useQuery({
    queryKey: schedulingKeys.suggestions(params),
    queryFn: () => api.getSmartSuggestions(params),
    enabled: !!params.patient_id && !!params.date_from && !!params.date_to,
  });
}

export function useCreateRecurrence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecurrenceRequest) => api.createRecurringAppointment(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: schedulingKeys.recurrence(variables.patient_id) });
      qc.invalidateQueries({ queryKey: ['appointments'] }); // Invalidate general appointments too
    },
  });
}

export function useRecurrenceRules(patientId: string) {
  return useQuery({
    queryKey: schedulingKeys.recurrence(patientId),
    queryFn: () => api.getRecurrenceRules(patientId),
    enabled: !!patientId,
  });
}
