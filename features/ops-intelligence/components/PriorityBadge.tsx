import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CommunicationPriority } from '../types';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: CommunicationPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const configs = {
    urgent: 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse',
    high: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
    medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    low: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400',
  };

  const style = configs[priority] || configs.low;

  return (
    <Badge variant="outline" className={cn("rounded-lg font-extrabold text-[9px] uppercase tracking-widest px-1.5 py-0 border", style)}>
      {priority}
    </Badge>
  );
};
