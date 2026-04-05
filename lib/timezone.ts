/**
 * lib/timezone.ts
 *
 * Canonical timezone helpers for the Clinic Management SaaS frontend.
 *
 * Design decisions:
 * - All dates stored on the backend are UTC (TIMESTAMPTZ in Postgres).
 * - All display-side formatting must respect the clinic's tenant timezone.
 * - This module is the SINGLE import point for any date formatting across:
 *     booking, calendar, appointments, availability, dashboard, notifications.
 *
 * Dependencies: date-fns + date-fns-tz (already in package.json)
 */

import { format, parseISO, isValid } from 'date-fns';
import {
  formatInTimeZone,
  toZonedTime,
  fromZonedTime,
} from 'date-fns-tz';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fallback timezone used when no tenant timezone is available. */
export const DEFAULT_TIMEZONE = 'UTC';

/** ISO 8601 datetime format used throughout the API. */
const ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ssxxx";

/** Human-readable date + time format shown in the UI. */
const DISPLAY_DATETIME_FORMAT = 'MMM d, yyyy — h:mm a';

/** Human-readable date-only format. */
const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';

/** Human-readable time-only format (12-hour). */
const DISPLAY_TIME_FORMAT = 'h:mm a';

/** Machine-readable date for form inputs. */
const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

/** Machine-readable time for form inputs. */
const TIME_INPUT_FORMAT = 'HH:mm';

// ─── Normalisation helper ─────────────────────────────────────────────────────

/**
 * Accepts a Date object or an ISO string (from the API) and returns a Date.
 * Returns null for invalid inputs rather than throwing, so callers can guard cleanly.
 */
function toDate(value: Date | string): Date | null {
  if (value instanceof Date) return isValid(value) ? value : null;
  try {
    const d = parseISO(value);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

// ─── Display formatters ───────────────────────────────────────────────────────

/**
 * Formats a UTC date/string into a full human-readable datetime string
 * expressed in the clinic's local timezone.
 *
 * @example
 * formatClinicDateTime('2026-04-05T09:00:00Z', 'Asia/Baghdad')
 * // => "Apr 5, 2026 — 12:00 PM"
 */
export function formatClinicDateTime(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
  fmt: string = DISPLAY_DATETIME_FORMAT,
): string {
  const d = toDate(date);
  if (!d) return '—';
  return formatInTimeZone(d, timezone, fmt);
}

/**
 * Formats a UTC date/string to date-only in the clinic's local timezone.
 *
 * @example
 * formatClinicDate('2026-04-05T09:00:00Z', 'Asia/Baghdad')
 * // => "Apr 5, 2026"
 */
export function formatClinicDate(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const d = toDate(date);
  if (!d) return '—';
  return formatInTimeZone(d, timezone, DISPLAY_DATE_FORMAT);
}

/**
 * Formats a UTC date/string to time-only in the clinic's local timezone.
 *
 * @example
 * formatClinicTime('2026-04-05T09:00:00Z', 'Asia/Baghdad')
 * // => "12:00 PM"
 */
export function formatClinicTime(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const d = toDate(date);
  if (!d) return '—';
  return formatInTimeZone(d, timezone, DISPLAY_TIME_FORMAT);
}

/**
 * Formats a UTC date/string to a date input value (YYYY-MM-DD)
 * expressed in the clinic's local timezone — avoids off-by-one day errors
 * that occur when converting UTC midnight across timezone boundaries.
 *
 * @example
 * formatClinicDateInput('2026-04-05T21:00:00Z', 'Asia/Baghdad')
 * // => "2026-04-06"  (the next day in UTC+3)
 */
export function formatClinicDateInput(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const d = toDate(date);
  if (!d) return '';
  return formatInTimeZone(d, timezone, DATE_INPUT_FORMAT);
}

/**
 * Formats a UTC date/string to a time input value (HH:MM)
 * expressed in the clinic's local timezone.
 */
export function formatClinicTimeInput(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const d = toDate(date);
  if (!d) return '';
  return formatInTimeZone(d, timezone, TIME_INPUT_FORMAT);
}

/**
 * Formats a relative or absolute datetime for notifications and activity feeds.
 * Displays time-only for today, date+time for older entries.
 */
export function formatClinicRelativeTime(
  date: Date | string,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  const d = toDate(date);
  if (!d) return '—';

  const todayStr = formatInTimeZone(new Date(), timezone, DATE_INPUT_FORMAT);
  const targetStr = formatInTimeZone(d, timezone, DATE_INPUT_FORMAT);

  return todayStr === targetStr
    ? formatInTimeZone(d, timezone, DISPLAY_TIME_FORMAT)
    : formatInTimeZone(d, timezone, DISPLAY_DATETIME_FORMAT);
}

// ─── UTC conversion helpers ───────────────────────────────────────────────────

/**
 * Converts a local date/time expressed in the given clinic timezone to UTC.
 * Use this when building API request bodies from user-entered local times.
 *
 * @example
 * toUTC(new Date('2026-04-05T12:00:00'), 'Asia/Baghdad')
 * // => Date representing 2026-04-05T09:00:00Z
 */
export function toUTC(date: Date | string, timezone: string = DEFAULT_TIMEZONE): Date {
  const d = toDate(date);
  if (!d) return new Date(NaN);
  return fromZonedTime(d, timezone);
}

/**
 * Converts a UTC date to its wall-clock equivalent in the given clinic timezone.
 * Use this when you need a Date object (not a string) for calendar/picker components.
 *
 * @example
 * fromUTC(new Date('2026-04-05T09:00:00Z'), 'Asia/Baghdad')
 * // => Date representing 2026-04-05T12:00:00 in Baghdad local time
 */
export function fromUTC(date: Date | string, timezone: string = DEFAULT_TIMEZONE): Date {
  const d = toDate(date);
  if (!d) return new Date(NaN);
  return toZonedTime(d, timezone);
}

/**
 * Formats a date as an ISO 8601 string in the given timezone offset.
 * Useful when the backend expects a local-timezone ISO string rather than UTC.
 */
export function toLocalISO(date: Date | string, timezone: string = DEFAULT_TIMEZONE): string {
  const d = toDate(date);
  if (!d) return '';
  return formatInTimeZone(d, timezone, ISO_FORMAT);
}
