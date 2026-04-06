import { Skeleton } from '@/components/ui/skeleton';
import { MedicalRecordCard } from './MedicalRecordCard';
import { usePatientMedicalRecords, useCreateMedicalRecord } from '../hooks';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MedicalRecordForm } from './MedicalRecordForm';
import { Stethoscope, Plus } from 'lucide-react';

export function MedicalRecordList({ patientId }: { patientId: string }) {
  const { data: records, isLoading } = usePatientMedicalRecords(patientId);
  const [createOpen, setCreateOpen] = useState(false);
  const createMutation = useCreateMedicalRecord();

  const handleCreate = (data: any) => {
    createMutation.mutate({ patientId, data }, {
      onSuccess: () => {
        setCreateOpen(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-lg font-bold">Medical Records</h3>
          <p className="text-sm text-muted-foreground">Comprehensive clinical history, vitals, and medications.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-11/12 sm:w-full">
            <DialogHeader>
              <DialogTitle>New Medical Record</DialogTitle>
            </DialogHeader>
            <MedicalRecordForm onSubmit={handleCreate} loading={createMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </>
        ) : records && records.length > 0 ? (
          records.map((r) => <MedicalRecordCard key={r.record?.id} record={r} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
            <Stethoscope className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
            <p className="text-sm font-semibold">No medical records found.</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">Create a new record to start tracking diagnoses, clinical notes, and patient vitals.</p>
          </div>
        )}
      </div>
    </div>
  );
}
