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
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Pencil, Package, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import {
  useInventoryItems,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useAdjustStock,
} from '@/features/inventory/hooks';
import type { InventoryItem } from '@/features/inventory/types';

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required'),
  stock_level: z.coerce.number().min(0, 'Stock must be ≥ 0'),
  min_stock_level: z.coerce.number().min(0, 'Min stock must be ≥ 0'),
  unit_price: z.coerce.number().min(0, 'Price must be ≥ 0'),
});
type CreateForm = z.infer<typeof createSchema>;

const adjustSchema = z.object({
  change_amount: z.coerce.number(),
  reason: z.string().min(1, 'Reason is required'),
});
type AdjustForm = z.infer<typeof adjustSchema>;

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);

  const { data: items, isLoading } = useInventoryItems();
  const createMut = useCreateInventoryItem();
  const updateMut = useUpdateInventoryItem();
  const adjustMut = useAdjustStock();

  const createForm = useForm<CreateForm>({ 
    resolver: zodResolver(createSchema) as any,
    defaultValues: {
      name: '',
      category: '',
      sku: '',
      stock_level: 0,
      min_stock_level: 0,
      unit_price: 0,
    }
  });

  const adjustForm = useForm<AdjustForm>({ 
    resolver: zodResolver(adjustSchema) as any,
    defaultValues: {
      change_amount: 0,
      reason: '',
    }
  });

  const filtered = items?.filter((item) =>
    `${item.name} ${item.category} ${item.sku}`.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const onEdit = (item: InventoryItem) => {
    setEditingItem(item);
    createForm.reset({
      name: item.name,
      category: item.category,
      sku: item.sku,
      stock_level: item.stock_level,
      min_stock_level: item.min_stock_level,
      unit_price: item.unit_price,
    });
  };

  const onCreateSubmit = (d: any) => {
    const data = d as CreateForm;
    createMut.mutate(data, {
      onSuccess: () => {
        setCreateOpen(false);
        createForm.reset();
      },
    });
  };

  const onEditSubmit = (d: any) => {
    const data = d as CreateForm;
    if (!editingItem) return;
    updateMut.mutate({ id: editingItem.id, ...data }, {
      onSuccess: () => setEditingItem(null),
    });
  };

  const onAdjustSubmit = (d: any) => {
    const data = d as AdjustForm;
    if (!adjustingItem) return;
    adjustMut.mutate({ id: adjustingItem.id, req: data }, {
      onSuccess: () => {
        setAdjustingItem(null);
        adjustForm.reset();
      },
    });
  };

  const stockBadge = (item: InventoryItem) => {
    if (item.stock_level === 0) {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Out of stock</Badge>;
    }
    if (item.stock_level <= item.min_stock_level) {
      return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-500"><AlertTriangle className="h-3 w-3" /> Low stock</Badge>;
    }
    return <Badge variant="outline" className="gap-1 border-emerald-500 text-emerald-500">{item.stock_level} units</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track and manage clinic supplies and consumables">
        <Button id="inventory-create-btn" onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>

        {/* Create Modal */}
        <ModalForm
          open={createOpen}
          onOpenChange={setCreateOpen}
          title="Add Inventory Item"
          description="Register a new item in the clinic inventory."
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          submitLabel="Add Item"
          isPending={createMut.isPending}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="inv-name">Name *</Label>
              <Input id="inv-name" {...createForm.register('name')} placeholder="e.g. Surgical Gloves" />
              {createForm.formState.errors.name && <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inv-category">Category *</Label>
              <Input id="inv-category" {...createForm.register('category')} placeholder="e.g. PPE" />
              {createForm.formState.errors.category && <p className="text-xs text-destructive">{createForm.formState.errors.category.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inv-sku">SKU *</Label>
              <Input id="inv-sku" {...createForm.register('sku')} placeholder="e.g. GLV-L-100" />
              {createForm.formState.errors.sku && <p className="text-xs text-destructive">{createForm.formState.errors.sku.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inv-stock">Stock Level *</Label>
              <Input id="inv-stock" type="number" {...createForm.register('stock_level')} placeholder="100" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inv-min-stock">Min Stock Level *</Label>
              <Input id="inv-min-stock" type="number" {...createForm.register('min_stock_level')} placeholder="10" />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="inv-price">Unit Price *</Label>
              <Input id="inv-price" type="number" step="0.01" {...createForm.register('unit_price')} placeholder="0.00" />
            </div>
          </div>
        </ModalForm>

        {/* Edit Modal */}
        <ModalForm
          open={!!editingItem}
          onOpenChange={(o) => !o && setEditingItem(null)}
          title="Edit Inventory Item"
          description="Update item details."
          onSubmit={createForm.handleSubmit(onEditSubmit)}
          submitLabel="Save Changes"
          isPending={updateMut.isPending}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-inv-name">Name *</Label>
              <Input id="edit-inv-name" {...createForm.register('name')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-inv-category">Category *</Label>
              <Input id="edit-inv-category" {...createForm.register('category')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-inv-sku">SKU *</Label>
              <Input id="edit-inv-sku" {...createForm.register('sku')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-inv-stock">Stock Level *</Label>
              <Input id="edit-inv-stock" type="number" {...createForm.register('stock_level')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-inv-min">Min Stock Level *</Label>
              <Input id="edit-inv-min" type="number" {...createForm.register('min_stock_level')} />
            </div>
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-inv-price">Unit Price *</Label>
              <Input id="edit-inv-price" type="number" step="0.01" {...createForm.register('unit_price')} />
            </div>
          </div>
        </ModalForm>

        {/* Adjust Stock Modal */}
        <ModalForm
          open={!!adjustingItem}
          onOpenChange={(o) => !o && setAdjustingItem(null)}
          title={`Adjust Stock – ${adjustingItem?.name}`}
          description="Enter a positive number to add stock, or negative to deduct."
          onSubmit={adjustForm.handleSubmit(onAdjustSubmit)}
          submitLabel="Adjust Stock"
          isPending={adjustMut.isPending}
        >
          <div className="grid gap-4">
            <div className="rounded-lg bg-muted/40 p-3 text-sm">
              Current stock: <span className="font-bold">{adjustingItem?.stock_level}</span> units
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adj-amount">Change Amount *</Label>
              <Input id="adj-amount" type="number" {...adjustForm.register('change_amount')} placeholder="+10 or -5" />
              {adjustForm.formState.errors.change_amount && <p className="text-xs text-destructive">{adjustForm.formState.errors.change_amount.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="adj-reason">Reason *</Label>
              <Input id="adj-reason" {...adjustForm.register('reason')} placeholder="e.g. Restock from supplier" />
              {adjustForm.formState.errors.reason && <p className="text-xs text-destructive">{adjustForm.formState.errors.reason.message}</p>}
            </div>
          </div>
        </ModalForm>
      </PageHeader>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="inventory-search"
          className="pl-9"
          placeholder="Search by name, category or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
            ))}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No inventory items found.</p>
                  <p className="text-xs mt-1">Add your first item to get started.</p>
                </TableCell>
              </TableRow>
            )}
            {filtered.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">{item.category}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{item.sku}</TableCell>
                <TableCell>{stockBadge(item)}</TableCell>
                <TableCell className="text-muted-foreground">${item.unit_price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      id={`inventory-adjust-${item.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-emerald-500"
                      title="Adjust Stock"
                      onClick={() => { setAdjustingItem(item); adjustForm.reset(); }}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button
                      id={`inventory-edit-${item.id}`}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(item)}
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
