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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, CalendarOff, Settings2, Clock } from 'lucide-react';
import { ExceptionDTO, ExceptionType } from '../types';
import { exceptionSchema } from '../schemas';
import { useCreateException, useDeleteException } from '../hooks/useAvailability';
import { z } from 'zod';

type ExceptionForm = z.infer<typeof exceptionSchema>;

interface Props {
  doctorId: string;
  exceptions: ExceptionDTO[];
}

export function ExceptionsEditor({ doctorId, exceptions }: Props) {
  const user = useAuthStore(s => s.user);
  const canEdit = user?.role === 'admin' || user?.role === 'doctor';

  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toasts (success / error) are fired inside the hooks.
  const createMut = useCreateException(doctorId);
  const deleteMut = useDeleteException(doctorId);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ExceptionForm>({
    resolver: zodResolver(exceptionSchema),
    defaultValues: { type: 'day_off', date: new Date().toISOString().split('T')[0] },
  });

  const watchType = watch('type');

  const onSubmit = (data: ExceptionForm) => {
    createMut.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  };

  const onOpenAdd = () => {
    reset({ type: 'day_off', date: new Date().toISOString().split('T')[0] });
    setOpen(true);
  };

  const onConfirmDelete = () => {
    if (!deletingId) return;
    deleteMut.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Exceptions &amp; Overrides
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage specific dates with custom hours or days off.
          </p>
        </div>
        {canEdit && (
          <Button size="sm" onClick={onOpenAdd} variant="outline" className="border-primary/50 text-primary">
            <Plus className="h-4 w-4 mr-2" /> Add Exception
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {exceptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
            <CalendarOff className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No exceptions scheduled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exceptions.map(e => (
              <div
                key={e.id}
                className={`p-4 border rounded-lg flex flex-col md:flex-row md:items-center py-3 justify-between gap-4 ${
                  e.type === 'day_off' ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/10'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border shadow-sm">
                    {e.type === 'day_off'
                      ? <CalendarOff className="h-4 w-4 text-destructive" />
                      : <Clock className="h-4 w-4 text-amber-500" />
                    }
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {new Date(e.date + 'T00:00:00').toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="text-sm font-medium">
                      {e.type === 'day_off' ? (
                        <span className="text-destructive">Full Day Off</span>
                      ) : (
                        <span className="text-amber-600">
                          Custom Hours: {e.start_time?.substring(0, 5)} – {e.end_time?.substring(0, 5)}
                        </span>
                      )}
                    </div>
                    {e.reason && (
                      <p className="text-sm text-muted-foreground mt-1">{e.reason}</p>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => setDeletingId(e.id)}
                    disabled={deleteMut.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Add Exception Modal ──────────────────────────────────────────── */}
        <ModalForm
          open={open}
          onOpenChange={setOpen}
          title="Add Date Exception"
          description="Override standard availability for a specific date."
          onSubmit={handleSubmit(onSubmit)}
          submitLabel="Create Exception"
          isPending={createMut.isPending}
        >
          <div className="grid gap-2">
            <Label>Date</Label>
            <Input type="date" {...register('date')} />
            {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
          </div>

          <div className="grid gap-2 mt-2">
            <Label>Exception Type</Label>
            <Select onValueChange={(v) => setValue('type', v as ExceptionType)} defaultValue="day_off">
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day_off">Full Day Off</SelectItem>
                <SelectItem value="override">Custom Hours</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
          </div>

          {watchType === 'override' && (
            <div className="grid grid-cols-2 gap-4 mt-2 p-4 bg-muted/40 rounded-lg border">
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
          )}

          <div className="grid gap-2 mt-2">
            <Label>Reason <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea {...register('reason')} placeholder="e.g. Annual Leave, Conference..." />
            {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
          </div>
        </ModalForm>

        {/* ── Delete Confirm ────────────────────────────────────────────────── */}
        <ConfirmDialog
          open={!!deletingId}
          onOpenChange={(o) => { if (!o) setDeletingId(null); }}
          title="Delete Exception"
          description="Are you sure you want to remove this schedule exception?"
          onConfirm={onConfirmDelete}
          confirmLabel="Delete"
          variant="destructive"
          isPending={deleteMut.isPending}
        />
      </CardContent>
    </Card>
  );
}
