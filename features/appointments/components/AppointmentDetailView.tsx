'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  UserX,
  FileText
} from 'lucide-react';
import { AppointmentDetailDTO } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatClinicDate, formatClinicTime } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import { confirmAppointment, cancelAppointment, completeAppointment } from '@/lib/api/appointments';
import { useMarkAppointmentNoShow } from '../hooks/useMarkAppointmentNoShow';
import { toast } from 'sonner';

interface AppointmentDetailViewProps {
  appointment: AppointmentDetailDTO;
}

export function AppointmentDetailView({ appointment }: AppointmentDetailViewProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { tenant } = useTheme();
  const tz = tenant?.timezone;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['appointment', appointment.id] });
    qc.invalidateQueries({ queryKey: ['appointments'] });
  };

  const confirmMut = useMutation({ 
    mutationFn: () => confirmAppointment(appointment.id), 
    onSuccess: () => { toast.success('Appointment confirmed'); invalidate(); } 
  });
  
  const cancelMut = useMutation({ 
    mutationFn: () => cancelAppointment(appointment.id), 
    onSuccess: () => { toast.success('Appointment canceled'); invalidate(); } 
  });
  
  const completeMut = useMutation({ 
    mutationFn: () => completeAppointment(appointment.id), 
    onSuccess: () => { toast.success('Appointment completed'); invalidate(); } 
  });
  
  const noShowMut = useMarkAppointmentNoShow();

  const handleNoShow = () => {
    noShowMut.mutate(appointment.id, {
      onSuccess: () => { toast.success('Marked as no-show'); invalidate(); },
    });
  };

  const isScheduled = appointment.status === 'scheduled';
  const isConfirmed = appointment.status === 'confirmed';
  const isActive = isScheduled || isConfirmed;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="h-8 w-8 p-0 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Appointment Details</h1>
        <StatusBadge status={appointment.status} className="ml-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="border-b bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">General Information</CardTitle>
                  <CardDescription>Main details about the scheduled visit</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground/50" />
              </div>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</p>
                    <p className="text-sm font-semibold mt-0.5">{formatClinicDate(appointment.start_time, tz)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time Window</p>
                    <p className="text-sm font-semibold mt-0.5">
                      {formatClinicTime(appointment.start_time, tz)} – {formatClinicTime(appointment.end_time, tz)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Patient</p>
                    <Link 
                      href={`/patients/${appointment.patient_id}`}
                      className="text-sm font-semibold mt-0.5 text-primary hover:underline decoration-2 underline-offset-4"
                    >
                      {appointment.patient_name}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                    <Stethoscope className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rendering Provider</p>
                    <p className="text-sm font-semibold mt-0.5">{appointment.doctor_name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Clinical Notes & Reason</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Reason for Visit</p>
                <div className="p-3 rounded-lg bg-muted/30 text-sm border border-border/50">
                  {appointment.reason || 'No specific reason provided.'}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Additional Notes</p>
                <div className="p-3 rounded-lg bg-muted/30 text-sm italic text-muted-foreground border border-border/50">
                  {appointment.notes || 'No internal notes available for this appointment.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md border-primary/10 border bg-gradient-to-b from-card to-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 p-4 pt-0">
              {isScheduled && (
                <Button 
                  className="w-full justify-start gap-3 h-11" 
                  onClick={() => confirmMut.mutate()}
                  disabled={confirmMut.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm Appointment
                </Button>
              )}
              
              {isConfirmed && (
                <Button 
                  className="w-full justify-start gap-3 h-11 bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => completeMut.mutate()}
                  disabled={completeMut.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Completed
                </Button>
              )}

              {isActive && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-11 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                    onClick={handleNoShow}
                    disabled={noShowMut.isPending}
                  >
                    <UserX className="h-4 w-4" />
                    Mark as No-Show
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-3 h-11"
                    onClick={() => {
                        // Reschedule logic would go here, maybe redirect or open same modal
                        toast.info("Rescheduling is handled via the calendar or list view.");
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reschedule
                  </Button>

                  <div className="my-2 border-t" />

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 h-11 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => cancelMut.mutate()}
                    disabled={cancelMut.isPending}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Appointment
                  </Button>
                </>
              )}

              {!isActive && (
                <p className="text-xs text-center text-muted-foreground py-4 px-2">
                  No actions available for status: <span className="font-bold uppercase">{appointment.status}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/5 flex flex-col items-center text-center gap-3">
             <div className="bg-muted p-2 rounded-full">
                <FileText className="h-5 w-5 text-muted-foreground/60" />
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Audit Log</p>
                <p className="text-[11px] text-muted-foreground/60">
                   Created on {format(new Date(appointment.created_at), 'MMMM d, yyyy')}
                   <br />
                   Last updated {format(new Date(appointment.updated_at), 'MMMM d, yyyy')}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple format helper since I don't want to break if date-fns is missing or different
function format(date: Date, formatStr: string) {
    try {
        const { format: dateFnsFormat } = require('date-fns');
        return dateFnsFormat(date, formatStr);
    } catch {
        return date.toLocaleDateString();
    }
}
