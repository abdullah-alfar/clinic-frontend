import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface NotificationStatusBadgeProps {
  status: 'pending' | 'sent' | 'failed' | 'skipped';
}

export function NotificationStatusBadge({ status }: NotificationStatusBadgeProps) {
  switch (status) {
    case 'sent':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Sent
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 'failed':
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    case 'skipped':
      return (
        <Badge variant="outline" className="text-gray-500 border-gray-500">
          <AlertCircle className="w-3 h-3 mr-1" />
          Skipped
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
