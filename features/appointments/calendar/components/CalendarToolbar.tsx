'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Doctor } from '@/types';

export type CalendarView = 'timeGridDay' | 'timeGridWeek';

interface CalendarToolbarProps {
  /** Currently selected view — drives the FullCalendar `view` prop. */
  currentView: CalendarView;
  /** The date that is "in focus" for the label display. */
  currentDate: Date;
  /** Clinic timezone string e.g. "Asia/Amman". */
  timezone: string;
  doctors: Doctor[];
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

/**
 * Custom toolbar rendered above the FullCalendar instance.
 * Controls view switching (Day/Week), navigation, doctor filter, and timezone label.
 */
export function CalendarToolbar({
  currentView,
  currentDate,
  timezone,
  doctors,
  selectedDoctorId,
  onDoctorChange,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  const dateLabel =
    currentView === 'timeGridDay'
      ? format(currentDate, 'EEEE, MMMM d, yyyy')
      : `Week of ${format(currentDate, 'MMMM d, yyyy')}`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      {/* Left: navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onPrev}
          aria-label="Previous period"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-medium"
          onClick={onToday}
        >
          Today
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onNext}
          aria-label="Next period"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <span className="ml-1 text-sm font-semibold text-foreground hidden sm:block">
          {dateLabel}
        </span>
      </div>

      {/* Center (mobile): date label */}
      <span className="text-sm font-semibold text-foreground sm:hidden">
        {dateLabel}
      </span>

      {/* Right: filters and view switcher */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Timezone label */}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Globe className="h-3 w-3" />
          {timezone}
        </span>

        {/* Doctor filter */}
        {doctors.length > 0 && (
          <Select value={selectedDoctorId} onValueChange={onDoctorChange}>
            <SelectTrigger
              id="calendar-doctor-filter"
              className="h-8 w-[160px] text-xs"
            >
              <SelectValue placeholder="All Doctors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Day / Week toggle */}
        <div className="flex rounded-md border overflow-hidden">
          <button
            type="button"
            onClick={() => onViewChange('timeGridDay')}
            aria-pressed={currentView === 'timeGridDay'}
            className={`flex items-center gap-1 px-3 h-8 text-xs font-medium transition-colors
              ${
                currentView === 'timeGridDay'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
          >
            <CalendarDays className="h-3 w-3" />
            Day
          </button>
          <button
            type="button"
            onClick={() => onViewChange('timeGridWeek')}
            aria-pressed={currentView === 'timeGridWeek'}
            className={`flex items-center gap-1 px-3 h-8 text-xs font-medium border-l transition-colors
              ${
                currentView === 'timeGridWeek'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
          >
            <Calendar className="h-3 w-3" />
            Week
          </button>
        </div>
      </div>
    </div>
  );
}
