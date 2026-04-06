import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalActivity } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Activity, ClipboardList, FilePlus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ActivityProps {
  activities: MedicalActivity[];
}

export const RecentMedicalActivity: React.FC<ActivityProps> = ({ activities = [] }) => {
  const safeActivities = activities || [];
  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> Medical Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {safeActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent medical activity.
          </p>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
            {safeActivities.map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-4">
                <div className="absolute left-0 mt-1.5 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-primary/20 z-10">
                  {activity.type === 'visit' ? (
                    <ClipboardList className="w-5 h-5 text-primary" />
                  ) : (
                    <FilePlus className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <div className="pl-14 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      {activity.patient_name}
                      <Badge variant="secondary" className="text-[10px] py-0 h-4 uppercase">
                        {activity.type}
                      </Badge>
                    </h4>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {formatDistanceToNow(new Date(activity.activity_date), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    "{activity.description}"
                  </p>
                  <Link 
                    href={`/patients/${activity.patient_id}`}
                    className="inline-flex items-center gap-1 text-[10px] font-medium text-primary mt-2 hover:underline"
                  >
                    Details <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
