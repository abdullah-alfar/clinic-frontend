'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateInvoice } from '@/hooks/useInvoices';

interface Props {
  patientId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  // Can optionally pass appointment ID if we are creating from an appointment context
  appointmentId?: string;
}

export function CreateInvoiceModal({ patientId, open, onOpenChange, appointmentId }: Props) {
  const [amount, setAmount] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutateAsync: createInvoice, isPending } = useCreateInvoice(patientId);

  const handleCreate = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0');
      return;
    }

    try {
      await createInvoice({
        patient_id: patientId,
        appointment_id: appointmentId,
        amount: parsedAmount,
      });

      setSuccessMsg('Invoice created successfully!');
      setErrorMsg(null);
      setAmount('');
      
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1500);

    } catch (e: any) {
      setErrorMsg(e.response?.data?.message || 'Failed to create invoice');
      setSuccessMsg(null);
    }
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setAmount('');
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
          <DialogDescription>
            Generate a new invoice for this patient.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {successMsg && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">{successMsg}</AlertDescription>
            </Alert>
          )}
          {errorMsg && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => handleClose(false)}>Cancel</Button>
          <Button disabled={isPending || !amount} onClick={handleCreate}>
            {isPending ? 'Creating...' : 'Create Invoice'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
