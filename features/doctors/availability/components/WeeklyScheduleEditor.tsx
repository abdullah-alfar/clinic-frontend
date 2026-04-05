'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { ModalForm } from '@/components/ui/modal-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock, CalendarDays } from 'lucide-react';
import { ScheduleDTO } from '../types';
import { scheduleSchema } from '../schemas';
import { useCreateSchedule, useDeleteSchedule } from '../hooks/useAvailability';
import { BreaksEditor } from './BreaksEditor';
import { z } from 'zod';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type ScheduleForm = z.infer<typeof scheduleSchema>;

interface Props {
  doctorId: string;
  schedules: ScheduleDTO[];
}

export function WeeklyScheduleEditor({ doctorId, schedules }: Props) {
  const user = useAuthStore(s => s.user);
  const canEdit = user?.role === 'admin' || user?.role === 'doctor';

  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toasts are fired inside the hooks (onSuccess / onError).
  // Components only handle UI state (open/close) in their own callbacks.
  const createMut = useCreateSchedule(doctorId);
  const deleteMut = useDeleteSchedule(doctorId);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { day_of_week: 1, start_time: '09:00', end_time: '17:00' },
  });

  const onSubmit = (data: ScheduleForm) => {
    createMut.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  };

  const onConfirmDelete = () => {
    if (!deletingId) return;
    deleteMut.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

  const onOpenAdd = () => {
    reset({ day_of_week: 1, start_time: '09:00', end_time: '17:00' });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Weekly Schedule
          </CardTitle>
          <p className="text-sm text-muted-foreground">Manage recurring working hours and shifts.</p>
        </div>
        {canEdit && (
          <Button size="sm" onClick={onOpenAdd}>
            <Plus className="h-4 w-4 mr-2" /> Add Shift
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {DAYS.map((dayName, dayIndex) => {
          const daySchedules = schedules
            .filter(s => s.day_of_week === dayIndex)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
          if (daySchedules.length === 0) return null;

          return (
            <div key={dayIndex} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm flex items-center justify-between">
                <span>{dayName}</span>
                <Badge variant="outline" className="bg-background">
                  {daySchedules.length} shift{daySchedules.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="divide-y bg-card">
                {daySchedules.map(shift => (
                  <div key={shift.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground/90">
                          {shift.start_time.substring(0, 5)} — {shift.end_time.substring(0, 5)}
                        </span>
                      </div>

                      <BreaksEditor
                        doctorId={doctorId}
                        scheduleId={shift.id}
                        canEdit={canEdit}
                        shiftStart={shift.start_time}
                        shiftEnd={shift.end_time}
                      />
                    </div>

                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive shrink-0"
                        onClick={() => setDeletingId(shift.id)}
                        disabled={deleteMut.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {schedules.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
            <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No shifts configured yet. Add a shift to get started.</p>
          </div>
        )}

        {/* ── Add Shift Modal ─────────────────────────────────────────────── */}
        <ModalForm
          open={open}
          onOpenChange={setOpen}
          title="Add a Weekly Shift"
          description="Create a recurring block of working hours for a specific day."
          onSubmit={handleSubmit(onSubmit)}
          submitLabel="Create Shift"
          isPending={createMut.isPending}
        >
          <div className="grid gap-2">
            <Label>Day of Week</Label>
            <Select onValueChange={(v) => setValue('day_of_week', parseInt(v))} defaultValue="1">
              <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
              <SelectContent>
                {DAYS.map((d, i) => <SelectItem key={i} value={i.toString()}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.day_of_week && <p className="text-xs text-destructive">{errors.day_of_week.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Time</Label>
              <Input type="time" {...register('start_time')} />
              {errors.start_time && <p className="text-xs text-destructive">{errors.start_time.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>End Time</Label>
              <Input type="time" {...register('end_time')} />
              {errors.end_time && <p className="text-xs text-destructive">{errors.end_time.message}</p>}
            </div>
          </div>
        </ModalForm>

        {/* ── Delete Confirm ───────────────────────────────────────────────── */}
        <ConfirmDialog
          open={!!deletingId}
          onOpenChange={(o) => { if (!o) setDeletingId(null); }}
          title="Delete Shift"
          description="Are you sure you want to remove this shift? All associated breaks will also be deleted."
          onConfirm={onConfirmDelete}
          confirmLabel="Delete"
          variant="destructive"
          isPending={deleteMut.isPending}
        />
      </CardContent>
    </Card>
  );
}
