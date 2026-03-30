'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/lib/api/dashboard';
import { getNotifications } from '@/lib/api/notifications';
import { getAppointments } from '@/lib/api/appointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserSquare2, CalendarCheck, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatClinicDate, formatClinicTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';

export default function DashboardPage() {
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

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
    { label: 'Total Patients', value: summary?.total_patients, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Active Doctors', value: summary?.total_doctors, icon: UserSquare2, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950' },
    { label: "Today's Appts", value: summary?.appointments_today, icon: CalendarCheck, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Upcoming', value: summary?.upcoming_appointments, icon: Clock, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950' },
    { label: 'Completed', value: summary?.completed_appointments, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Canceled', value: summary?.canceled_appointments, icon: XCircle, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Live overview of your clinic operations
          </p>
        </div>
        {tz && (
          <div className="bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Timezone: {tz}
          </div>
        )}
      </div>

      {/* Metric Cards - Premium Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="glass-card border-none hover:translate-y-[-4px] transition-all duration-300 group">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="space-y-1">
                {loadingSummary ? (
                  <Skeleton className="h-8 w-12 mx-auto" />
                ) : (
                  <span className="text-2xl font-extrabold tracking-tight">{value ?? 0}</span>
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-7 gap-6">
        {/* Upcoming Appointments - Glassy List */}
        <Card className="lg:col-span-4 border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/80">Upcoming Appointments</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {loadingAppts && <div className="p-6"><Skeleton className="h-20 w-full" /></div>}
              {!loadingAppts && (!appointments || appointments.length === 0) && (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground italic">
                   <CalendarCheck className="h-8 w-8 mb-2 opacity-20" />
                   <p className="text-sm">No upcoming appointments.</p>
                </div>
              )}
              {appointments?.slice(0, 5).map((appt) => (
                <div key={appt.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{formatClinicDate(appt.start_time, tz)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {formatClinicTime(appt.start_time, tz)} — {formatClinicTime(appt.end_time, tz)}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} className="shadow-sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications - Compact Glass */}
        <Card className="lg:col-span-3 border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/80">Recent Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {loadingNotifs && <div className="p-6"><Skeleton className="h-20 w-full" /></div>}
              {!loadingNotifs && (!notifications || notifications.length === 0) && (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground italic">
                   <Bell className="h-8 w-8 mb-2 opacity-20" />
                   <p className="text-sm">Universal quietness...</p>
                </div>
              )}
              {notifications?.slice(0, 5).map((n) => (
                <div key={n.id} className="px-6 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${n.status === 'read' ? 'text-muted-foreground' : 'text-foreground'}`}>{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{n.message}</p>
                    </div>
                    <StatusBadge status={n.status} className="shrink-0 text-[10px] h-5 px-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
