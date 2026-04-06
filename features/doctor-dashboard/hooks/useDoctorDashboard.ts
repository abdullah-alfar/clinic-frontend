import { useQuery } from '@tanstack/react-query';
import { doctorDashboardApi } from '../api/doctor-dashboard';
import { DoctorDashboardData } from '../types';

export const useDoctorDashboard = () => {
  return useQuery<DoctorDashboardData>({
    queryKey: ['doctor-dashboard'],
    queryFn: () => doctorDashboardApi.getDashboard(),
    refetchInterval: 30000, // Refetch every 30 seconds for live-ish updates
  });
};
