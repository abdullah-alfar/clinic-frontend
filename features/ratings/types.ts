export interface Rating {
  id: string;
  tenant_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
}

export interface DoctorRatingSummary {
  doctor_id: string;
  doctor_name: string;
  average_rating: number;
  total_ratings: number;
  rating_distribution: { [key: number]: number };
  recent_comments: {
    rating: number;
    comment: string;
    created_at: string;
    patient_name: string;
  }[];
}

export interface RatingAnalytics {
  total_ratings: number;
  average_rating: number;
  ratings_by_day: {
    date: string;
    average: number;
    count: number;
  }[];
  top_doctors: {
    doctor_id: string;
    doctor_name: string;
    average_rating: number;
    rating_count: number;
  }[];
}

export interface CreateRatingRequest {
  rating: number;
  comment?: string;
}
