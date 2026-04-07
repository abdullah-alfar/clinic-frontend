'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModalForm } from '@/components/ui/modal-form';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Pencil, FlaskConical, Clock, Package } from 'lucide-react';
import { useProcedures, useCreateProcedure, useUpdateProcedure } from '@/features/procedures/hooks';
import { useInventoryItems } from '@/features/inventory/hooks';
import type { ProcedureCatalog } from '@/features/procedures/types';

const procedureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  duration_minutes: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
  base_price: z.coerce.number().min(0, 'Price must be ≥ 0'),
});
type ProcedureForm = z.infer<typeof procedureSchema>;

export default function ProceduresPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingProc, setEditingProc] = useState<ProcedureCatalog | null>(null);

  const { data: procedures, isLoading } = useProcedures();
  const { data: inventoryItems } = useInventoryItems();
  const createMut = useCreateProcedure();
  const updateMut = useUpdateProcedure();

  const form = useForm<ProcedureForm>({ 
    resolver: zodResolver(procedureSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      duration_minutes: 0,
      base_price: 0,
    }
  });

  const filtered = procedures?.filter((p) =>
    `${p.name} ${p.description ?? ''}`.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const onEdit = (proc: ProcedureCatalog) => {
    setEditingProc(proc);
    form.reset({
      name: proc.name,
      description: proc.description || '',
      duration_minutes: proc.duration_minutes,
      base_price: proc.base_price,
    });
  };

  const onCreateSubmit = (d: any) => {
    const data = d as ProcedureForm;
    createMut.mutate({ ...data, items: [] }, {
      onSuccess: () => {
        setCreateOpen(false);
        form.reset();
      },
    });
  };

  const onEditSubmit = (d: any) => {
    const data = d as ProcedureForm;
    if (!editingProc) return;
    updateMut.mutate({ id: editingProc.id, ...data }, {
      onSuccess: () => setEditingProc(null),
    });
  };

  const getItemName = (id: string) => inventoryItems?.find((i) => i.id === id)?.name ?? id;

  const ProcedureFormFields = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="proc-name">Procedure Name *</Label>
        <Input id="proc-name" {...form.register('name')} placeholder="e.g. Blood Draw, Wound Dressing" />
        {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="proc-desc">Description</Label>
        <Input id="proc-desc" {...form.register('description')} placeholder="Optional description" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="proc-duration">Duration (min) *</Label>
          <Input id="proc-duration" type="number" {...form.register('duration_minutes')} placeholder="30" />
          {form.formState.errors.duration_minutes && <p className="text-xs text-destructive">{form.formState.errors.duration_minutes.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="proc-price">Base Price *</Label>
          <Input id="proc-price" type="number" step="0.01" {...form.register('base_price')} placeholder="0.00" />
          {form.formState.errors.base_price && <p className="text-xs text-destructive">{form.formState.errors.base_price.message}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Procedure Catalog" description="Define reusable procedures with linked inventory consumption">
        <Button id="procedure-create-btn" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Procedure
        </Button>

        {/* Create Modal */}
        <ModalForm
          open={createOpen}
          onOpenChange={setCreateOpen}
          title="Create Procedure"
          description="Define a new clinic procedure. You can link inventory items after creation."
          onSubmit={form.handleSubmit(onCreateSubmit)}
          submitLabel="Create Procedure"
          isPending={createMut.isPending}
        >
          <ProcedureFormFields />
        </ModalForm>

        {/* Edit Modal */}
        <ModalForm
          open={!!editingProc}
          onOpenChange={(o) => !o && setEditingProc(null)}
          title="Edit Procedure"
          description="Update procedure details."
          onSubmit={form.handleSubmit(onEditSubmit)}
          submitLabel="Save Changes"
          isPending={updateMut.isPending}
        >
          <ProcedureFormFields />
        </ModalForm>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="procedure-search"
          className="pl-9"
          placeholder="Search procedures…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Procedure</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Inventory Items Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
            ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  <FlaskConical className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No procedures defined yet.</p>
                  <p className="text-xs mt-1">Create your first procedure to link it to medical records.</p>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((proc) => (
              <TableRow key={proc.id} className="hover:bg-muted/30 group align-top">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <FlaskConical className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{proc.name}</p>
                      {proc.description && <p className="text-xs text-muted-foreground">{proc.description}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    {proc.duration_minutes} min
                  </div>
                </TableCell>
                <TableCell className="font-medium">${proc.base_price.toFixed(2)}</TableCell>
                <TableCell>
                  {proc.items && proc.items.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {proc.items.map((item) => (
                        <Badge key={item.id} variant="outline" className="gap-1 text-xs">
                          <Package className="h-3 w-3" />
                          {getItemName(item.inventory_item_id)} × {item.quantity}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">None linked</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      id={`procedure-edit-${proc.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(proc)}
                    >
                      <Pencil className="h-4 w-4" />
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
