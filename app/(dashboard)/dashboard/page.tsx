'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/lib/api/dashboard';
import { getNotifications } from '@/lib/api/notifications';
import { getAppointments } from '@/lib/api/appointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserSquare2, CalendarCheck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['dashboard_summary'],
    queryFn: getDashboardSummary,
  });

  const { data: notifications, isLoading: loadingNotifs } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(5),
  });

  const { data: appointments, isLoading: loadingAppts } = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: () => getAppointments({ status: 'confirmed' }),
  });

  const metrics = [
    { label: 'Total Patients', value: summary?.total_patients, icon: Users, color: 'text-blue-600' },
    { label: 'Active Doctors', value: summary?.total_doctors, icon: UserSquare2, color: 'text-violet-600' },
    { label: 'Today\'s Appointments', value: summary?.appointments_today, icon: CalendarCheck, color: 'text-amber-600' },
    { label: 'Upcoming', value: summary?.upcoming_appointments, icon: Clock, color: 'text-sky-600' },
    { label: 'Completed', value: summary?.completed_appointments, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Canceled', value: summary?.canceled_appointments, icon: XCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Live overview of your clinic operations</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <Icon className={`h-6 w-6 ${color}`} />
              {loadingSummary ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <span className="text-2xl font-bold">{value ?? 0}</span>
              )}
              <span className="text-xs text-muted-foreground">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {loadingAppts && <Skeleton className="h-12 w-full" />}
            {!loadingAppts && (!appointments || appointments.length === 0) && (
              <p className="py-4 text-sm text-muted-foreground text-center">No upcoming appointments.</p>
            )}
            {appointments?.slice(0, 5).map((appt) => (
              <div key={appt.id} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{format(new Date(appt.start_time), 'MMM d, yyyy')}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(appt.start_time), 'h:mm a')} — {format(new Date(appt.end_time), 'h:mm a')}</p>
                </div>
                <Badge variant={appt.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize text-xs">
                  {appt.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {loadingNotifs && <Skeleton className="h-12 w-full" />}
            {!loadingNotifs && (!notifications || notifications.length === 0) && (
              <p className="py-4 text-sm text-muted-foreground text-center">No notifications.</p>
            )}
            {notifications?.slice(0, 5).map((n) => (
              <div key={n.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${n.status === 'read' ? 'text-muted-foreground' : ''}`}>{n.title}</p>
                  <Badge variant={n.status === 'read' ? 'outline' : 'default'} className="shrink-0 text-xs">{n.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
