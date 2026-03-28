'use client';

import { useQuery } from '@tanstack/react-query';
import { getPatient } from '@/lib/api/patients';
import { getPatientTimeline } from '@/lib/api/visits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle, CalendarPlus, FileText, Calendar as CalendarIcon, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { BookingModal } from '@/components/appointments/BookingModal';
import { AddNoteModal } from '@/components/patients/AddNoteModal';
import { PatientInvoices } from '@/components/invoices/PatientInvoices';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { AttachmentUploader } from '@/features/attachments/components/AttachmentUploader';
import { useState, use } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const { data: patient, isLoading } = useQuery({ queryKey: ['patient', params.id], queryFn: () => getPatient(params.id) });
  const { data: timelineData, isLoading: timelineLoading } = useQuery({ queryKey: ['timeline', params.id], queryFn: () => getPatientTimeline(params.id) });

  const timelineItems = [...(timelineData?.appointments || []), ...(timelineData?.visits || [])].sort(
    (a, b) => new Date('start_time' in b ? b.start_time : b.created_at).getTime() - new Date('start_time' in a ? a.start_time : a.created_at).getTime()
  );

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
        <div className="flex items-center gap-3">
          {user?.role === 'doctor' && (
            <Button variant="outline" onClick={() => setNoteOpen(true)} className="gap-2">
              <FileText className="h-4 w-4" />
              Add Notes
            </Button>
          )}
          <Button onClick={() => setBookingOpen(true)} className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      <BookingModal 
        patientId={params.id} 
        open={bookingOpen} 
        onOpenChange={setBookingOpen} 
      />

      <AddNoteModal
        patientId={params.id}
        open={noteOpen}
        onOpenChange={setNoteOpen}
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

      <PatientInvoices patientId={params.id} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reports & Files
          </CardTitle>
          <div className="mt-0">
            <AttachmentUploader patientId={params.id} />
          </div>
        </CardHeader>
        <CardContent>
          <AttachmentList patientId={params.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Timeline & History</CardTitle></CardHeader>
        <CardContent>
          {timelineLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : timelineItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No history or notes on record.</p>
          ) : (
            <div className="relative border-l border-border ml-3 mt-4 space-y-6">
              {timelineItems.map((item) => {
                const isVisit = 'notes' in item && !('reason' in item);
                const date = new Date(isVisit ? (item as any).created_at : (item as any).start_time);
                
                return (
                  <div key={item.id} className="relative pl-6">
                    <div className="absolute -left-3.5 top-1 bg-background border border-border p-1 rounded-full">
                      {isVisit ? <Stethoscope className="h-4 w-4 text-blue-500" /> : <CalendarIcon className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {isVisit ? 'Medical Visit Note' : 'Appointment'}
                          {!isVisit && <Badge variant={statusVariant((item as any).status)} className="capitalize text-[10px] h-5">{((item as any).status)}</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">{format(date, 'PPp')}</div>
                      </div>
                      
                      {isVisit ? (
                        <div className="text-sm space-y-2 mt-2">
                          <div>
                            <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">Notes</span>
                            <p className="text-foreground whitespace-pre-wrap">{(item as any).notes}</p>
                          </div>
                          {(item as any).diagnosis && (
                            <div>
                              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">Diagnosis</span>
                              <p className="text-foreground">{(item as any).diagnosis}</p>
                            </div>
                          )}
                          {(item as any).prescription && (
                            <div>
                              <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">Prescription</span>
                              <p className="text-foreground">{(item as any).prescription}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          <p>Reason: {(item as any).reason || 'General visit'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
