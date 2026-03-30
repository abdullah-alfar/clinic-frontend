'use client';

import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '@/lib/api/notifications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BellRing, CheckCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatClinicDateTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import type { Notification } from '@/types';

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(100),
  });

  const [notifError, setNotifError] = useState<string | null>(null);
  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => { setNotifError(null); qc.invalidateQueries({ queryKey: ['notifications'] }); },
    onError: (err: any) => {
      const status = err.response?.status;
      if (status === 403) setNotifError("Permission denied.");
      else if (status === 401) setNotifError("Session expired.");
      else setNotifError("Failed to mark as read.");
    }
  });

  const unread = notifications?.filter((n) => n.status !== 'read').length ?? 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        description={unread > 0 ? `${unread} unread notifications` : 'All caught up!'}
      />

      {notifError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md mb-4 flex justify-between items-center animate-in fade-in zoom-in duration-200">
          <span>{notifError}</span>
          <Button variant="ghost" size="sm" onClick={() => setNotifError(null)} className="h-6 px-2 hover:bg-destructive/20">Dismiss</Button>
        </div>
      )}

      <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4"><Skeleton className="h-5 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></div>
        ))}

        {!isLoading && (!notifications || notifications.length === 0) && (
          <div className="py-16 text-center">
            <BellRing className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        )}

        {notifications?.map((n: Notification) => (
          <div key={n.id} className={`p-4 flex gap-4 transition-colors ${n.status === 'read' ? 'bg-background opacity-60' : 'bg-primary/5'}`}>
            <div className="shrink-0 pt-0.5">
              <BellRing className={`h-4 w-4 ${n.status === 'read' ? 'text-muted-foreground' : 'text-primary'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={`text-sm font-semibold ${n.status === 'read' ? 'text-muted-foreground' : 'text-foreground'}`}>{n.title}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={n.status} className="text-xs" />
                  {n.status !== 'read' && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1" onClick={() => markRead.mutate(n.id)}>
                      <CheckCheck className="h-3 w-3" />Mark read
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{formatClinicDateTime(n.created_at, tz)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
