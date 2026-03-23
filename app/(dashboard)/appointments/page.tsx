'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAppointments, createAppointment, confirmAppointment, cancelAppointment, completeAppointment } from '@/lib/api/appointments';
import { getDoctors } from '@/lib/api/doctors';
import { getPatients } from '@/lib/api/patients';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckCircle, XCircle, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';

const schema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  reason: z.string().optional(),
});
type ApptForm = z.infer<typeof schema>;

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'outline',
  confirmed: 'secondary',
  completed: 'default',
  canceled: 'destructive',
};

export default function AppointmentsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');

  const { data: appointments, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: () => getAppointments() });
  const { data: doctors } = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['appointments'] });

  const createMut = useMutation({ mutationFn: createAppointment, onSuccess: () => { invalidate(); setOpen(false); reset(); } });
  const confirmMut = useMutation({ mutationFn: confirmAppointment, onSuccess: invalidate });
  const cancelMut = useMutation({ mutationFn: cancelAppointment, onSuccess: invalidate });
  const completeMut = useMutation({ mutationFn: completeAppointment, onSuccess: invalidate });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ApptForm>({ resolver: zodResolver(schema) });

  const canConfirm = user?.role === 'admin' || user?.role === 'doctor';
  const canCancel = user?.role === 'admin' || user?.role === 'receptionist';
  const canCreate = user?.role === 'admin' || user?.role === 'receptionist';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground text-sm">Manage and track clinic appointments</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />New Appointment</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Schedule Appointment</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit((d) => createMut.mutate({ ...d, doctor_id: doctorId, patient_id: patientId }))} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Patient *</Label>
                  <Select onValueChange={(v) => { setPatientId(v); setValue('patient_id', v); }}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients?.map((p) => <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.patient_id && <p className="text-xs text-destructive">{errors.patient_id.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Doctor *</Label>
                  <Select onValueChange={(v) => { setDoctorId(v); setValue('doctor_id', v); }}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>{doctors?.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.doctor_id && <p className="text-xs text-destructive">{errors.doctor_id.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Start Time *</Label>
                    <Input {...register('start_time')} type="datetime-local" />
                    {errors.start_time && <p className="text-xs text-destructive">{errors.start_time.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>End Time *</Label>
                    <Input {...register('end_time')} type="datetime-local" />
                    {errors.end_time && <p className="text-xs text-destructive">{errors.end_time.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Input {...register('reason')} placeholder="Brief reason for visit" />
                </div>
                {createMut.error && (
                  <p className="text-xs text-destructive">
                    {(createMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create appointment.'}
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMut.isPending}>{createMut.isPending ? 'Scheduling...' : 'Schedule'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Date & Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
            ))}
            {!isLoading && (!appointments || appointments.length === 0) && (
              <TableRow><TableCell colSpan={5} className="text-center py-12">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <CalendarCheck className="h-8 w-8 opacity-30" /><span>No appointments found.</span>
                </div>
              </TableCell></TableRow>
            )}
            {appointments?.map((a) => {
              const doctor = doctors?.find((d) => d.id === a.doctor_id);
              const patient = patients?.find((p) => p.id === a.patient_id);
              return (
                <TableRow key={a.id} className="hover:bg-muted/30">
                  <TableCell>
                    <p className="text-sm font-medium">{format(new Date(a.start_time), 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(a.start_time), 'h:mm a')} – {format(new Date(a.end_time), 'h:mm a')}</p>
                  </TableCell>
                  <TableCell className="font-medium">{patient ? `${patient.first_name} ${patient.last_name}` : a.patient_id.slice(0, 8)}</TableCell>
                  <TableCell className="text-muted-foreground">{doctor?.full_name ?? a.doctor_id.slice(0, 8)}</TableCell>
                  <TableCell><Badge variant={STATUS_COLORS[a.status] ?? 'outline'} className="capitalize">{a.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {a.status === 'scheduled' && canConfirm && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => confirmMut.mutate(a.id)}>
                          <CheckCircle className="h-3 w-3" />Confirm
                        </Button>
                      )}
                      {a.status === 'confirmed' && canConfirm && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50" onClick={() => completeMut.mutate(a.id)}>
                          <CheckCircle className="h-3 w-3" />Complete
                        </Button>
                      )}
                      {(a.status === 'scheduled' || a.status === 'confirmed') && canCancel && (
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => cancelMut.mutate(a.id)}>
                          <XCircle className="h-3 w-3" />Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
