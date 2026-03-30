import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  scheduled: { color: 'hsl(var(--primary))', label: 'Scheduled' },
  confirmed: { color: 'hsl(var(--primary))', label: 'Confirmed' },
  completed: { color: 'rgb(34 197 94)', label: 'Completed' }, // success green
  canceled: { color: 'hsl(var(--destructive))', label: 'Canceled' },
  pending: { color: 'rgb(245 158 11)', label: 'Pending' }, // amber
  paid: { color: 'rgb(34 197 94)', label: 'Paid' },
  sent: { color: 'hsl(var(--primary))', label: 'Sent' },
  read: { color: 'hsl(var(--muted-foreground))', label: 'Read' },
  unread: { color: 'hsl(var(--primary))', label: 'Unread' },
  available: { color: 'hsl(var(--primary))', label: 'Available' },
  booked: { color: 'hsl(var(--destructive))', label: 'Booked' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = (status || '').toLowerCase();
  const config = STATUS_CONFIG[normStatus] || { color: 'hsl(var(--muted-foreground))', label: status };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${config.color} 10%, transparent)`,
        color: config.color,
        border: `1px solid color-mix(in srgb, ${config.color} 20%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full animate-pulse"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
      />
      {config.label}
    </div>
  );
}
