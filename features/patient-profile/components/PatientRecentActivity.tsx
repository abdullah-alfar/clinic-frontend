'use client';

import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { ActivityItemDTO, ActivityStreamResponse } from '../types';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { 
  Calendar, 
  Activity, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  Loader2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  patientId: string;
}

/**
 * PatientRecentActivity Component
 * Refactored to a professional standardized list with infinite scroll.
 * Implements the Factory Pattern for rendering different activity types.
 */
export function PatientRecentActivity({ patientId }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['patient-activities', patientId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get<ActivityStreamResponse>(
        `/patients/${patientId}/activities?page=${pageParam}&limit=15`
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total_items / lastPage.limit);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-muted/50 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center text-center gap-3">
        <AlertCircle className="h-8 w-8 text-destructive opacity-50" />
        <div className="space-y-1">
          <p className="text-sm font-bold">Failed to load activity stream</p>
          <p className="text-xs text-muted-foreground">{(error as any)?.message || 'An unexpected error occurred.'}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const activities = data?.pages.flatMap((page) => page.data) || [];

  if (activities.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed rounded-2xl flex flex-col items-center text-center opacity-40">
        <Clock className="h-10 w-10 mb-3" />
        <p className="text-sm font-medium">No medical activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
          <Activity className="h-3.5 w-3.5" />
          Medical Activity Stream
        </h3>
      </div>

      <div className="bg-background rounded-2xl border overflow-hidden shadow-sm divide-y">
        {activities.map((activity, idx) => (
          <ActivityRowFactory key={`${activity.id}-${idx}`} activity={activity} />
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={targetRef} className="h-10 flex items-center justify-center py-8">
        {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-primary/50" />}
        {!hasNextPage && activities.length > 0 && (
          <p className="text-xs font-medium text-muted-foreground/40">End of clinical history</p>
        )}
      </div>
    </div>
  );
}

/**
 * ActivityRowFactory
 * Factory pattern for rendering consistent rows based on activity type.
 */
function ActivityRowFactory({ activity }: { activity: ActivityItemDTO }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'appointment': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'medical_record': return <Activity className="h-4 w-4 text-emerald-500" />;
      case 'invoice': return <CreditCard className="h-4 w-4 text-amber-500" />;
      case 'communication': return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const s = status.toLowerCase();
    if (['completed', 'paid', 'sent'].includes(s)) return 'secondary';
    if (['canceled', 'unpaid', 'void'].includes(s)) return 'destructive';
    if (['pending', 'scheduled'].includes(s)) return 'outline';
    return 'default';
  };

  return (
    <div className="group flex items-center gap-4 p-4 hover:bg-muted/30 transition-all cursor-pointer">
      <div className="flex-shrink-0 p-2.5 rounded-xl bg-muted/50 border border-border/50 group-hover:scale-105 transition-transform">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-sm font-bold text-foreground truncate">{activity.title}</p>
          <span className="text-[10px] font-bold text-muted-foreground/60 tabular-nums">
            {format(new Date(activity.occurred_at), 'MMM d, p')}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground/80 line-clamp-1">{activity.subtitle}</p>
          <Badge 
            variant={getStatusVariant(activity.status)} 
            className="h-4 text-[9px] px-1.5 uppercase tracking-tighter font-bold rounded-sm border-transparent"
          >
            {activity.status}
          </Badge>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
}
