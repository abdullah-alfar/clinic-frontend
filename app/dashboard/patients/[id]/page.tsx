'use client';

import { useQuery } from '@tanstack/react-query';
import { getPatient } from '@/lib/api/patients';
import { getAppointments } from '@/lib/api/appointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { BookingModal } from '@/components/appointments/BookingModal';
import { useState, use } from 'react';
import { CalendarPlus } from 'lucide-react';

export default function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const { data: patient, isLoading } = useQuery({ queryKey: ['patient', params.id], queryFn: () => getPatient(params.id) });
  const { data: appointments } = useQuery({ queryKey: ['appointments'], queryFn: () => getAppointments() });

  const patientAppts = appointments?.filter((a) => a.patient_id === params.id) ?? [];

  const statusVariant = (s: string) => {
    if (s === 'completed') return 'default';
    if (s === 'canceled') return 'destructive';
    if (s === 'confirmed') return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Patient Profile</h1>
            <p className="text-muted-foreground text-sm">Detailed patient record</p>
          </div>
        </div>
        <Button onClick={() => setBookingOpen(true)} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <BookingModal 
        patientId={params.id} 
        open={bookingOpen} 
        onOpenChange={setBookingOpen} 
      />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserCircle className="h-5 w-5" />Personal Information</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
          ) : patient ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">{patient.first_name} {patient.last_name}</p></div>
              <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{patient.email || '—'}</p></div>
              <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{patient.phone || '—'}</p></div>
              <div><p className="text-xs text-muted-foreground">Gender</p><p className="font-medium capitalize">{patient.gender || '—'}</p></div>
              <div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="font-medium">{patient.date_of_birth ? format(new Date(patient.date_of_birth), 'MMM d, yyyy') : '—'}</p></div>
              <div><p className="text-xs text-muted-foreground">Registered</p><p className="font-medium">{format(new Date(patient.created_at), 'MMM d, yyyy')}</p></div>
              {patient.notes && <div className="col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p className="font-medium">{patient.notes}</p></div>}
            </div>
          ) : (
            <p className="text-muted-foreground">Patient not found.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Appointment History</CardTitle></CardHeader>
        <CardContent>
          {patientAppts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No appointments on record.</p>
          ) : (
            <div className="divide-y divide-border">
              {patientAppts.map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{format(new Date(a.start_time), 'PPp')}</p>
                    <p className="text-xs text-muted-foreground">{a.reason || 'General visit'}</p>
                  </div>
                  <Badge variant={statusVariant(a.status)} className="capitalize text-xs">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
