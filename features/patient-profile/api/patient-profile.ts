import { apiClient } from '@/lib/api/client';
import { PatientProfileResponse } from '../types';

/**
 * Fetches the complete 360-degree patient profile from the backend.
 * Uses the centralized apiClient which handles authentication and base URLs.
 */
export async function fetchPatientProfile(id: string): Promise<PatientProfileResponse> {
  const { data } = await apiClient.get<PatientProfileResponse>(`/patients/${id}/profile`);
  return data;
}
