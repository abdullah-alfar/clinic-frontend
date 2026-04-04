import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HeartPulse } from 'lucide-react';
import {
  notificationPreferencesSchema,
  NotificationPreferencesFormValues,
} from '../schemas';
import { usePatientNotificationPreferences } from '../hooks/usePatientNotificationPreferences';
import { useUpdatePatientNotificationPreferences } from '../hooks/useUpdatePatientNotificationPreferences';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

interface NotificationPreferencesFormProps {
  patientId: string;
}

export function NotificationPreferencesForm({ patientId }: NotificationPreferencesFormProps) {
  const { data: prefs, isLoading } = usePatientNotificationPreferences(patientId);
  const { mutate: updatePrefs, isPending } = useUpdatePatientNotificationPreferences(patientId);

  const form = useForm<NotificationPreferencesFormValues>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      email_enabled: true,
      whatsapp_enabled: true,
      reminder_enabled: true,
      appointment_created_enabled: true,
      appointment_confirmed_enabled: true,
      appointment_canceled_enabled: true,
      appointment_rescheduled_enabled: true,
    },
  });

  useEffect(() => {
    if (prefs) {
      form.reset({
        email_enabled: prefs.email_enabled,
        whatsapp_enabled: prefs.whatsapp_enabled,
        reminder_enabled: prefs.reminder_enabled,
        appointment_created_enabled: prefs.appointment_created_enabled,
        appointment_confirmed_enabled: prefs.appointment_confirmed_enabled,
        appointment_canceled_enabled: prefs.appointment_canceled_enabled,
        appointment_rescheduled_enabled: prefs.appointment_rescheduled_enabled,
      });
    }
  }, [prefs, form]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  const onSubmit = (data: NotificationPreferencesFormValues) => {
    updatePrefs(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Preferences</CardTitle>
        <CardDescription>
          Configure how and when this patient receives communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Channels */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Communication Channels</h3>
              <FormField
                control={form.control}
                name="email_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <FormDescription>
                        Receive emails for appointments, bills, and reports.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">WhatsApp Messages</FormLabel>
                      <FormDescription>
                        Receive quick updates and bot interaction over WhatsApp.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Event Types */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Event Triggers</h3>
              
              <FormField
                control={form.control}
                name="reminder_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                    <div className="space-y-0.5 mt-2">
                      <FormLabel>24hr Appointment Reminders</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointment_created_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                    <div className="space-y-0.5 mt-2">
                      <FormLabel>Booking Confirmations</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointment_rescheduled_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                    <div className="space-y-0.5 mt-2">
                      <FormLabel>Reschedule Notices</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointment_canceled_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg p-2 hover:bg-slate-50">
                    <div className="space-y-0.5 mt-2">
                      <FormLabel>Cancellation Alerts</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <HeartPulse className="mr-2 h-4 w-4 animate-pulse" />}
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
