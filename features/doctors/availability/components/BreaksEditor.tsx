'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ModalForm } from '@/components/ui/modal-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Coffee } from 'lucide-react';
import { useCreateBreak, useDeleteBreak, useDoctorAvailability } from '../hooks/useAvailability';
import { breakSchema } from '../schemas';
import { z } from 'zod';

type BreakForm = z.infer<typeof breakSchema>;

interface Props {
  doctorId: string;
  scheduleId: string;
  canEdit: boolean;
  shiftStart: string;
  shiftEnd: string;
}

export function BreaksEditor({ doctorId, scheduleId, canEdit, shiftStart, shiftEnd }: Props) {
  const { data } = useDoctorAvailability(doctorId);
  const breaks = data?.breaks.filter(b => b.schedule_id === scheduleId) ?? [];

  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Toasts (success / error) are fired inside the hooks.
  const createMut = useCreateBreak(doctorId);
  const deleteMut = useDeleteBreak(doctorId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BreakForm>({
    resolver: zodResolver(breakSchema),
    defaultValues: {
      start_time: shiftStart.substring(0, 5),
      end_time: shiftEnd.substring(0, 5),
      label: 'Lunch',
    },
  });

  const onSubmit = (data: BreakForm) => {
    createMut.mutate({ scheduleId, data }, {
      onSuccess: () => setOpen(false),
    });
  };

  const onOpenAdd = () => {
    reset({ start_time: shiftStart.substring(0, 5), end_time: shiftEnd.substring(0, 5), label: 'Lunch' });
    setOpen(true);
  };

  const onConfirmDelete = () => {
    if (!deletingId) return;
    deleteMut.mutate(deletingId, {
      onSuccess: () => setDeletingId(null),
    });
  };

  return (
    <div className="pl-4 border-l-2 border-muted">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          <Coffee className="h-3 w-3" /> Breaks
        </h4>
        {canEdit && (
          <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={onOpenAdd}>
            <Plus className="h-3 w-3 mr-1" /> Add Break
          </Button>
        )}
      </div>

      {breaks.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No breaks scheduled.</p>
      ) : (
        <div className="space-y-2">
          {breaks.map(b => (
            <div key={b.id} className="flex items-center justify-between bg-muted/30 px-3 py-1.5 rounded-md text-sm">
              <span className="font-medium text-muted-foreground">{b.label}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs">
                  {b.start_time.substring(0, 5)} – {b.end_time.substring(0, 5)}
                </span>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive/70 hover:text-destructive"
                    onClick={() => setDeletingId(b.id)}
                    disabled={deleteMut.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Break Modal ─────────────────────────────────────────────────── */}
      <ModalForm
        open={open}
        onOpenChange={setOpen}
        title="Add Break"
        description={`Schedule a break between ${shiftStart.substring(0, 5)} and ${shiftEnd.substring(0, 5)}.`}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel="Add Break"
        isPending={createMut.isPending}
      >
        <div className="grid gap-2">
          <Label>Label</Label>
          <Input {...register('label')} placeholder="e.g. Lunch, Prayer" />
          {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
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

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(o) => { if (!o) setDeletingId(null); }}
        title="Delete Break"
        description="Are you sure you want to remove this break?"
        onConfirm={onConfirmDelete}
        confirmLabel="Delete"
        variant="destructive"
        isPending={deleteMut.isPending}
      />
    </div>
  );
}
