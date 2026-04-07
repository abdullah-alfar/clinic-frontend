import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreateFollowUpRequest, FollowUpPriority } from '../types';
import { useCreateFollowUp } from '../hooks/useFollowUps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const followUpSchema = z.object({
  patient_id: z.string().uuid(),
  doctor_id: z.string().uuid().optional(),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  due_date: z.date({
    message: "A due date is required.",
  }),
  priority: z.enum(['low', 'medium', 'high'] as const),
});

type FollowUpFormValues = z.infer<typeof followUpSchema>;

interface FollowUpFormProps {
  patientId: string;
  onSuccess?: () => void;
  defaultDoctorId?: string;
}

export function FollowUpForm({ patientId, onSuccess, defaultDoctorId }: FollowUpFormProps) {
  const createFollowUp = useCreateFollowUp();

  const form = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      patient_id: patientId,
      doctor_id: defaultDoctorId,
      reason: '',
      priority: 'medium' as FollowUpPriority,
    },
  });

  const onSubmit = (values: FollowUpFormValues) => {
    createFollowUp.mutate({
      ...values,
      due_date: values.due_date.toISOString(),
      auto_generated: false,
    }, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Follow-up</Label>
        <Input 
          id="reason" 
          placeholder="e.g., Review blood test results" 
          {...form.register('reason')} 
        />
        {form.formState.errors.reason && (
          <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch('due_date') && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('due_date') ? format(form.watch('due_date'), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch('due_date')}
                onSelect={(date) => form.setValue('due_date', date as Date)}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.due_date && (
            <p className="text-xs text-destructive">{form.formState.errors.due_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={form.watch('priority')} 
            onValueChange={(val) => form.setValue('priority', val as FollowUpPriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={createFollowUp.isPending}>
        {createFollowUp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Follow-up
      </Button>
    </form>
  );
}
