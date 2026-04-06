import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingsApi } from '@/lib/api/ratings';
import { CreateRatingRequest } from '../types';
import { toast } from 'sonner';

export const useRatings = () => {
  const queryClient = useQueryClient();

  const useSubmitRating = (appointmentId: string) => {
    return useMutation({
      mutationFn: (data: CreateRatingRequest) => ratingsApi.submitRating(appointmentId, data),
      onSuccess: () => {
        toast.success('Rating submitted successfully!');
        queryClient.invalidateQueries({ queryKey: ['appointments', appointmentId] });
        queryClient.invalidateQueries({ queryKey: ['ratings'] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to submit rating');
      },
    });
  };

  const useDoctorRatings = (doctorId: string) => {
    return useQuery({
      queryKey: ['ratings', 'doctor', doctorId],
      queryFn: () => ratingsApi.getDoctorRatings(doctorId).then((res) => res.data),
      enabled: !!doctorId,
    });
  };

  const usePatientRatings = (patientId: string) => {
    return useQuery({
      queryKey: ['ratings', 'patient', patientId],
      queryFn: () => ratingsApi.getPatientRatings(patientId).then((res) => res.data),
      enabled: !!patientId,
    });
  };

  const useGlobalAnalytics = () => {
    return useQuery({
      queryKey: ['ratings', 'analytics'],
      queryFn: () => ratingsApi.getGlobalAnalytics().then((res) => res.data),
    });
  };

  return {
    useSubmitRating,
    useDoctorRatings,
    usePatientRatings,
    useGlobalAnalytics,
  };
};
