'use client';

import { PatientSummary } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CreditCard, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientSnapshotCardsProps {
  summary: PatientSummary;
}

export function PatientSnapshotCards({ summary }: PatientSnapshotCardsProps) {
  const cards = [
    {
      label: 'Upcoming Visit',
      value: summary.upcoming_appointment_at ? new Date(summary.upcoming_appointment_at).toLocaleDateString() : 'None scheduled',
      subValue: summary.upcoming_appointment_at ? 'Confirmed' : 'No upcoming visits',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Billing Status',
      value: summary.unpaid_invoices_count > 0 ? `${summary.unpaid_invoices_count} Unpaid` : 'All Paid',
      subValue: `Total Invoices: ${summary.total_invoices}`,
      icon: CreditCard,
      color: summary.unpaid_invoices_count > 0 ? 'text-amber-500' : 'text-emerald-500',
      bgColor: summary.unpaid_invoices_count > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10',
      borderColor: summary.unpaid_invoices_count > 0 ? 'border-amber-500/20' : 'border-emerald-500/20',
    },
    {
      label: 'Last Interaction',
      value: summary.last_visit_at ? new Date(summary.last_visit_at).toLocaleDateString() : 'Never',
      subValue: 'Last completed visit',
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Medical Records',
      value: summary.medical_records_count,
      subValue: `${summary.attachments_count} Attachments`,
      icon: FileText,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      label: 'Clinic Attendance',
      value: `${summary.completed_appointments}/${summary.total_appointments}`,
      subValue: 'Completed / Total',
      icon: CheckCircle2,
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 px-4 py-6">
      {cards.map((card, i) => (
        <Card key={i} className={cn(
          "relative overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 group",
          card.borderColor
        )}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {card.label}
                </p>
                <h4 className="text-sm font-bold truncate">
                  {card.value}
                </h4>
                <p className="text-[10px] text-muted-foreground truncate">
                  {card.subValue}
                </p>
              </div>
              <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110 duration-300", card.bgColor)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </div>
            {/* Subtle bottom accent line */}
            <div className={cn("absolute bottom-0 left-0 h-0.5 w-full bg-current opacity-20", card.color)} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
