import { apiClient } from './client';
import { Rating, DoctorRatingSummary, RatingAnalytics, CreateRatingRequest } from '../../features/ratings/types';

export const ratingsApi = {
  submitRating: (appointmentId: string, data: CreateRatingRequest) =>
    apiClient.post<Rating>(`/api/v1/appointments/${appointmentId}/rating`, data),

  getDoctorRatings: (doctorId: string) =>
    apiClient.get<DoctorRatingSummary>(`/api/v1/doctors/${doctorId}/ratings`),

  getPatientRatings: (patientId: string) =>
    apiClient.get<Rating[]>(`/api/v1/patients/${patientId}/ratings`),

  getGlobalAnalytics: () =>
    apiClient.get<RatingAnalytics>('/api/v1/ratings/analytics'),
};
