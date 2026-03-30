'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AlertCircle, CheckCircle2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DoctorSelect } from './DoctorSelect';
import { PatientSelect } from './PatientSelect';
import { AvailabilitySelector } from './AvailabilitySelector';
import { DatePicker } from './DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slot } from '@/types';
import { useCreateAppointment, extractApiError } from '@/hooks/useCreateAppointment';
import { useRescheduleAppointment } from '@/hooks/useRescheduleAppointment';
import { format } from 'date-fns';

interface Props {
  /** When provided the patient selector is hidden (patient page flow). */
  patientId?: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  appointmentToReschedule?: { id: string; doctor_id: string; patient_id: string };
}

export function BookingModal({ patientId, open, onOpenChange, appointmentToReschedule }: Props) {
  const isStandaloneMode = !patientId && !appointmentToReschedule;

  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || '');
  const [patientError, setPatientError] = useState(false);
  const [doctorId, setDoctorId] = useState<string>(appointmentToReschedule?.doctor_id || 'any');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{ slot: Slot; doctor_id: string } | null>(null);
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { mutateAsync: createAppointment, isPending: isCreating } = useCreateAppointment();
  const { mutateAsync: rescheduleAppointment, isPending: isRescheduling } = useRescheduleAppointment();
  const isPending = isCreating || isRescheduling;

  useEffect(() => {
    if (open) {
      setDoctorId(appointmentToReschedule?.doctor_id || 'any');
      setDate(new Date());
      setSelectedSlot(null);
      setReason('');
      setErrorMsg(null);
      setSuccessMsg(null);
      setPatientError(false);
      // In standalone mode, reset the patient selector. In patient-page mode, keep the fixed patientId.
      if (!patientId) {
        setSelectedPatientId(appointmentToReschedule?.patient_id || '');
      } else {
        setSelectedPatientId(patientId);
      }
    }
  }, [open, appointmentToReschedule, patientId]);

  const resolvedPatientId = patientId || selectedPatientId;

  const handleBook = async () => {
    if (!selectedSlot) return;

    if (!resolvedPatientId) {
      setPatientError(true);
      setErrorMsg('Please select a patient before booking.');
      return;
    }
    if (!selectedSlot.doctor_id) {
      setErrorMsg('Please select a valid doctor before confirming.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setPatientError(false);

    try {
      if (appointmentToReschedule) {
        await rescheduleAppointment({
          id: appointmentToReschedule.id,
          payload: {
            start_time: selectedSlot.slot.start_time,
            end_time: selectedSlot.slot.end_time,
          }
        });
        setSuccessMsg('Appointment rescheduled successfully!');
      } else {
        await createAppointment({
          patient_id: resolvedPatientId,
          doctor_id: selectedSlot.doctor_id,
          start_time: selectedSlot.slot.start_time,
          end_time: selectedSlot.slot.end_time,
          reason,
        });
        setSuccessMsg('Appointment booked successfully!');
      }
      setSelectedSlot(null);
      setReason('');
      setTimeout(() => {
        setSuccessMsg(null);
        onOpenChange(false);
      }, 1500);
    } catch (e) {
      const msg = extractApiError(e);
      setErrorMsg(msg);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = useCallback((slot: Slot, docId: string) => {
    setSelectedSlot({ slot, doctor_id: docId });
    setErrorMsg(null);
  }, []);

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
          <DialogTitle className="text-xl">
            {appointmentToReschedule ? 'Reschedule Appointment' : 'Book Appointment'}
          </DialogTitle>
          <DialogDescription>
            {appointmentToReschedule
              ? 'Select a new time for this appointment.'
              : 'Find available times and schedule a new visit instantly.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Feedback */}
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

          {/* Patient selector — only shown in standalone (appointments page) mode */}
          {isStandaloneMode && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Patient <span className="text-destructive">*</span>
              </Label>
              <PatientSelect
                value={selectedPatientId}
                onChange={(v) => { setSelectedPatientId(v); setPatientError(false); setErrorMsg(null); }}
                error={patientError}
              />
            </div>
          )}

          {/* Doctor + Date selectors */}
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

          {/* Availability slots */}
          <div className="space-y-3 bg-muted/20 p-4 border border-border/50 rounded-lg">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Available Slots</Label>
            <AvailabilitySelector
              date={date ? format(date, 'yyyy-MM-dd') : ''}
              doctorId={doctorId}
              selectedSlotStartTime={selectedSlot?.slot.start_time}
              onSlotSelect={handleSlotSelect}
            />
          </div>

          {/* Reason */}
          <div className="space-y-1.5 pt-1 border-t border-border/50">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Reason for Visit <span className="font-normal normal-case">(Optional)</span>
            </Label>
            <Input
              placeholder="e.g. Follow-up consultation"
              className="text-sm"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border/50">
          <Button variant="ghost" onClick={() => handleClose(false)} disabled={isPending}>Cancel</Button>
          <Button
            disabled={!selectedSlot || selectedSlot.slot.status !== 'available' || isPending}
            onClick={handleBook}
          >
            {isPending
              ? (appointmentToReschedule ? 'Rescheduling…' : 'Booking…')
              : (appointmentToReschedule ? 'Confirm Reschedule' : 'Confirm Booking')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
