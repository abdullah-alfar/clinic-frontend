import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/availability';
import { CreateScheduleRequest, UpdateScheduleRequest, CreateBreakRequest, CreateExceptionRequest } from '../types';

export const availabilityKeys = {
  all: ['availability'] as const,
  doctor: (doctorId: string) => [...availabilityKeys.all, doctorId] as const,
  exceptions: (doctorId: string) => [...availabilityKeys.doctor(doctorId), 'exceptions'] as const,
};

export function useDoctorAvailability(doctorId: string) {
  return useQuery({
    queryKey: availabilityKeys.doctor(doctorId),
    queryFn: () => api.getFullAvailability(doctorId),
    enabled: !!doctorId,
  });
}

export function useCreateSchedule(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => api.createSchedule(doctorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}

export function useUpdateSchedule(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: UpdateScheduleRequest }) =>
      api.updateSchedule(doctorId, scheduleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}

export function useDeleteSchedule(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) => api.deleteSchedule(doctorId, scheduleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}

export function useCreateBreak(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: CreateBreakRequest }) =>
      api.createBreak(doctorId, scheduleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}

export function useDeleteBreak(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (breakId: string) => api.deleteBreak(doctorId, breakId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}

export function useCreateException(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExceptionRequest) => api.createException(doctorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}

export function useDeleteException(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (exceptionId: string) => api.deleteException(doctorId, exceptionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
    },
  });
}
