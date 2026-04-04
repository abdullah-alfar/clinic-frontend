import React from 'react';
import { Calendar, Repeat, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/appointments/DatePicker';
import { RecurrenceFrequency } from '@/types';
import { format, addMonths, addYears } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  frequency: RecurrenceFrequency | 'none';
  setFrequency: (f: RecurrenceFrequency | 'none') => void;
  endDate: Date | undefined;
  setEndDate: (d: Date | undefined) => void;
  startDate: Date;
}

export function RecurrenceSelector({ frequency, setFrequency, endDate, setEndDate, startDate }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
        <Repeat className="h-3.5 w-3.5" />
        Recurrence Options
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium uppercase text-muted-foreground/70">Frequency</Label>
          <Select value={frequency} onValueChange={(v: any) => { setFrequency(v); if (v !== 'none' && !endDate) setEndDate(addMonths(startDate, 3)); }}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">One-time appointment</SelectItem>
              <SelectItem value="weekly">Every Week</SelectItem>
              <SelectItem value="monthly">Every Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {frequency !== 'none' && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
            <Label className="text-xs font-medium uppercase text-muted-foreground/70">Repeat Until</Label>
            <DatePicker
              date={endDate}
              setDate={setEndDate}
              disabled={(d) => d <= startDate || d > addYears(startDate, 1)}
            />
          </div>
        )}
      </div>

      {frequency !== 'none' && (
        <Alert className="bg-primary/5 border-primary/20 transition-all">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs font-medium text-primary/80">
            {frequency === 'weekly' && `Repeating every ${format(startDate, 'EEEE')} until ${endDate ? format(endDate, 'MMMM do, yyyy') : '...'}`}
            {frequency === 'monthly' && `Repeating on the ${format(startDate, 'do')} of each month until ${endDate ? format(endDate, 'MMMM do, yyyy') : '...'}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
