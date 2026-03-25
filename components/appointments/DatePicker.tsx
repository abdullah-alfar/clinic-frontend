'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ date, setDate, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full h-9 justify-start text-left font-medium shadow-sm',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-60" />
          {date ? format(date, 'EEE, MMM d yyyy') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 shadow-xl border rounded-xl overflow-hidden"
        align="start"
        sideOffset={6}
      >
        <DayPicker
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d);
            setOpen(false);
          }}
          disabled={disabled}
          showOutsideDays
          components={{
            Chevron: ({ orientation }) =>
              orientation === 'left' ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ),
          }}
          classNames={{
            root: 'p-4 bg-popover text-popover-foreground',
            month: 'space-y-4',
            month_caption: 'flex justify-center items-center relative h-10',
            caption_label: 'text-base font-semibold',
            nav: 'flex items-center gap-1',
            button_previous:
              'absolute left-0 h-8 w-8 flex items-center justify-center rounded-md border hover:bg-accent transition-colors disabled:opacity-50',
            button_next:
              'absolute right-0 h-8 w-8 flex items-center justify-center rounded-md border hover:bg-accent transition-colors disabled:opacity-50',
            weeks: 'space-y-1',
            weekdays: 'flex',
            weekday:
              'flex-1 text-center text-xs font-medium text-muted-foreground pb-2',
            week: 'flex',
            day: 'flex-1 text-center p-0',
            day_button: cn(
              'w-10 h-10 mx-auto flex items-center justify-center rounded-md text-sm font-medium',
              'hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            ),
            selected:
              '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:font-bold [&>button]:shadow-sm',
            today: '[&>button]:border-2 [&>button]:border-primary/50 [&>button]:font-semibold',
            outside: '[&>button]:text-muted-foreground [&>button]:opacity-40',
            disabled: '[&>button]:text-muted-foreground [&>button]:opacity-30 [&>button]:cursor-not-allowed [&>button]:line-through [&>button]:hover:bg-transparent',
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
