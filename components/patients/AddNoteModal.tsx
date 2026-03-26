import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVisit } from '@/lib/api/visits';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Props {
  patientId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddNoteModal({ patientId, open, onOpenChange }: Props) {
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createVisit({ patient_id: patientId, notes, diagnosis, prescription }),
    onSuccess: () => {
      toast.success('Medical note added successfully.');
      queryClient.invalidateQueries({ queryKey: ['timeline', patientId] });
      onOpenChange(false);
      setNotes('');
      setDiagnosis('');
      setPrescription('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add note');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error('Notes cannot be empty');
      return;
    }
    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Medical Note</DialogTitle>
          <DialogDescription>Record a new visit note, diagnosis, and prescription for this patient.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Notes *</Label>
            <Textarea
              placeholder="Detailed visit notes..."
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Diagnosis</Label>
            <Textarea
              placeholder="Diagnosis (optional)"
              value={diagnosis}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDiagnosis(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Prescription</Label>
            <Textarea
              placeholder="Prescribed medications (optional)"
              value={prescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrescription(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
