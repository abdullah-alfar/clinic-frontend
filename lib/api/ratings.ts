import { api } from './index';
import { Rating, DoctorRatingSummary, RatingAnalytics, CreateRatingRequest } from '../../features/ratings/types';

export const ratingsApi = {
  submitRating: (appointmentId: string, data: CreateRatingRequest) =>
    api.post<Rating>(`/api/v1/appointments/${appointmentId}/rating`, data),

  getDoctorRatings: (doctorId: string) =>
    api.get<DoctorRatingSummary>(`/api/v1/doctors/${doctorId}/ratings`),

  getPatientRatings: (patientId: string) =>
    api.get<Rating[]>(`/api/v1/patients/${patientId}/ratings`),

  getGlobalAnalytics: () =>
    api.get<RatingAnalytics>('/api/v1/ratings/analytics'),
};
