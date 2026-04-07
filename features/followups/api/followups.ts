import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types';
import { FollowUp, CreateFollowUpRequest, UpdateFollowUpStatusRequest } from '../types';

export async function createFollowUp(req: CreateFollowUpRequest) {
  const { data } = await apiClient.post<ApiResponse<FollowUp>>('/follow-ups', req);
  return data.data;
}

export async function getFollowUps(params: { status?: string; overdue?: boolean; due_today?: boolean; doctor_id?: string }) {
  const { data } = await apiClient.get<ApiResponse<FollowUp[]>>('/follow-ups', { params });
  return data.data;
}

export async function getPatientFollowUps(patientId: string) {
  const { data } = await apiClient.get<ApiResponse<FollowUp[]>>(`/patients/${patientId}/follow-ups`);
  return data.data;
}

export async function updateFollowUpStatus(id: string, req: UpdateFollowUpStatusRequest) {
  const { data } = await apiClient.patch<ApiResponse<null>>(`/follow-ups/${id}`, req);
  return data;
}
