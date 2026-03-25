'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DoctorSelect } from './DoctorSelect';
import { AvailabilitySelector } from './AvailabilitySelector';
import { DatePicker } from './DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slot } from '@/types';
import { useCreateAppointment, extractApiError } from '@/hooks/useCreateAppointment';
import { format } from 'date-fns';

interface Props {
  patientId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function BookingModal({ patientId, open, onOpenChange }: Props) {
  const [doctorId, setDoctorId] = useState<string>('any');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ slot: Slot; doctor_id: string } | null>(null);
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutateAsync: createAppointment, isPending } = useCreateAppointment();

  const handleBook = async () => {
    if (!selectedSlot) return;
    // Validate the doctor_id is real before submitting
    if (!selectedSlot.doctor_id) {
      setErrorMsg('Please select a valid doctor before confirming.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await createAppointment({
        patient_id: patientId,
        doctor_id: selectedSlot.doctor_id,
        start_time: selectedSlot.slot.start_time,
        end_time: selectedSlot.slot.end_time,
        reason,
      });
      setSuccessMsg('Appointment booked successfully!');
      setSelectedSlot(null);
      setReason('');
      // Close after a brief moment so user sees success
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1500);
    } catch (e) {
      const msg = extractApiError(e);
      setErrorMsg(msg);
      // selectedSlot is intentionally kept so user sees what failed,
      // but availability is already being invalidated by onError in the hook
    }
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setErrorMsg(null);
      setSuccessMsg(null);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl">Book Appointment</DialogTitle>
          <DialogDescription>Find available times and schedule a new visit instantly.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Success / Error feedback */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Doctor Filter</Label>
              <DoctorSelect value={doctorId} onChange={(v) => { setDoctorId(v); setSelectedSlot(null); setErrorMsg(null); }} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">Date</Label>
              <DatePicker
                date={date}
                setDate={(d) => { setDate(d); setSelectedSlot(null); setErrorMsg(null); }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>

          <div className="space-y-3 bg-muted/20 p-4 border rounded-lg">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Available Slots</Label>
            <AvailabilitySelector
              date={date ? format(date, 'yyyy-MM-dd') : ''}
              doctorId={doctorId}
              selectedSlotStartTime={selectedSlot?.slot.start_time}
              onSlotSelect={(slot, docId) => {
                setSelectedSlot({ slot, doctor_id: docId });
                setErrorMsg(null);
              }}
            />
          </div>

          <div className="space-y-2 pt-1 border-t">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">Reason for Visit <span className="font-normal normal-case">(Optional)</span></Label>
            <Input
              placeholder="e.g. Follow-up consultation"
              className="text-sm"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            disabled={!selectedSlot || !selectedSlot.slot.is_available || isPending}
            onClick={handleBook}
          >
            {isPending ? 'Booking...' : 'Confirm Schedule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
