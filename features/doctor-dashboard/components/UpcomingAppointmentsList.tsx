import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentSummary } from '../types';
import { format, isTomorrow } from 'date-fns';
import { CalendarDays, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface UpcomingProps {
  appointments: AppointmentSummary[];
}

export const UpcomingAppointmentsList: React.FC<UpcomingProps> = ({ appointments = [] }) => {
  const safeAppointments = appointments || [];
  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" /> Upcoming
        </CardTitle>
        <Link href="/appointments" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {safeAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No upcoming appointments.
          </p>
        ) : (
          <div className="space-y-4">
            {safeAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 group cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-colors">
                <div className="flex flex-col items-center justify-center min-w-[50px] py-1 border rounded bg-muted/20 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {format(new Date(appt.start_time), 'MMM')}
                  </span>
                  <span className="text-lg font-bold tabular-nums">
                    {format(new Date(appt.start_time), 'dd')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {appt.patient_name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {isTomorrow(new Date(appt.start_time)) ? 'Tomorrow' : format(new Date(appt.start_time), 'EEEE')} at {format(new Date(appt.start_time), 'HH:mm')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
