import type { EventContentArg } from '@fullcalendar/core';
import type { AppointmentStatus } from '@/types';

/** Maps appointment status to a Tailwind border + background color class. */
const STATUS_STYLES: Record<
  AppointmentStatus,
  { border: string; bg: string; text: string; dot: string }
> = {
  scheduled: {
    border: 'border-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-900 dark:text-blue-100',
    dot: 'bg-blue-400',
  },
  confirmed: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-900 dark:text-emerald-100',
    dot: 'bg-emerald-400',
  },
  completed: {
    border: 'border-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  canceled: {
    border: 'border-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-800 dark:text-rose-200',
    dot: 'bg-rose-400',
  },
};

interface AppointmentEventCardProps {
  eventInfo: EventContentArg;
}

/**
 * Custom event renderer for FullCalendar.
 * Renders a compact card with patient name, doctor name, and status indicator.
 * Sized to fit inside FullCalendar's time-grid cell.
 */
export function AppointmentEventCard({ eventInfo }: AppointmentEventCardProps) {
  const { event } = eventInfo;
  const status = (event.extendedProps.status as AppointmentStatus) ?? 'scheduled';
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.scheduled;

  const patientName = event.extendedProps.patient_name as string;
  const doctorName = event.extendedProps.doctor_name as string;
  const reason = event.extendedProps.reason as string | null;

  return (
    <div
      className={`
        h-full w-full overflow-hidden rounded-md border-l-[3px] px-2 py-1 cursor-pointer
        transition-shadow hover:shadow-md
        ${styles.border} ${styles.bg} ${styles.text}
      `}
    >
      {/* Patient name — primary label */}
      <p className="text-[11px] font-semibold leading-tight truncate">
        {patientName}
      </p>

      {/* Doctor name */}
      <p className="text-[10px] leading-tight truncate opacity-75">
        {doctorName}
      </p>

      {/* Reason, only if the slot is tall enough */}
      {reason && (
        <p className="text-[10px] leading-tight truncate opacity-60 mt-0.5">
          {reason}
        </p>
      )}

      {/* Status dot */}
      <span
        className={`inline-block mt-0.5 h-1.5 w-1.5 rounded-full ${styles.dot}`}
        aria-label={`Status: ${status}`}
      />
    </div>
  );
}
