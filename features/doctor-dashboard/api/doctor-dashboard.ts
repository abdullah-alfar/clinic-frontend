import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types';
import { DoctorDashboardData } from '../types';

export const doctorDashboardApi = {
  getDashboard: async (): Promise<DoctorDashboardData> => {
    const { data } = await apiClient.get<ApiResponse<DoctorDashboardData>>('/doctor-dashboard');
    return data.data;
  }
};
