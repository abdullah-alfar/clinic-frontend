'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionCard } from '@/components/layout/SectionCard';
import { 
  History, 
  Stethoscope, 
  Calendar, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  User, 
  ClipboardList 
} from 'lucide-react';
import { PatientDTO } from '../types';
import { MedicalRecordList } from '@/features/medical/components/MedicalRecordList';
import { PatientInvoices } from '@/components/invoices/PatientInvoices';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { AttachmentUploader } from '@/features/attachments/components/AttachmentUploader';
import { WhatsAppReadinessCard } from '@/features/whatsappbot/components/WhatsAppReadinessCard';
import { WhatsAppHistoryList } from '@/features/whatsappbot/components/WhatsAppHistoryList';
import { NotificationHistoryList } from '@/features/notifications/components/NotificationHistoryList';
import { NotificationPreferencesForm } from '@/features/notifications/components/NotificationPreferencesForm';
import { ContactChannelReadiness } from '@/features/notifications/components/ContactChannelReadiness';
import { MedicalTimelineList } from '@/features/timeline/components/MedicalTimelineList';
import { FollowUpList } from '@/features/followups/components/FollowUpList';
import { PatientRecentActivity } from './PatientRecentActivity';

interface PatientProfileTabsProps {
  patient: PatientDTO;
}

/**
 * PatientProfileTabs Component
 * Refactored to a minimalist enterprise design.
 * Removes complex glassmorphism and uses simple bottom-border indicators.
 */
export function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  const TABS = [
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'overview', label: 'Details', icon: User },
    { id: 'medical', label: 'Clinical', icon: Stethoscope },
    { id: 'billing', label: 'Financial', icon: CreditCard },
    { id: 'files', label: 'Documents', icon: FileText },
    { id: 'communications', label: 'Engagement', icon: MessageSquare },
  ];

  return (
    <div className="px-6 md:px-8">
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 mb-6 gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="bg-transparent border-none shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-0 pb-4 pt-2 font-bold transition-all text-muted-foreground/60 hover:text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="text-sm whitespace-nowrap">{tab.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="pt-2">
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="focus-visible:outline-none m-0">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                   <PatientRecentActivity patientId={patient.id} />
                </div>
                <div className="lg:col-span-4 space-y-6">
                   <SectionCard title="Quick Overview" icon={User} className="border-none shadow-sm bg-muted/20">
                      <div className="space-y-4">
                        <InfoItem label="Gender" value={patient.gender || '—'} className="capitalize" />
                        <InfoItem label="DOB" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : '—'} />
                        <InfoItem label="Patient Since" value={new Date(patient.created_at).toLocaleDateString()} />
                      </div>
                   </SectionCard>
                   <ContactChannelReadiness patient={patient as any} />
                </div>
             </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="overview" className="focus-visible:outline-none m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <SectionCard title="Personal Information" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem label="First Name" value={patient.first_name} />
                  <InfoItem label="Last Name" value={patient.last_name} />
                  <InfoItem label="Email Address" value={patient.email || '—'} />
                  <InfoItem label="Phone Number" value={patient.phone || '—'} />
                </div>
              </SectionCard>
              <div className="space-y-6">
                 <WhatsAppReadinessCard patientId={patient.id} />
              </div>
            </div>
          </TabsContent>

          {/* Clinical Tab */}
          <TabsContent value="medical" className="focus-visible:outline-none m-0">
            <SectionCard title="Medical Records" icon={Stethoscope}>
              <MedicalRecordList patientId={patient.id} />
            </SectionCard>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="billing" className="focus-visible:outline-none m-0">
            <SectionCard title="Billing History" icon={CreditCard}>
              <PatientInvoices patientId={patient.id} />
            </SectionCard>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="files" className="focus-visible:outline-none m-0">
            <SectionCard
              title="Patient Documents"
              icon={FileText}
              action={<AttachmentUploader patientId={patient.id} />}
            >
              <AttachmentList patientId={patient.id} />
            </SectionCard>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="focus-visible:outline-none m-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <NotificationPreferencesForm patientId={patient.id} />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <SectionCard title="WhatsApp Correspondence" icon={MessageSquare}>
                  <WhatsAppHistoryList patientId={patient.id} />
                </SectionCard>
                <NotificationHistoryList patientId={patient.id} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function InfoItem({ label, value, className }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={className}>
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value || '—'}</span>
    </div>
  );
}
