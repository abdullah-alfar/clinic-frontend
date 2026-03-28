'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
} from '@/lib/api/appointments';
import { useAuthStore } from '@/hooks/useAuthStore';
import { CalendarDays, Clock, User, Stethoscope, FileText, CheckCircle, XCircle } from 'lucide-react';
import type { CalendarAppointment } from '../types';
import type { AppointmentStatus } from '@/types';

const STATUS_BADGE: Record<AppointmentStatus, 'outline' | 'secondary' | 'default' | 'destructive'> = {
  scheduled: 'outline',
  confirmed: 'secondary',
  completed: 'default',
  canceled: 'destructive',
};

interface AppointmentDetailsDialogProps {
  appointment: CalendarAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog shown when a user clicks an appointment event in the calendar.
 * Displays full appointment details and exposes contextual action buttons
 * respecting the user's role and the appointment's current status.
 */
export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['calendar-appointments'] });
    onOpenChange(false);
  };

  const handleError = (err: unknown, action: string) => {
    const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
    const status = axiosErr.response?.status;
    if (status === 403) toast.error("You don't have permission to perform this action.");
    else if (status === 401) toast.error('Session expired. Please log in again.');
    else toast.error(axiosErr.response?.data?.message ?? `Failed to ${action} appointment.`);
  };

  const confirmMut = useMutation({
    mutationFn: confirmAppointment,
    onSuccess: () => { invalidate(); toast.success('Appointment confirmed.'); },
    onError: (e) => handleError(e, 'confirm'),
  });

  const cancelMut = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => { invalidate(); toast.success('Appointment cancelled.'); },
    onError: (e) => handleError(e, 'cancel'),
  });

  const completeMut = useMutation({
    mutationFn: completeAppointment,
    onSuccess: () => { invalidate(); toast.success('Appointment marked complete.'); },
    onError: (e) => handleError(e, 'complete'),
  });

  if (!appointment) return null;

  const canConfirm = user?.role === 'admin' || user?.role === 'doctor';
  const canCancel = user?.role === 'admin' || user?.role === 'receptionist';
  const isPending =
    confirmMut.isPending || cancelMut.isPending || completeMut.isPending;

  const startDate = new Date(appointment.start_time);
  const endDate = new Date(appointment.end_time);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            <Badge
              variant={STATUS_BADGE[appointment.status]}
              className="capitalize mt-1"
            >
              {appointment.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {/* Date and time */}
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">
                {format(startDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-muted-foreground">
                {format(startDate, 'h:mm a')} – {format(endDate, 'h:mm a')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Patient */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Patient</p>
              <p className="font-medium">{appointment.patient_name}</p>
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-3">
            <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Doctor</p>
              <p className="font-medium">{appointment.doctor_name}</p>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Reason</p>
                  <p className="text-foreground">{appointment.reason}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action buttons — respects status lifecycle and RBAC */}
        <div className="flex flex-wrap gap-2 pt-2">
          {appointment.status === 'scheduled' && canConfirm && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              disabled={isPending}
              onClick={() => confirmMut.mutate(appointment.id)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Confirm
            </Button>
          )}

          {appointment.status === 'confirmed' && canConfirm && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              disabled={isPending}
              onClick={() => completeMut.mutate(appointment.id)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Complete
            </Button>
          )}

          {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && canCancel && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-rose-600 border-rose-300 hover:bg-rose-50"
              disabled={isPending}
              onClick={() => cancelMut.mutate(appointment.id)}
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
