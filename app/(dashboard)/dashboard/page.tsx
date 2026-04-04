'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/lib/api/dashboard';
import { getNotifications } from '@/lib/api/notifications';
import { getAppointments } from '@/lib/api/appointments';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  CheckCircle, 
  XCircle, 
  UserX,
  Clock, 
  Bell, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatClinicDate, formatClinicTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { tenant } = useTheme();
  const router = useRouter();
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
    { label: 'Total Patients', value: summary?.total_patients, icon: Users, trend: '+12%', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Today Appointments', value: summary?.appointments_today, icon: CalendarCheck, trend: '+5', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'No-shows', value: summary?.no_show_count, icon: UserX, trend: 'Tracked', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Pending Reviews', value: '14', icon: Activity, trend: 'High', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Monthly Revenue', value: '$12.4k', icon: DollarSign, trend: '+8%', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title={`Welcome back, ${tenant?.name || 'Clinic'}`}
        description="Here is what's happening in your clinic today."
      >
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-border/60" onClick={() => router.push('/patients')}>
            View Patients
          </Button>
          <Button className="rounded-xl shadow-lg shadow-primary/20 gap-2" onClick={() => router.push('/appointments')}>
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={cn("absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-110", m.bg)} />
            <div className="flex items-center justify-between mb-4">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border border-current/10", m.bg, m.color)}>
                <m.icon className="h-6 w-6" />
              </div>
              <div className="text-[10px] font-bold px-2 py-1 rounded-full bg-muted uppercase tracking-wider text-muted-foreground">
                {m.trend}
              </div>
            </div>
            <div>
              {loadingSummary ? (
                <Skeleton className="h-9 w-20 mb-1" />
              ) : (
                <span className="text-3xl font-extrabold tracking-tight">{m.value ?? 0}</span>
              )}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1 opacity-70">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Activity / Chart area */}
        <div className="lg:col-span-2 space-y-8">
          <SectionCard 
            title="Clinic Performance" 
            description="Patient volume and revenue over time"
            icon={TrendingUp}
          >
            <div className="h-[240px] w-full flex items-end justify-between gap-2 pt-6">
              {[40, 65, 45, 90, 65, 80, 55, 75, 40, 60, 85, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40 relative" 
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground opacity-50 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border/40">
               <div className="flex items-center gap-2">
                 <div className="h-3 w-3 rounded-full bg-primary" />
                 <span className="text-xs font-semibold">Volume (Patients)</span>
               </div>
               <div className="flex items-center gap-2 opacity-50">
                 <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                 <span className="text-xs font-semibold">Previous Period</span>
               </div>
            </div>
          </SectionCard>

          <SectionCard title="Upcoming Appointments" icon={CalendarCheck}>
             <div className="divide-y divide-border/40">
               {loadingAppts && <div className="py-4 space-y-3"><Skeleton className="h-16 w-full rounded-xl" /><Skeleton className="h-16 w-full rounded-xl" /></div>}
               {!loadingAppts && appointments?.length === 0 && (
                 <div className="py-12 text-center text-muted-foreground italic text-sm">No appointments scheduled for today.</div>
               )}
               {appointments?.slice(0, 4).map((appt) => (
                 <div key={appt.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-muted/10 transition-colors px-2 rounded-xl">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-muted/40 border border-border/60 flex items-center justify-center overflow-hidden">
                       <Users className="h-6 w-6 text-muted-foreground/50" />
                     </div>
                     <div>
                       <p className="text-sm font-bold">Patient ID: {appt.patient_id.slice(0, 8)}</p>
                       <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                         <Clock className="h-3 w-3" />
                         {formatClinicTime(appt.start_time, tz)} — {formatClinicTime(appt.end_time, tz)}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <StatusBadge status={appt.status} />
                     <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 </div>
               ))}
             </div>
             <Button variant="ghost" className="w-full mt-4 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5" onClick={() => router.push('/appointments')}>
               View Full Schedule
             </Button>
          </SectionCard>
        </div>

        {/* Sidebar area */}
        <div className="space-y-8">
          <SectionCard title="Recent Activity" icon={Bell}>
            <div className="space-y-6">
              {loadingNotifs && <div className="space-y-4 pt-2"><Skeleton className="h-14 w-full rounded-xl" /><Skeleton className="h-14 w-full rounded-xl" /></div>}
              {notifications?.slice(0, 5).map((n) => (
                <div key={n.id} className="flex gap-4 group cursor-pointer">
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full shrink-0 ring-4 ring-background",
                    n.status !== 'read' ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-muted-foreground opacity-30"
                  )} />
                  <div className="space-y-1">
                    <p className={cn("text-sm font-semibold leading-tight", n.status !== 'read' ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-70">{n.message}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter pt-1">
                      {formatClinicDate(n.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-xl mt-2 text-xs border-border/40">
                Mark all as read
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Doctor Workload" icon={UserSquare2}>
             <div className="space-y-5 pt-2">
                {[
                  { name: 'Dr. Sarah Wilson', appts: 12, caps: 15, color: 'bg-blue-500' },
                  { name: 'Dr. James Miller', appts: 8, caps: 10, color: 'bg-emerald-500' },
                  { name: 'Dr. Elena Rossi', appts: 5, caps: 12, color: 'bg-amber-500' }
                ].map((doc) => (
                  <div key={doc.name} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-foreground/80">{doc.name}</span>
                      <span className="text-muted-foreground">{doc.appts}/{doc.caps}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border/40">
                      <div 
                        className={cn("h-full transition-all duration-1000", doc.color)} 
                        style={{ width: `${(doc.appts / doc.caps) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
