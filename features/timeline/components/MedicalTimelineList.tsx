import { useState } from 'react';
import { usePatientTimeline } from '../hooks/usePatientTimeline';
import { TimelineItemType } from '../types';
import { MedicalTimelineItem } from './MedicalTimelineItem';
import { MedicalTimelineFilters } from './MedicalTimelineFilters';
import { TimelineSkeleton } from './TimelineSkeleton';
import { TimelineEmptyState } from './TimelineEmptyState';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MedicalTimelineListProps {
  patientId: string;
}

export function MedicalTimelineList({ patientId }: MedicalTimelineListProps) {
  const [filterType, setFilterType] = useState<TimelineItemType | undefined>(undefined);
  const { data, isLoading, isError, refetch, isFetching } = usePatientTimeline(patientId, filterType);

  const timelineItems = data?.data.items || [];
  const isEmpty = !isLoading && timelineItems.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <MedicalTimelineFilters 
          currentType={filterType} 
          onTypeChange={setFilterType} 
        />
        
        <div className="flex items-center gap-2 mb-4">
          {isFetching && !isLoading && (
            <RotateCw className="h-3 w-3 animate-spin text-muted-foreground/40" />
          )}
          <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-muted-foreground/20">
            {timelineItems.length} Events
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <TimelineSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-destructive/5 text-destructive">
          <p className="text-sm font-semibold">Failed to load medical timeline</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="mt-2 text-xs font-bold hover:bg-destructive/10">
            Retry
          </Button>
        </div>
      ) : isEmpty ? (
        <TimelineEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-1 animate-in fade-in duration-500">
          {timelineItems.map((item) => (
            <MedicalTimelineItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
