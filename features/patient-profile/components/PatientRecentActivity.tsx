'use client';

import { PatientRecentActivity as RecentActivityData, RecentActivity } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, FileText, CreditCard, MessageSquare, Clock, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PatientRecentActivityProps {
  activities: RecentActivityData;
}

export function PatientRecentActivity({ activities }: PatientRecentActivityProps) {
  const allActivities: RecentActivity[] = [
    ...(activities.appointments || []),
    ...(activities.medical_records || []),
    ...(activities.reports || []),
    ...(activities.invoices || []),
    ...(activities.communications || []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'medical_record': return <Activity className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
      case 'invoice': return <CreditCard className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (allActivities.length === 0) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-10 opacity-30 text-sm">
           No recent activity found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-none">
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col divide-y">
          {allActivities.slice(0, 5).map((activity, i) => (
            <div key={i} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="p-2 rounded-full bg-muted border">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold leading-none">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-5">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
