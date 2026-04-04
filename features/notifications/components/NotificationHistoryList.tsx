import { useNotificationHistory } from '../hooks/useNotificationHistory';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationStatusBadge } from './NotificationStatusBadge';

interface NotificationHistoryListProps {
  patientId: string;
}

export function NotificationHistoryList({ patientId }: NotificationHistoryListProps) {
  const { data: notifications, isLoading, isError } = useNotificationHistory(patientId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-500">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p>Failed to load notification history</p>
        </CardContent>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>No notifications have been sent yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div className="flex space-x-3">
                <div className="mt-1 flex-shrink-0">
                  {notif.channel === 'email' && <Mail className="h-5 w-5 text-gray-500" />}
                  {notif.channel === 'whatsapp' && <MessageSquare className="h-5 w-5 text-green-500" />}
                  {notif.channel === 'in_app' && <AlertCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm capitalize">
                      {notif.event_type.replace(/_/g, ' ')}
                    </span>
                    <NotificationStatusBadge status={notif.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notif.subject || notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">To: {notif.recipient}</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground whitespace-nowrap ml-4">
                {format(new Date(notif.created_at), 'MMM d, h:mm a')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
