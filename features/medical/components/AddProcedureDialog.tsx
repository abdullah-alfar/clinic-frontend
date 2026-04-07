'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FlaskConical, Loader2 } from 'lucide-react';
import { useProcedures } from '@/features/procedures/hooks';
import { useAddProcedureToRecord } from '@/features/medical/hooks';

const schema = z.object({
  procedure_catalog_id: z.string().min(1, 'Please select a procedure'),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface AddProcedureDialogProps {
  recordId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProcedureDialog({ recordId, open, onOpenChange }: AddProcedureDialogProps) {
  const { data: procedures, isLoading: proceduresLoading } = useProcedures();
  const addProcedure = useAddProcedureToRecord(recordId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    addProcedure.mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-indigo-500" />
            Add Procedure to Record
          </DialogTitle>
          <DialogDescription>
            Selecting a procedure will automatically deduct the linked inventory items.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="add-procedure-select">Procedure *</Label>
            {proceduresLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading procedures…
              </div>
            ) : (
              <select
                id="add-procedure-select"
                {...register('procedure_catalog_id')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a procedure…</option>
                {procedures?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.duration_minutes} min — ${p.base_price.toFixed(2)}
                  </option>
                ))}
              </select>
            )}
            {errors.procedure_catalog_id && (
              <p className="text-xs text-destructive">{errors.procedure_catalog_id.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="add-procedure-notes">Notes (optional)</Label>
            <input
              id="add-procedure-notes"
              {...register('notes')}
              placeholder="Any additional notes for this procedure…"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addProcedure.isPending} className="gap-2">
              {addProcedure.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Add Procedure
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
