/**
 * lib/formatters.ts
 *
 * Timezone-aware date/time formatters for the Clinic Management SaaS.
 *
 * These 3-argument functions (date, timezone?, formatStr?) are the established
 * API used throughout the codebase (calendar, appointments, invoices, dashboard).
 * They remain here for backwards-compatibility.
 *
 * Additional helpers (toUTC, fromUTC, formatClinicRelativeTime, etc.) are
 * available by importing directly from '@/lib/timezone'.
 */

import { format as formatInBrowser } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Formats a date in the clinic's timezone (or browser local if no timezone given).
 * @param date    - UTC date value (Date, ISO string, or timestamp)
 * @param timezone - IANA timezone string (e.g. 'Asia/Baghdad')
 * @param formatStr - date-fns format string (default: 'MMM d, yyyy')
 */
export function formatClinicDate(
  date: Date | string | number | null | undefined,
  timezone?: string,
  formatStr = 'MMM d, yyyy',
): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return timezone ? formatInTimeZone(d, timezone, formatStr) : formatInBrowser(d, formatStr);
  } catch {
    return '';
  }
}

/**
 * Formats a time in the clinic's timezone.
 * @param formatStr - default: 'h:mm a'
 */
export function formatClinicTime(
  date: Date | string | number | null | undefined,
  timezone?: string,
  formatStr = 'h:mm a',
): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return timezone ? formatInTimeZone(d, timezone, formatStr) : formatInBrowser(d, formatStr);
  } catch {
    return '';
  }
}

/**
 * Formats a full datetime in the clinic's timezone.
 * @param formatStr - default: 'MMM d, yyyy - h:mm a'
 */
export function formatClinicDateTime(
  date: Date | string | number | null | undefined,
  timezone?: string,
  formatStr = 'MMM d, yyyy - h:mm a',
): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return timezone ? formatInTimeZone(d, timezone, formatStr) : formatInBrowser(d, formatStr);
  } catch {
    return '';
  }
}

// ── New helpers from timezone.ts — re-exported for convenience ────────────────
// Callers that need toUTC, fromUTC, formatClinicRelativeTime, etc. should
// import from '@/lib/timezone' directly, but they are re-exported here too.
export {
  formatClinicDateInput,
  formatClinicTimeInput,
  formatClinicRelativeTime,
  toUTC,
  fromUTC,
  toLocalISO,
} from './timezone';
