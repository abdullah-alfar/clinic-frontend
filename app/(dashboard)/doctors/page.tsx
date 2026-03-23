'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getDoctors, createDoctor } from '@/lib/api/doctors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Stethoscope } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  specialty: z.string().min(2, 'Specialty is required'),
  license_number: z.string().min(1, 'License number is required'),
});
type DoctorForm = z.infer<typeof schema>;

export default function DoctorsPage() {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  const [open, setOpen] = useState(false);

  const { data: doctors, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });

  const mutation = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['doctors'] }); setOpen(false); reset(); },
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DoctorForm>({ resolver: zodResolver(schema) });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground text-sm">Physician roster and specialties</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Doctor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Register New Doctor</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input {...register('full_name')} placeholder="Dr. John Smith" />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Specialty *</Label>
                  <Input {...register('specialty')} placeholder="Cardiology" />
                  {errors.specialty && <p className="text-xs text-destructive">{errors.specialty.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>License Number *</Label>
                  <Input {...register('license_number')} placeholder="MD-12345" />
                  {errors.license_number && <p className="text-xs text-destructive">{errors.license_number.message}</p>}
                </div>
                {mutation.error && (
                  <p className="text-xs text-destructive">
                    {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add doctor'}
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Add Doctor'}
                  </Button>
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
                {isAdmin && <TableCell className="text-right"><Button variant="ghost" size="sm">Edit</Button></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
