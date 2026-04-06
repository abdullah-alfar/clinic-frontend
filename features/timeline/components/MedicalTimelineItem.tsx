import { TimelineItemDTO } from '../types';
import { TimelineTypeBadge } from './TimelineTypeBadge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface MedicalTimelineItemProps {
  item: TimelineItemDTO;
}

export function MedicalTimelineItem({ item }: MedicalTimelineItemProps) {
  const date = new Date(item.occurred_at);
  const formattedDate = format(date, 'MMM d, yyyy • h:mm a');

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 border rounded-xl bg-card hover:bg-muted/30 transition-colors shadow-sm mb-4">
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <TimelineTypeBadge type={item.type} />
          {item.status && (
            <span className="text-[10px] bg-muted px-1.5 py-0 rounded text-muted-foreground font-medium uppercase tracking-wider">
              {item.status}
            </span>
          )}
        </div>
        
        <h4 className="font-bold text-base leading-tight">
          {item.title}
        </h4>
        
        <p className="text-sm font-semibold text-muted-foreground">
          {item.subtitle}
        </p>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        
        <div className="text-[11px] text-muted-foreground/60 mt-2 font-medium">
          {formattedDate}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-2 text-xs font-semibold hover:bg-muted">
          <Link href={item.entity_url}>
            View Details
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
