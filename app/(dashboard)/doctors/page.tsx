'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '@/lib/api/doctors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModalForm } from '@/components/ui/modal-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Stethoscope, Pencil, Trash2, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Doctor } from '@/types';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  license_number: z.string().min(1, 'License number is required'),
});
type DoctorForm = z.infer<typeof schema>;

export default function DoctorsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  const [open, setOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);

  const { data: doctors, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['doctors'] });
    setOpen(false);
    setEditingDoctor(null);
    setDeletingDoctor(null);
    reset();
  };

  const createMut = useMutation({ mutationFn: createDoctor, onSuccess: invalidate });
  const updateMut = useMutation({ mutationFn: (d: DoctorForm) => updateDoctor(editingDoctor!.id, d), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: (id: string) => deleteDoctor(id), onSuccess: invalidate });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<DoctorForm>({ 
    resolver: zodResolver(schema) 
  });

  const onEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setValue('full_name', doctor.full_name);
    setValue('specialty', doctor.specialty);
    setValue('license_number', doctor.license_number);
  };

  const errorContent = (err: any) => {
    if (!err) return null;
    const status = err.response?.status;
    const msg = err.response?.data?.message;
    return (
      <p className="text-xs text-destructive font-medium bg-destructive/10 p-2 rounded border border-destructive/20">
        {status === 401 ? 'Session expired. Please log in again.' : 
         status === 403 ? 'You do not have permission to perform this action.' : 
         msg || 'Failed to process request.'}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground text-sm">Physician roster and specialties</p>
        </div>
        {isAdmin && (
          <>
            <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Doctor</Button>
            <ModalForm
              open={open}
              onOpenChange={setOpen}
              title="Register New Doctor"
              description="Add a new physician to the clinic roster."
              onSubmit={handleSubmit((d) => createMut.mutate(d))}
              submitLabel="Add Doctor"
              isPending={isSubmitting || createMut.isPending}
            >
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" {...register('full_name')} placeholder="Dr. John Smith" />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Input id="specialty" {...register('specialty')} placeholder="Cardiology" />
                {errors.specialty && <p className="text-xs text-destructive">{errors.specialty.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="license_number">License Number *</Label>
                <Input id="license_number" {...register('license_number')} placeholder="MD-12345" />
                {errors.license_number && <p className="text-xs text-destructive">{errors.license_number.message}</p>}
              </div>
              {errorContent(createMut.error)}
            </ModalForm>

            {/* Edit Modal */}
            <ModalForm
              open={!!editingDoctor}
              onOpenChange={(o) => !o && setEditingDoctor(null)}
              title="Edit Doctor"
              description="Update physician details."
              onSubmit={handleSubmit((d) => updateMut.mutate(d))}
              submitLabel="Save Changes"
              isPending={isSubmitting || updateMut.isPending}
            >
              <div className="grid gap-2">
                <Label htmlFor="edit_full_name">Full Name *</Label>
                <Input id="edit_full_name" {...register('full_name')} />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_specialty">Specialty *</Label>
                <Input id="edit_specialty" {...register('specialty')} />
                {errors.specialty && <p className="text-xs text-destructive">{errors.specialty.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_license_number">License Number *</Label>
                <Input id="edit_license_number" {...register('license_number')} />
                {errors.license_number && <p className="text-xs text-destructive">{errors.license_number.message}</p>}
              </div>
              {errorContent(updateMut.error)}
            </ModalForm>

            {/* Delete Confirmation */}
            <ConfirmDialog
              open={!!deletingDoctor}
              onOpenChange={(o) => !o && setDeletingDoctor(null)}
              title="Delete Doctor"
              description={`Are you sure you want to delete ${deletingDoctor?.full_name}? This action cannot be undone.`}
              onConfirm={() => deleteMut.mutate(deletingDoctor!.id)}
              confirmLabel="Delete"
              variant="destructive"
              isPending={deleteMut.isPending}
            />
          </>
        )}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>License</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
              ))
            )}
            {!isLoading && (!doctors || doctors.length === 0) && (
              <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground"><div className="flex flex-col items-center gap-2"><Stethoscope className="h-8 w-8 opacity-30" /><span>No doctors registered yet.</span></div></TableCell></TableRow>
            )}
            {doctors?.map((d) => (
              <TableRow key={d.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{d.full_name}</TableCell>
                <TableCell><Badge variant="secondary">{d.specialty}</Badge></TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{d.license_number}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Manage Availability" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => router.push(`/doctors/${d.id}/availability`)}>
                        <CalendarDays className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit Doctor" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(d)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete Doctor" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeletingDoctor(d)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
