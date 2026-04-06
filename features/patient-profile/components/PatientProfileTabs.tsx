'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionCard } from '@/components/layout/SectionCard';
import { Stethoscope, Calendar, CreditCard, FileText, MessageSquare, User } from 'lucide-react';
import { PatientDTO, PatientRecentActivity as RecentActivityData } from '../types';
import { MedicalRecordList } from '@/features/medical/components/MedicalRecordList';
import { PatientInvoices } from '@/components/invoices/PatientInvoices';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { AttachmentUploader } from '@/features/attachments/components/AttachmentUploader';
import { WhatsAppReadinessCard } from '@/features/whatsappbot/components/WhatsAppReadinessCard';
import { WhatsAppHistoryList } from '@/features/whatsappbot/components/WhatsAppHistoryList';
import { NotificationHistoryList } from '@/features/notifications/components/NotificationHistoryList';
import { NotificationPreferencesForm } from '@/features/notifications/components/NotificationPreferencesForm';
import { ContactChannelReadiness } from '@/features/notifications/components/ContactChannelReadiness';
import { PatientRecentActivity } from './PatientRecentActivity';

interface PatientProfileTabsProps {
  patient: PatientDTO;
  activities: RecentActivityData;
}

export function PatientProfileTabs({ patient, activities }: PatientProfileTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
          { id: 'medical-records', label: 'Medical', icon: <Stethoscope className="h-4 w-4" /> },
          { id: 'appointments', label: 'History', icon: <Calendar className="h-4 w-4" /> },
          { id: 'billing', label: 'Billing', icon: <CreditCard className="h-4 w-4" /> },
          { id: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> },
          { id: 'communications', label: 'Communications', icon: <MessageSquare className="h-4 w-4" /> },
        ].map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="bg-transparent border-none shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-4 pb-3 pt-2"
          >
            <div className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="space-y-6">
        <TabsContent value="overview" className="focus-visible:outline-none m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <PatientRecentActivity activities={activities} />
              
              <SectionCard title="Patient Profile" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoField label="First Name" value={patient.first_name} />
                  <InfoField label="Last Name" value={patient.last_name} />
                  <InfoField label="Gender" value={patient.gender} className="capitalize" />
                  <InfoField label="DOB" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '—'} />
                  <InfoField label="Patient ID" value={patient.id.slice(0, 8)} />
                  <InfoField label="Registered" value={new Date(patient.created_at).toLocaleDateString()} />
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <ContactChannelReadiness patient={patient as any} />
              <WhatsAppReadinessCard patientId={patient.id} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medical-records" className="focus-visible:outline-none m-0">
          <SectionCard title="Medical Records" icon={Stethoscope}>
            <MedicalRecordList patientId={patient.id} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="appointments" className="focus-visible:outline-none m-0">
          <SectionCard title="Appointment History" icon={Calendar}>
             <p className="text-sm text-muted-foreground mb-4">Past and upcoming interactions with clinic doctors.</p>
             <div className="py-12 border-2 border-dashed rounded-lg text-center opacity-30">
               Timeline Integration Ready
             </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing" className="focus-visible:outline-none m-0">
          <SectionCard title="Invoices" icon={CreditCard}>
            <PatientInvoices patientId={patient.id} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="reports" className="focus-visible:outline-none m-0">
          <SectionCard
            title="Medical Reports"
            icon={FileText}
            action={<AttachmentUploader patientId={patient.id} />}
          >
            <AttachmentList patientId={patient.id} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="communications" className="focus-visible:outline-none m-0">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <NotificationPreferencesForm patientId={patient.id} />
            </div>
            <div className="md:col-span-2 space-y-6">
              <SectionCard title="WhatsApp Native Logs" icon={MessageSquare}>
                <WhatsAppHistoryList patientId={patient.id} />
              </SectionCard>
              <NotificationHistoryList patientId={patient.id} />
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

function InfoField({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</dt>
      <dd className="text-sm border rounded-md p-2 bg-muted/20">{value || '—'}</dd>
    </div>
  );
}
