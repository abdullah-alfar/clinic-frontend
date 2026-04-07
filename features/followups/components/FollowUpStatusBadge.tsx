import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FollowUpStatus } from '../types';

interface FollowUpStatusBadgeProps {
  status: FollowUpStatus;
  className?: string;
}

export function FollowUpStatusBadge({ status, className }: FollowUpStatusBadgeProps) {
  const styles: Record<FollowUpStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    missed: 'bg-red-100 text-red-800 border-red-200',
    canceled: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <Badge variant="outline" className={`${styles[status]} capitalize ${className}`}>
      {status}
    </Badge>
  );
}
