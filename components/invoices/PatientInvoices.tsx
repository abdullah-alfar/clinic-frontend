'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Plus, CheckCircle } from 'lucide-react';
import { usePatientInvoices, useMarkInvoicePaid } from '@/hooks/useInvoices';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { format } from 'date-fns';

interface Props {
  patientId: string;
}

export function PatientInvoices({ patientId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: invoices, isLoading } = usePatientInvoices(patientId);
  const { mutate: markPaid, isPending: isMarking } = useMarkInvoicePaid(patientId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4" /> Billing & Invoices
        </CardTitle>
        <Button size="sm" variant="outline" onClick={() => setModalOpen(true)} className="gap-1 h-8">
          <Plus className="h-3 w-3" /> New Invoice
        </Button>
      </CardHeader>
      <CardContent>
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
                    <td className="py-3">{format(new Date(inv.created_at), 'MMM d, yyyy')}</td>
                    <td className="py-3 font-medium">${inv.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'} className="capitalize bg-opacity-20 text-xs">
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {inv.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={() => markPaid(inv.id)}
                          disabled={isMarking}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark Paid
                        </Button>
                      )}
                      {inv.status === 'paid' && (
                        <span className="text-muted-foreground text-xs italic px-2">Paid on {format(new Date(inv.updated_at), 'MMM d')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
