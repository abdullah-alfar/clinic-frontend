import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from '../api/availability';
import {
  CreateScheduleRequest,
  UpdateScheduleRequest,
  CreateBreakRequest,
  CreateExceptionRequest,
} from '../types';

export const availabilityKeys = {
  all: ['availability'] as const,
  doctor: (doctorId: string) => [...availabilityKeys.all, doctorId] as const,
  exceptions: (doctorId: string) => [...availabilityKeys.doctor(doctorId), 'exceptions'] as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extracts a human-readable error message from an Axios error response. */
function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string; error?: { code?: string } } } }).response;
    return res?.data?.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

// ─── Query ────────────────────────────────────────────────────────────────────

export function useDoctorAvailability(doctorId: string) {
  return useQuery({
    queryKey: availabilityKeys.doctor(doctorId),
    queryFn: () => api.getFullAvailability(doctorId),
    enabled: !!doctorId,
  });
}

// ─── Schedule mutations ───────────────────────────────────────────────────────

export function useCreateSchedule(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => api.createSchedule(doctorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
      toast.success('Shift created successfully.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to create shift.'));
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
      toast.success('Shift updated successfully.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to update shift.'));
    },
  });
}

export function useDeleteSchedule(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) => api.deleteSchedule(doctorId, scheduleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
      toast.success('Shift removed.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete shift.'));
    },
  });
}

// ─── Break mutations ──────────────────────────────────────────────────────────

export function useCreateBreak(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: CreateBreakRequest }) =>
      api.createBreak(doctorId, scheduleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
      toast.success('Break added successfully.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to add break.'));
    },
  });
}

export function useDeleteBreak(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (breakId: string) => api.deleteBreak(doctorId, breakId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
      toast.success('Break removed.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to delete break.'));
    },
  });
}

// ─── Exception mutations ──────────────────────────────────────────────────────

export function useCreateException(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExceptionRequest) => api.createException(doctorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
      toast.success('Exception saved successfully.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to save exception.'));
    },
  });
}

export function useDeleteException(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (exceptionId: string) => api.deleteException(doctorId, exceptionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.doctor(doctorId) });
      toast.success('Exception removed.');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Failed to remove exception.'));
    },
  });
}
