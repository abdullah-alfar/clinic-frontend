'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAppointments, confirmAppointment, cancelAppointment, completeAppointment } from '@/lib/api/appointments';
import { getDoctors } from '@/lib/api/doctors';
import { getPatients } from '@/lib/api/patients';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CheckCircle, XCircle, CalendarCheck, CalendarDays, RefreshCw } from 'lucide-react';
import { BookingModal } from '@/components/appointments/BookingModal';
import { StatusBadge } from '@/components/ui/status-badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatClinicDate, formatClinicTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'outline',
  confirmed: 'secondary',
  completed: 'default',
  canceled: 'destructive',
};

export default function AppointmentsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{ id: string; doctor_id: string; patient_id: string } | undefined>(undefined);

  const { data: appointments, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: () => getAppointments() });
  const { data: doctors } = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });

  const invalidate = () => { setStatusError(null); qc.invalidateQueries({ queryKey: ['appointments'] }); };
  const handleError = (err: any) => {
    const status = err.response?.status;
    if (status === 403) setStatusError("You don't have permission to change appointment status.");
    else if (status === 401) setStatusError("Session expired. Please log in again.");
    else setStatusError(err.response?.data?.message || "Action failed.");
  };

  const confirmMut = useMutation({ mutationFn: confirmAppointment, onSuccess: invalidate, onError: handleError });
  const cancelMut = useMutation({ mutationFn: cancelAppointment, onSuccess: invalidate, onError: handleError });
  const completeMut = useMutation({ mutationFn: completeAppointment, onSuccess: invalidate, onError: handleError });

  const canConfirm = user?.role === 'admin' || user?.role === 'doctor';
  const canCancel = user?.role === 'admin' || user?.role === 'receptionist';
  const canCreate = user?.role === 'admin' || user?.role === 'receptionist';

  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Manage and track clinic appointments">
        <Button variant="outline" asChild>
          <Link href="/appointments/calendar">
            <CalendarDays className="mr-2 h-4 w-4" />
            Calendar View
          </Link>
        </Button>
        {canCreate && (
          <Button onClick={() => setBookingOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        )}
      </PageHeader>

      {/* Unified booking modal — same as patient page */}
      <BookingModal
        open={bookingOpen}
        onOpenChange={(o) => { setBookingOpen(o); if (!o) invalidate(); }}
      />

      {/* Reschedule modal */}
      <BookingModal
        open={!!rescheduleData}
        onOpenChange={(o) => { if (!o) { setRescheduleData(undefined); invalidate(); } }}
        patientId={rescheduleData?.patient_id}
        appointmentToReschedule={rescheduleData}
      />

      {/* Status error banner */}
      {statusError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md flex justify-between items-center">
          <span>{statusError}</span>
          <Button variant="ghost" size="sm" onClick={() => setStatusError(null)} className="h-6 px-2 hover:bg-destructive/20 text-destructive">
            Dismiss
          </Button>
        </div>
      )}

      {/* Timezone notice */}
      {tz && (
        <p className="text-xs text-muted-foreground">
          All times are shown in <span className="font-medium">{tz}</span>.
        </p>
      )}

      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={5}><Skeleton className="h-5 w-full" /></TableCell>
              </TableRow>
            ))}
            {!isLoading && (!appointments || appointments.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-14">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <CalendarCheck className="h-8 w-8 opacity-30" />
                    <span className="text-sm">No appointments found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {appointments?.map((a) => {
              const doctor = doctors?.find((d) => d.id === a.doctor_id);
              const patient = patients?.find((p) => p.id === a.patient_id);
              return (
                <TableRow key={a.id} className="hover:bg-muted/30">
                  <TableCell>
                    <p className="text-sm font-medium">{formatClinicDate(a.start_time, tz)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatClinicTime(a.start_time, tz)} – {formatClinicTime(a.end_time, tz)}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {patient ? `${patient.first_name} ${patient.last_name}` : a.patient_id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {doctor?.full_name ?? a.doctor_id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {a.status === 'scheduled' && canConfirm && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => confirmMut.mutate(a.id)}>
                          <CheckCircle className="h-3 w-3" />Confirm
                        </Button>
                      )}
                      {a.status === 'confirmed' && canConfirm && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-950" onClick={() => completeMut.mutate(a.id)}>
                          <CheckCircle className="h-3 w-3" />Complete
                        </Button>
                      )}
                      {(a.status === 'scheduled' || a.status === 'confirmed') && canCancel && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => cancelMut.mutate(a.id)}>
                          <XCircle className="h-3 w-3" />Cancel
                        </Button>
                      )}
                      {(a.status === 'scheduled' || a.status === 'confirmed') && canCreate && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setRescheduleData({ id: a.id, doctor_id: a.doctor_id, patient_id: a.patient_id })}>
                          <RefreshCw className="h-3 w-3" />Reschedule
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
