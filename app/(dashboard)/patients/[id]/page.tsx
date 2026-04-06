'use client';

import { useQuery } from '@tanstack/react-query';
import { getPatient } from '@/lib/api/patients';
import { getPatientTimeline } from '@/lib/api/visits';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  CalendarPlus, 
  FileText, 
  Calendar as CalendarIcon, 
  Stethoscope, 
  UserCircle, 
  Paperclip,
  Phone,
  Mail,
  MoreVertical,
  Plus,
  CreditCard,
  FileBarChart
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookingModal } from '@/components/appointments/BookingModal';
import { AddNoteModal } from '@/components/patients/AddNoteModal';
import { PatientInvoices } from '@/components/invoices/PatientInvoices';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { AttachmentUploader } from '@/features/attachments/components/AttachmentUploader';
import { ContactChannelReadiness } from '@/features/notifications/components/ContactChannelReadiness';
import { NotificationHistoryList } from '@/features/notifications/components/NotificationHistoryList';
import { NotificationPreferencesForm } from '@/features/notifications/components/NotificationPreferencesForm';
import { MedicalRecordList } from '@/features/medical/components/MedicalRecordList';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatClinicDate, formatClinicDateTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import { useState, use } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted p-4 rounded-full mb-4">
          <UserCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Patient Not Found</h2>
        <p className="text-muted-foreground mt-2">The record you are looking for does not exist or has been removed.</p>
        <Button variant="outline" className="mt-6" onClick={() => router.push('/patients')}>
          Back to Patients
        </Button>
      </div>
    );
  }

  const patientName = `${patient.first_name} ${patient.last_name}`;

  return (
    <div className="space-y-6 pb-10">
      {/* Compact Summary Header */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm modern-gradient-subtle backdrop-blur-sm sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
              <UserCircle className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight">{patientName}</h1>
                <Badge variant="outline" className="bg-background/50 border-border/60 text-xs font-semibold px-2.5 py-0.5">
                  ID: {patient.id.slice(0, 8)}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {patient.phone || 'No phone'}</span>
                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {patient.email || 'No email'}</span>
                <span className="flex items-center gap-1.5"><CalendarIcon className="h-3.5 w-3.5" /> {formatClinicDate(patient.date_of_birth)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={() => setBookingOpen(true)} className="flex-1 sm:flex-none gap-2 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <CalendarPlus className="h-4 w-4" />
              Book Appointment
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/60">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border/60 shadow-xl">
                <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 py-2">Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setNoteOpen(true)} className="rounded-xl gap-2 p-2.5">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>Add Medical Note</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl gap-2 p-2.5">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <span>Create Invoice</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl gap-2 p-2.5">
                  <Paperclip className="h-4 w-4 text-amber-500" />
                  <span>Upload Report</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl gap-2 p-2.5 text-destructive focus:text-destructive">
                  <MoreVertical className="h-4 w-4 opacity-70" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <BookingModal patientId={params.id} open={bookingOpen} onOpenChange={setBookingOpen} />
      <AddNoteModal patientId={params.id} open={noteOpen} onOpenChange={setNoteOpen} />

      {/* Main Tabs System */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-1 overflow-x-auto scroolbar-hide">
          <TabsList className="bg-transparent border-none gap-6 h-auto p-0 min-w-max">
            {['overview', 'medical-records', 'appointments', 'billing', 'reports', 'notes', 'communications'].map((tab) => (
              <TabsTrigger 
                key={tab}
                value={tab} 
                className="bg-transparent border-none shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-0 pb-3 transition-all capitalize font-semibold"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <SectionCard title="Patient Profile" icon={UserCircle}>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoField label="First Name" value={patient.first_name} />
                  <InfoField label="Last Name" value={patient.last_name} />
                  <InfoField label="Gender" value={patient.gender} className="capitalize" />
                  <InfoField label="Date of Birth" value={formatClinicDate(patient.date_of_birth)} />
                  <InfoField label="Registered Since" value={formatClinicDate(patient.created_at)} />
                  {patient.notes && (
                    <div className="sm:col-span-2 p-4 rounded-xl bg-muted/30 border border-border/40 italic text-muted-foreground">
                      <dt className="text-xs font-bold uppercase tracking-wider mb-2 not-italic">Internal Notes</dt>
                      <dd className="text-sm whitespace-pre-wrap">{patient.notes}</dd>
                    </div>
                  )}
                </dl>
              </SectionCard>

              <SectionCard title="Contact Details" icon={Phone}>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoField label="Phone Number" value={patient.phone} />
                  <InfoField label="Email Address" value={patient.email} />
                </dl>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="Quick Stats" icon={FileBarChart}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Total Visits</span>
                    <span className="text-lg font-bold text-primary">{timelineData?.visits?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Appointments</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{timelineData?.appointments?.length || 0}</span>
                  </div>
                </div>
              </SectionCard>
              
              <SectionCard title="Risk Factors" icon={Stethoscope} className="border-amber-500/20 bg-amber-500/5">
                <p className="text-sm text-amber-800 dark:text-amber-200 opacity-80">
                  No specific allergies or risk factors documented for this patient.
                </p>
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medical-records" className="focus-visible:outline-none focus-visible:ring-0 mt-6">
          <SectionCard title="Medical History" icon={Stethoscope}>
            <MedicalRecordList patientId={params.id} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="appointments" className="focus-visible:outline-none focus-visible:ring-0">
          <SectionCard title="Upcoming & Past Appointments" icon={CalendarIcon}>
            {timelineLoading ? (
              <div className="space-y-4 pt-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : timelineData?.appointments?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
                <CalendarIcon className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
                <p className="text-sm text-muted-foreground">No appointments scheduled for this patient.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setBookingOpen(true)}>Book Now</Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {timelineData?.appointments?.map((apt: any) => (
                  <div key={apt.id} className="group relative flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:bg-accent/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex flex-col items-center justify-center border border-border/40">
                         <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none">{new Date(apt.start_time).toLocaleString('en-US', { month: 'short' })}</span>
                         <span className="text-lg font-extrabold leading-none">{new Date(apt.start_time).getDate()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{apt.reason || 'Routine Checkup'}</p>
                        <p className="text-xs text-muted-foreground">{formatClinicDateTime(apt.start_time, tz)}</p>
                      </div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing" className="focus-visible:outline-none focus-visible:ring-0">
          <SectionCard title="Invoices & Payments" icon={CreditCard}>
            <PatientInvoices patientId={params.id} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SectionCard
                title="Medical Reports"
                icon={Paperclip}
                action={<AttachmentUploader patientId={params.id} />}
              >
                <AttachmentList patientId={params.id} />
              </SectionCard>
            </div>
            <div className="space-y-6">
               <SectionCard title="Ask AI (Reports)" icon={Stethoscope} className="bg-primary/5 border-primary/20">
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      AI can summarize this patient's medical history or answer questions based on uploaded reports.
                    </p>
                    <div className="p-3 rounded-xl bg-background border border-border/40 text-sm text-center italic opacity-60">
                      [Mocked] Upload a report to start an AI summary.
                    </div>
                    <Button variant="outline" className="w-full text-xs gap-2" disabled>
                      <Plus className="h-3 w-3" /> Start AI Analysis
                    </Button>
                  </div>
               </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="focus-visible:outline-none focus-visible:ring-0">
          <SectionCard 
            title="Clinical Notes History" 
            icon={Stethoscope}
            action={user?.role === 'doctor' && (
              <Button variant="outline" size="sm" onClick={() => setNoteOpen(true)} className="gap-2">
                <Plus className="h-3 w-3" /> New Note
              </Button>
            )}
          >
            {timelineLoading ? (
              <div className="space-y-4 pt-4">
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            ) : timelineData?.visits?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
                <p className="text-sm text-muted-foreground">No clinical notes recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {timelineData?.visits?.map((visit: any) => (
                  <div key={visit.id} className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                          <Stethoscope className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Medical Examination</p>
                          <p className="text-xs text-muted-foreground">{formatClinicDateTime(visit.created_at, tz)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                       {visit.notes && <NoteField label="Observations" value={visit.notes} />}
                       {visit.diagnosis && <NoteField label="Diagnosis" value={visit.diagnosis} />}
                       {visit.prescription && <NoteField label="Prescription" value={visit.prescription} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
          
          <SectionCard title="Timeline Integration" icon={CalendarIcon} className="mt-6">
            <div className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-xl border">
               Integration ready. Visit timeline events (including type: 'medical_record') will populate dynamically as updates propagate.
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="communications" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <ContactChannelReadiness patient={patient} />
              <NotificationPreferencesForm patientId={params.id} />
            </div>
            <div className="md:col-span-2">
              <NotificationHistoryList patientId={params.id} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoField({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</dt>
      <dd className="text-sm font-medium">{value || <span className="text-muted-foreground italic">—</span>}</dd>
    </div>
  );
}

function NoteField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">{label}</span>
      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}
