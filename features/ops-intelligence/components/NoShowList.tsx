'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '@/lib/api/appointments';
import { getPatients } from '@/lib/api/patients';
import { NoShowBadge } from './NoShowBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Bell, Calendar, User } from 'lucide-react';
import { formatClinicDate, formatClinicTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import { Skeleton } from '@/components/ui/skeleton';

export const NoShowList: React.FC = () => {
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

  const { data: appointments, isLoading: loadingAppts } = useQuery({
    queryKey: ['appointments', 'upcoming_confirmed'],
    queryFn: () => getAppointments({ status: 'confirmed' }),
  });

  const { data: patients, isLoading: loadingPatients } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients,
  });

  const isLoading = loadingAppts || loadingPatients;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  const upcomingAppointments = appointments?.slice(0, 10) || [];

  if (upcomingAppointments.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="py-12 flex flex-col items-center justify-center text-muted-foreground">
          <Calendar className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-sm font-medium">No upcoming confirmed appointments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {upcomingAppointments.map((appt) => {
        const patient = patients?.find((p) => p.id === appt.patient_id);
        return (
          <Card key={appt.id} className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 group rounded-3xl">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                {/* Patient Info */}
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <User className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight">
                      {patient ? `${patient.first_name} ${patient.last_name}` : appt.patient_id.slice(0, 8)}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider opacity-70">
                      <Calendar className="h-3 w-3" />
                      {formatClinicDate(appt.start_time, tz)} at {formatClinicTime(appt.start_time, tz)}
                    </div>
                  </div>
                </div>

                {/* Risk Badge Integration */}
                <div className="flex-1 flex items-center justify-start md:justify-center border-y md:border-y-0 md:border-x border-border/40 py-4 md:py-0 md:px-8">
                  <NoShowBadge appointmentId={appt.id} patientId={appt.patient_id} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                  <Button variant="outline" className="rounded-2xl gap-2 font-bold px-5 border-border/60 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all">
                    <Phone className="h-4 w-4" />
                    Call Patient
                  </Button>
                  <Button className="rounded-2xl gap-2 font-bold px-5 shadow-lg shadow-primary/20">
                    <Bell className="h-4 w-4" />
                    Send Reminder
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
