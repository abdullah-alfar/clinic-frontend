'use client';

import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { CalendarHeart, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarPage() {
  const { data: appointments, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: () => getAppointments() });

  const statusVariant = (s: string) => {
    if (s === 'completed') return 'default';
    if (s === 'canceled') return 'destructive';
    if (s === 'confirmed') return 'secondary';
    return 'outline';
  };

  const today = startOfDay(new Date());
  
  // Create an array of the next 7 days
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarHeart className="h-6 w-6 text-primary" />
          Schedule Calendar
        </h1>
        <p className="text-muted-foreground text-sm">Upcoming appointments for the next 7 days</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {weekDays.map(day => {
            const dayAppts = appointments?.filter(a => isSameDay(new Date(a.start_time), day)) || [];
            if (dayAppts.length === 0) return null; // Or show empty slot

            return (
              <Card key={day.toISOString()}>
                <CardHeader className="bg-muted/30 py-3 border-b">
                  <CardTitle className="text-base font-semibold">
                    {format(day, 'EEEE, MMM do')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {dayAppts.map(appt => (
                      <div key={appt.id} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-md p-2 w-20">
                            <Clock className="h-4 w-4 mb-1" />
                            <span className="text-xs font-medium">{format(new Date(appt.start_time), 'h:mm a')}</span>
                          </div>
                          <div>
                            <p className="font-medium">{appt.reason || 'General Visit'}</p>
                            <p className="text-xs text-muted-foreground">Doctor ID: {appt.doctor_id.slice(0, 8)}...</p>
                          </div>
                        </div>
                        <Badge variant={statusVariant(appt.status)} className="capitalize">
                          {appt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {appointments?.filter(a => new Date(a.start_time) >= today && new Date(a.start_time) < addDays(today, 7)).length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20 mt-4">
              <CalendarHeart className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
              <h3 className="font-semibold text-lg">No Appointments</h3>
              <p className="text-muted-foreground mt-1">Your week looks completely clear.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
