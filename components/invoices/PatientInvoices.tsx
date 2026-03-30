'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Plus, CheckCircle } from 'lucide-react';
import { usePatientInvoices, useMarkInvoicePaid } from '@/hooks/useInvoices';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { StatusBadge } from '@/components/ui/status-badge';
import { SectionCard } from '@/components/layout/SectionCard';
import { formatClinicDate } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';

interface Props {
  patientId: string;
}

export function PatientInvoices({ patientId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: invoices, isLoading } = usePatientInvoices(patientId);
  const { mutate: markPaid, isPending: isMarking } = useMarkInvoicePaid(patientId);
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

  return (
    <SectionCard
      title="Billing & Invoices"
      icon={FileText}
      action={
        <Button size="sm" variant="outline" onClick={() => setModalOpen(true)} className="gap-1 h-8">
          <Plus className="h-3 w-3" /> New Invoice
        </Button>
      }
    >
      <CreateInvoiceModal
        patientId={patientId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : invoices?.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">No invoices found for this patient.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Amount</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-3">{formatClinicDate(inv.created_at, tz)}</td>
                  <td className="py-3 font-medium">${inv.amount.toFixed(2)}</td>
                  <td className="py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3 text-right">
                    {inv.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                        onClick={() => markPaid(inv.id)}
                        disabled={isMarking}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Mark Paid
                      </Button>
                    )}
                    {inv.status === 'paid' && (
                      <span className="text-muted-foreground text-xs italic px-2">
                        Paid on {formatClinicDate(inv.updated_at, tz, 'MMM d')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
