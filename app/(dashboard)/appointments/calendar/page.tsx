'use client';

import { AppointmentCalendar } from '@/features/appointments/calendar/components/AppointmentCalendar';
import { CalendarHeart } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarHeart className="h-6 w-6 text-primary" />
          Schedule Calendar
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Drag appointments to reschedule. Click to view details or change status.
        </p>
      </div>

      {/* Calendar — full feature component */}
      <AppointmentCalendar />
    </div>
  );
}
