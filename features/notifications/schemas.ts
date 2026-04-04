import { z } from 'zod';

export const notificationPreferencesSchema = z.object({
  email_enabled: z.boolean(),
  whatsapp_enabled: z.boolean(),
  reminder_enabled: z.boolean(),
  appointment_created_enabled: z.boolean(),
  appointment_confirmed_enabled: z.boolean(),
  appointment_canceled_enabled: z.boolean(),
  appointment_rescheduled_enabled: z.boolean(),
});

export type NotificationPreferencesFormValues = z.infer<typeof notificationPreferencesSchema>;
