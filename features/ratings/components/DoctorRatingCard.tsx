'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { useRatings } from '../hooks/useRatings';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Users, Star } from 'lucide-react';

interface DoctorRatingCardProps {
  doctorId: string;
}

export const DoctorRatingCard: React.FC<DoctorRatingCardProps> = ({ doctorId }) => {
  const { useDoctorRatings } = useRatings();
  const { data, isLoading } = useDoctorRatings(doctorId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          Patient Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Summary Stats */}
          <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-muted/40 rounded-2xl border border-muted-foreground/10">
            <span className="text-4xl font-extrabold text-primary">{data.average_rating.toFixed(1)}</span>
            <StarRating rating={Math.round(data.average_rating)} readonly size="sm" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
              Average Rating
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-muted/40 rounded-2xl border border-muted-foreground/10">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-2xl font-bold">{data.total_ratings}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
              Total Reviews
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-muted/40 rounded-2xl border border-muted-foreground/10">
            <MessageSquare className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold">{data.ratings.filter(r => r.comment).length}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
              With Comments
            </span>
          </div>
        </div>

        {/* Recent Ratings */}
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest px-1">
            Recent Feedback
          </h4>
          <div className="space-y-3">
            {data.ratings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8 bg-muted/20 rounded-xl border border-dashed">
                No ratings yet for this doctor.
              </p>
            ) : (
              data.ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="p-4 rounded-xl bg-background border border-muted shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <StarRating rating={rating.rating} readonly size="sm" />
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-foreground/80 leading-relaxed italic group-hover:text-foreground transition-colors">
                      "{rating.comment}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
