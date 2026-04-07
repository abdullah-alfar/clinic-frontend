import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { SectionCard } from '@/components/layout/SectionCard';
import { BellRing } from 'lucide-react';

export function NotificationSettings() {
  const { control } = useFormContext();

  return (
    <SectionCard title="Notification Preferences" icon={BellRing} description="Global toggles for patient communications.">
      <div className="space-y-6">
        <FormField
          control={control}
          name="email_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/10">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email Notifications</FormLabel>
                <FormDescription>
                  Automatically send appointment confirmations and reminders via Email.
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
          control={control}
          name="whatsapp_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/10">
              <div className="space-y-0.5">
                <FormLabel className="text-base text-green-600 dark:text-green-500 font-semibold">WhatsApp Notifications</FormLabel>
                <FormDescription>
                  Send interactive updates and multi-step conversational prompts.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-green-600"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  );
}
