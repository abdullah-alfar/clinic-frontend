import { format as formatInBrowser } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Returns a clinic-formatted date string using the clinic's timezone.
 * Falls back to local browser timezone if no timezone is provided.
 */
export function formatClinicDate(date: Date | string | number | null | undefined, timezone?: string, formatStr = 'MMM d, yyyy'): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return timezone ? formatInTimeZone(d, timezone, formatStr) : formatInBrowser(d, formatStr);
  } catch (e) {
    return '';
  }
}

/**
 * Returns a clinic-formatted time string using the clinic's timezone.
 */
export function formatClinicTime(date: Date | string | number | null | undefined, timezone?: string, formatStr = 'h:mm a'): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return timezone ? formatInTimeZone(d, timezone, formatStr) : formatInBrowser(d, formatStr);
  } catch (e) {
    return '';
  }
}

/**
 * Returns a clinic-formatted complete date and time string using the clinic's timezone.
 */
export function formatClinicDateTime(date: Date | string | number | null | undefined, timezone?: string, formatStr = 'MMM d, yyyy - h:mm a'): string {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return timezone ? formatInTimeZone(d, timezone, formatStr) : formatInBrowser(d, formatStr);
  } catch (e) {
    return '';
  }
}
