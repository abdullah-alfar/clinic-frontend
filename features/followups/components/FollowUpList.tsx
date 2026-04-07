import React from 'react';
import { FollowUp } from '../types';
import { FollowUpCard } from './FollowUpCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList } from 'lucide-react';

interface FollowUpListProps {
  followups?: FollowUp[];
  isLoading: boolean;
  emptyMessage?: string;
}

export function FollowUpList({ followups, isLoading, emptyMessage = 'No follow-ups found for this criteria.' }: FollowUpListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!followups || followups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
        <ClipboardList className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {followups.map((followup) => (
        <FollowUpCard key={followup.id} followup={followup} />
      ))}
    </div>
  );
}
