'use client';

import { useCallback, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg, EventContentArg, EventDropArg } from '@fullcalendar/core';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CalendarOff, Loader2 } from 'lucide-react';
import { getDoctors } from '@/lib/api/doctors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCalendarAppointments } from '../hooks/useCalendarAppointments';
import { useRescheduleCalendarAppointment } from '../hooks/useRescheduleCalendarAppointment';
import { AppointmentEventCard } from './AppointmentEventCard';
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog';
import { CalendarToolbar, type CalendarView } from './CalendarToolbar';
import type { CalendarAppointment } from '../types';
import type { Doctor } from '@/types';

/** Maps a CalendarAppointment to a FullCalendar EventInput. */
function toFullCalendarEvent(appt: CalendarAppointment) {
  return {
    id: appt.id,
    start: appt.start_time,
    end: appt.end_time,
    // Extended props are available inside event content renderers
    extendedProps: {
      patient_name: appt.patient_name,
      doctor_name: appt.doctor_name,
      status: appt.status,
      reason: appt.reason,
      // Keep the full object for the details dialog
      _appt: appt,
    },
  };
}

/**
 * AppointmentCalendar is the top-level calendar component.
 *
 * Architecture:
 * - FullCalendar renders the time grid (Day/Week)
 * - CalendarToolbar handles navigation + view switching
 * - AppointmentEventCard renders each event cell
 * - AppointmentDetailsDialog opens on event click
 * - useRescheduleCalendarAppointment handles drop → backend → revert-on-failure
 */
export function AppointmentCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const user = useAuthStore((s) => s.user);

  // The current "focus" date drives date-range computation
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('timeGridWeek');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] =
    useState<CalendarAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Compute API query range from current view + date
  const { dateFrom, dateTo } = computeDateRange(currentView, currentDate);

  // Fetch doctors for the filter dropdown
  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  // Fetch enriched appointments
  const { appointments, timezone, isLoading, isError } = useCalendarAppointments(
    dateFrom,
    dateTo,
    selectedDoctorId !== 'all' ? selectedDoctorId : undefined
  );

  const reschedule = useRescheduleCalendarAppointment();

  // RBAC: doctors are read-only; admin and receptionist can drag
  const isDraggable =
    user?.role === 'admin' || user?.role === 'receptionist';

  // FullCalendar event drop handler
  const handleEventDrop = useCallback(
    ({ event, revert }: EventDropArg) => {
      if (!event.start || !event.end) {
        revert();
        return;
      }

      // Prevent dropping into the past
      if (event.start < new Date()) {
        revert();
        return;
      }

      reschedule.mutate({
        id: event.id,
        start_time: event.start.toISOString(),
        end_time: event.end.toISOString(),
        revert,
      });
    },
    [reschedule]
  );

  // FullCalendar event click handler
  const handleEventClick = useCallback(({ event }: EventClickArg) => {
    const appt = event.extendedProps._appt as CalendarAppointment;
    setSelectedAppointment(appt);
    setDialogOpen(true);
  }, []);

  // Custom event renderer
  const renderEventContent = useCallback((eventInfo: EventContentArg) => {
    return <AppointmentEventCard eventInfo={eventInfo} />;
  }, []);

  // Toolbar navigation callbacks — imperatively drive FullCalendar
  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    api?.prev();
    setCurrentDate(api?.getDate() ?? currentDate);
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    api?.next();
    setCurrentDate(api?.getDate() ?? currentDate);
  };

  const handleToday = () => {
    const api = calendarRef.current?.getApi();
    api?.today();
    setCurrentDate(api?.getDate() ?? new Date());
  };

  const handleViewChange = (view: CalendarView) => {
    const api = calendarRef.current?.getApi();
    api?.changeView(view);
    setCurrentView(view);
  };

  const events = appointments.map(toFullCalendarEvent);

  return (
    <div className="flex flex-col gap-4">
      <CalendarToolbar
        currentView={currentView}
        currentDate={currentDate}
        timezone={timezone}
        doctors={doctors}
        selectedDoctorId={selectedDoctorId}
        onDoctorChange={setSelectedDoctorId}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      {/* Feedback states */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading appointments…</span>
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center gap-2 py-16 text-destructive">
          <AlertTriangle className="h-8 w-8 opacity-60" />
          <p className="text-sm font-medium">Failed to load appointments.</p>
          <p className="text-xs text-muted-foreground">
            Check your connection and try again.
          </p>
        </div>
      )}

      {/* Calendar grid */}
      {!isLoading && !isError && (
        <div
          className={`
            relative rounded-xl border border-border bg-background shadow-sm overflow-hidden
            fc-theme-override
            ${reschedule.isPending ? 'opacity-70 pointer-events-none' : ''}
          `}
        >
          {/* Loading overlay while a reschedule mutation is in-flight */}
          {reschedule.isPending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {events.length === 0 && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-muted-foreground pointer-events-none">
              <CalendarOff className="h-10 w-10 opacity-20" />
              <p className="text-sm">No appointments for this period.</p>
            </div>
          )}

          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            headerToolbar={false} // We use our own toolbar
            events={events}
            editable={isDraggable}
            droppable={false}           // External drops not supported
            eventDurationEditable={false} // Resize disabled
            snapDuration="00:30:00"
            slotDuration="00:30:00"
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            allDaySlot={false}
            height="auto"
            expandRows
            nowIndicator
            eventContent={renderEventContent}
            eventDrop={handleEventDrop}
            eventClick={handleEventClick}
            // Prevent dragging into past time slots
            selectConstraint={{ start: new Date().toISOString() }}
            eventConstraint={{ start: new Date().toISOString() }}
            validRange={{ start: new Date() }}
            // Style overrides applied via global CSS
            eventClassNames="!border-0 !bg-transparent !shadow-none !p-0 !rounded-md"
            slotLabelClassNames="text-xs text-muted-foreground"
            dayHeaderClassNames="text-xs font-semibold uppercase text-muted-foreground py-2"
          />
        </div>
      )}

      {/* Appointment details dialog */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedAppointment(null);
        }}
      />
    </div>
  );
}

/** Computes ISO date strings for the API query based on view and current date. */
function computeDateRange(
  view: CalendarView,
  date: Date
): { dateFrom: string; dateTo: string } {
  if (view === 'timeGridDay') {
    const d = format(date, 'yyyy-MM-dd');
    return { dateFrom: d, dateTo: d };
  }

  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 });      // Saturday
  return {
    dateFrom: format(start, 'yyyy-MM-dd'),
    dateTo: format(end, 'yyyy-MM-dd'),
  };
}
