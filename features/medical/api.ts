import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import {
  MedicalRecordResponse, 
  CreateMedicalRecordRequest, 
  UpdateMedicalRecordRequest,
  AddProcedureReq
} from './types';

export const medicalApi = {
  getPatientRecords: async (patientId: string) => {
    const { data } = await apiClient.get<ApiResponse<MedicalRecordResponse[]>>(
      `/patients/${patientId}/medical-records`
    );
    return data.data ?? [];
  },

  getRecord: async (recordId: string) => {
    const { data } = await apiClient.get<ApiResponse<MedicalRecordResponse>>(
      `/medical-records/${recordId}`
    );
    return data.data;
  },

  createRecord: async (patientId: string, payload: CreateMedicalRecordRequest) => {
    const { data } = await apiClient.post<ApiResponse<MedicalRecordResponse>>(
      `/patients/${patientId}/medical-records`,
      payload
    );
    return data.data;
  },

  updateRecord: async (recordId: string, payload: UpdateMedicalRecordRequest) => {
    const { data } = await apiClient.patch<ApiResponse<MedicalRecordResponse>>(
      `/medical-records/${recordId}`,
      payload
    );
    return data.data;
  },

  deleteRecord: async (recordId: string) => {
    await apiClient.delete(`/medical-records/${recordId}`);
  },

  addProcedureToRecord: async (recordId: string, payload: AddProcedureReq) => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      `/medical-records/${recordId}/procedures`,
      payload
    );
    return data;
  }
};
