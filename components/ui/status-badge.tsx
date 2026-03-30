import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  scheduled: { color: 'var(--primary)', label: 'Scheduled' },
  confirmed: { color: 'var(--primary)', label: 'Confirmed' },
  completed: { color: 'var(--foreground)', label: 'Completed' },
  canceled: { color: 'var(--destructive)', label: 'Canceled' },
  pending: { color: 'var(--amber-500, #f59e0b)', label: 'Pending' },
  paid: { color: 'var(--primary)', label: 'Paid' },
  sent: { color: 'var(--primary)', label: 'Sent' },
  read: { color: 'var(--muted-foreground)', label: 'Read' },
  unread: { color: 'var(--primary)', label: 'Unread' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normStatus = (status || '').toLowerCase();
  const config = STATUS_CONFIG[normStatus] || { color: 'var(--muted-foreground)', label: status };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider relative overflow-hidden transition-all duration-300",
        className
      )}
      style={{
        backgroundColor: `color-mix(in srgb, ${config.color} 12%, transparent)`,
        color: `color-mix(in srgb, ${config.color} 90%, black)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${config.color} 15%, transparent)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
      />
      {config.label}
    </div>
  );
}
