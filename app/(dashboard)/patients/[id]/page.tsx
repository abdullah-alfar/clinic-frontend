'use client';

import { useQuery } from '@tanstack/react-query';
import { getPatient } from '@/lib/api/patients';
import { getPatientTimeline } from '@/lib/api/visits';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarPlus, FileText, Calendar as CalendarIcon, Stethoscope, UserCircle, Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookingModal } from '@/components/appointments/BookingModal';
import { AddNoteModal } from '@/components/patients/AddNoteModal';
import { PatientInvoices } from '@/components/invoices/PatientInvoices';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { AttachmentUploader } from '@/features/attachments/components/AttachmentUploader';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatClinicDate, formatClinicDateTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import { useState, use } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', params.id],
    queryFn: () => getPatient(params.id),
  });

  const { data: timelineData, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline', params.id],
    queryFn: () => getPatientTimeline(params.id),
  });

  const timelineItems = [
    ...(timelineData?.appointments || []),
    ...(timelineData?.visits || []),
  ].sort((a, b) => {
    const aTime = 'start_time' in a ? a.start_time : (a as any).created_at;
    const bTime = 'start_time' in b ? b.start_time : (b as any).created_at;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Patient Profile"
        description="Detailed patient record"
        onBack={() => router.back()}
      >
        {user?.role === 'doctor' && (
          <Button variant="outline" onClick={() => setNoteOpen(true)} className="gap-2">
            <FileText className="h-4 w-4" />
            Add Note
          </Button>
        )}
        <Button onClick={() => setBookingOpen(true)} className="gap-2">
          <CalendarPlus className="h-4 w-4" />
          Book Appointment
        </Button>
      </PageHeader>

      <BookingModal patientId={params.id} open={bookingOpen} onOpenChange={setBookingOpen} />
      <AddNoteModal patientId={params.id} open={noteOpen} onOpenChange={setNoteOpen} />

      {/* Personal Information */}
      <SectionCard title="Personal Information" icon={UserCircle}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
          </div>
        ) : patient ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InfoField label="Full Name" value={`${patient.first_name} ${patient.last_name}`} />
            <InfoField label="Email" value={patient.email} />
            <InfoField label="Phone" value={patient.phone} />
            <InfoField label="Gender" value={patient.gender} className="capitalize" />
            <InfoField label="Date of Birth" value={formatClinicDate(patient.date_of_birth)} />
            <InfoField label="Registered" value={formatClinicDate(patient.created_at)} />
            {patient.notes && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground mb-1">Notes</dt>
                <dd className="text-sm">{patient.notes}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-muted-foreground text-sm">Patient not found.</p>
        )}
      </SectionCard>

      {/* Billing / Invoices */}
      <PatientInvoices patientId={params.id} />

      {/* Reports & Files */}
      <SectionCard
        title="Reports & Files"
        icon={Paperclip}
        action={<AttachmentUploader patientId={params.id} />}
      >
        <AttachmentList patientId={params.id} />
      </SectionCard>

      {/* Timeline */}
      <SectionCard title="Timeline & History" icon={CalendarIcon}>
        {timelineLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : timelineItems.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No history or notes on record.</p>
        ) : (
          <div className="relative border-l border-border ml-3 space-y-5 mt-2">
            {timelineItems.map((item) => {
              const isVisit = 'notes' in item && !('reason' in item);
              const rawDate = isVisit ? (item as any).created_at : (item as any).start_time;

              return (
                <div key={item.id} className="relative pl-7">
                  {/* Timeline dot */}
                  <div className="absolute -left-[18px] top-2 bg-background border-2 border-border rounded-full p-1">
                    {isVisit
                      ? <Stethoscope className="h-3.5 w-3.5 text-primary" />
                      : <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>

                  <div className="bg-card border border-border/70 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {isVisit ? 'Medical Note' : 'Appointment'}
                        {!isVisit && <StatusBadge status={(item as any).status} className="text-[10px] h-5" />}
                      </div>
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatClinicDateTime(rawDate, tz)}
                      </time>
                    </div>

                    {isVisit ? (
                      <div className="text-sm space-y-2">
                        {(item as any).notes && (
                          <NoteField label="Notes" value={(item as any).notes} />
                        )}
                        {(item as any).diagnosis && (
                          <NoteField label="Diagnosis" value={(item as any).diagnosis} />
                        )}
                        {(item as any).prescription && (
                          <NoteField label="Prescription" value={(item as any).prescription} />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {(item as any).reason || 'General visit'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function InfoField({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
      <dd className={`text-sm font-medium ${className ?? ''}`}>{value || '—'}</dd>
    </div>
  );
}

function NoteField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">{label}</span>
      <p className="text-foreground whitespace-pre-wrap">{value}</p>
    </div>
  );
}
