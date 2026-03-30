import { apiClient } from '@/lib/api/client';
import {
  DoctorAvailabilityDTO,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ScheduleDTO,
  CreateBreakRequest,
  BreakDTO,
  CreateExceptionRequest,
  ExceptionDTO
} from '../types';

export const getFullAvailability = async (doctorId: string): Promise<DoctorAvailabilityDTO> => {
  const { data } = await apiClient.get<{ data: DoctorAvailabilityDTO }>(`/doctors/${doctorId}/availability`);
  return data.data;
};

export const createSchedule = async (doctorId: string, payload: CreateScheduleRequest): Promise<ScheduleDTO> => {
  const { data } = await apiClient.post<{ data: ScheduleDTO }>(`/doctors/${doctorId}/availability/schedules`, payload);
  return data.data;
};

export const updateSchedule = async (doctorId: string, scheduleId: string, payload: UpdateScheduleRequest): Promise<ScheduleDTO> => {
  const { data } = await apiClient.patch<{ data: ScheduleDTO }>(`/doctors/${doctorId}/availability/schedules/${scheduleId}`, payload);
  return data.data;
};

export const deleteSchedule = async (doctorId: string, scheduleId: string): Promise<void> => {
  await apiClient.delete(`/doctors/${doctorId}/availability/schedules/${scheduleId}`);
};

export const createBreak = async (doctorId: string, scheduleId: string, payload: CreateBreakRequest): Promise<BreakDTO> => {
  const { data } = await apiClient.post<{ data: BreakDTO }>(`/doctors/${doctorId}/availability/schedules/${scheduleId}/breaks`, payload);
  return data.data;
};

export const deleteBreak = async (doctorId: string, breakId: string): Promise<void> => {
  await apiClient.delete(`/doctors/${doctorId}/availability/breaks/${breakId}`);
};

export const getExceptions = async (doctorId: string): Promise<ExceptionDTO[]> => {
  const { data } = await apiClient.get<{ data: ExceptionDTO[] }>(`/doctors/${doctorId}/availability/exceptions`);
  return data.data;
};

export const createException = async (doctorId: string, payload: CreateExceptionRequest): Promise<ExceptionDTO> => {
  const { data } = await apiClient.post<{ data: ExceptionDTO }>(`/doctors/${doctorId}/availability/exceptions`, payload);
  return data.data;
};

export const deleteException = async (doctorId: string, exceptionId: string): Promise<void> => {
  await apiClient.delete(`/doctors/${doctorId}/availability/exceptions/${exceptionId}`);
};
