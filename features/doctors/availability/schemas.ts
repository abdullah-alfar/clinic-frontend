import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const scheduleSchema = z.object({
  day_of_week: z.number().int().min(0).max(6, { message: 'Day must be between 0 (Sunday) and 6 (Saturday)' }),
  start_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }),
  end_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }),
}).refine(data => {
  return data.start_time < data.end_time;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const updateScheduleSchema = z.object({
  start_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }).optional(),
  end_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }).optional(),
  is_active: z.boolean().optional(),
}).refine(data => {
  if (data.start_time && data.end_time) {
    return data.start_time < data.end_time;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const breakSchema = z.object({
  start_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }),
  end_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }),
  label: z.string().min(1, { message: 'Label is required' }),
}).refine(data => {
  return data.start_time < data.end_time;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const exceptionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be YYYY-MM-DD' }),
  type: z.enum(['day_off', 'override']),
  start_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }).optional().nullable(),
  end_time: z.string().regex(timeRegex, { message: 'Must be a valid HH:MM time' }).optional().nullable(),
  reason: z.string().optional().nullable(),
}).refine(data => {
  if (data.type === 'override') {
    if (!data.start_time || !data.end_time) {
      return false;
    }
    return data.start_time < data.end_time;
  }
  return true;
}, {
  message: 'Override requires a valid start and end time (start must be before end)',
  path: ['end_time'],
});
