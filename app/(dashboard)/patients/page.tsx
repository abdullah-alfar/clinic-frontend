'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPatients, createPatient, updatePatient, deletePatient } from '@/lib/api/patients';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModalForm } from '@/components/ui/modal-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Pencil, Trash2, User } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatClinicDate } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';
import type { Patient } from '@/types';

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  date_of_birth: z.string().optional(),
  notes: z.string().optional(),
});
type PatientForm = z.infer<typeof schema>;

export default function PatientsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { tenant } = useTheme();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const { data: patients, isLoading } = useQuery({ queryKey: ['patients'], queryFn: getPatients });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['patients'] });
    setOpen(false);
    setEditingPatient(null);
    setDeletingPatient(null);
    reset();
  };

  const createMut = useMutation({ mutationFn: createPatient, onSuccess: invalidate });
  const updateMut = useMutation({ mutationFn: (d: PatientForm) => updatePatient(editingPatient!.id, d), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: (id: string) => deletePatient(id), onSuccess: invalidate });

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<PatientForm>({ 
    resolver: zodResolver(schema) 
  });

  const onEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setValue('first_name', patient.first_name);
    setValue('last_name', patient.last_name);
    setValue('email', patient.email || '');
    setValue('phone', patient.phone || '');
    setValue('gender', (patient.gender as any) || '');
    setValue('date_of_birth', patient.date_of_birth ? patient.date_of_birth.split('T')[0] : '');
    setValue('notes', patient.notes || '');
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

  const filtered = patients?.filter((p) =>
    `${p.first_name} ${p.last_name} ${p.email} ${p.phone}`.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Patients" description="Manage your clinic's patient records">
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />New Patient</Button>
        
        {/* Create Modal */}
        <ModalForm
          open={open}
          onOpenChange={setOpen}
          title="Register New Patient"
          description="Enter the details for the new patient. All fields marked with * are required."
          onSubmit={handleSubmit((d) => createMut.mutate(d))}
          submitLabel="Create Patient"
          isPending={isSubmitting || createMut.isPending}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" {...register('first_name')} placeholder="John" />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" {...register('last_name')} placeholder="Doe" />
              {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} type="email" placeholder="john@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} placeholder="+1 555 0100" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input id="date_of_birth" {...register('date_of_birth')} type="date" />
          </div>
          {errorContent(createMut.error)}
        </ModalForm>

        {/* Edit Modal */}
        <ModalForm
          open={!!editingPatient}
          onOpenChange={(o) => !o && setEditingPatient(null)}
          title="Edit Patient"
          description="Update patient records."
          onSubmit={handleSubmit((d) => updateMut.mutate(d))}
          submitLabel="Save Changes"
          isPending={isSubmitting || updateMut.isPending}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_first_name">First Name *</Label>
              <Input id="edit_first_name" {...register('first_name')} />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_last_name">Last Name *</Label>
              <Input id="edit_last_name" {...register('last_name')} />
              {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit_email">Email</Label>
            <Input id="edit_email" {...register('email')} type="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit_phone">Phone</Label>
            <Input id="edit_phone" {...register('phone')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit_date_of_birth">Date of Birth</Label>
            <Input id="edit_date_of_birth" {...register('date_of_birth')} type="date" />
          </div>
          {errorContent(updateMut.error)}
        </ModalForm>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deletingPatient}
          onOpenChange={(o) => !o && setDeletingPatient(null)}
          title="Delete Patient"
          description={`Are you sure you want to delete ${deletingPatient?.first_name} ${deletingPatient?.last_name}? All related records will be affected.`}
          onConfirm={() => deleteMut.mutate(deletingPatient!.id)}
          confirmLabel="Delete"
          variant="destructive"
          isPending={deleteMut.isPending}
        />
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search patients…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
              ))
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No patients found.</TableCell></TableRow>
            )}
             {filtered.map((p) => (
               <TableRow key={p.id} className="hover:bg-muted/30 group">
                 <TableCell className="font-medium">
                   <div className="flex items-center gap-2 cursor-pointer hover:underline" onClick={() => window.location.href = `/patients/${p.id}`}>
                     <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <User className="h-4 w-4" />
                     </div>
                     {p.first_name} {p.last_name}
                   </div>
                 </TableCell>
                 <TableCell className="text-muted-foreground">{p.email || '—'}</TableCell>
                 <TableCell className="text-muted-foreground">{p.phone || '—'}</TableCell>
                 <TableCell className="capitalize">{p.gender || '—'}</TableCell>
                 <TableCell className="text-muted-foreground">{formatClinicDate(p.created_at, tenant?.timezone)}</TableCell>
                 <TableCell className="text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(p)}>
                       <Pencil className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeletingPatient(p)}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
