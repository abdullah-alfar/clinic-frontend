import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { TenantSettings, UpdateSettingsRequest } from '../types';
import { GeneralSettings } from './GeneralSettings';
import { ThemeSettings } from './ThemeSettings';
import { LocalizationSettings } from './LocalizationSettings';
import { NotificationSettings } from './NotificationSettings';
import { IntegrationSettings } from './IntegrationSettings';
import { AISettings } from './AISettings';
import { useUpdateSettings } from '../hooks';
import { toast } from 'sonner';

const settingsSchema = z.object({
  clinic_name: z.string().min(2, 'Name is required'),
  subdomain: z.string().min(2, 'Subdomain is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  theme: z.enum(['light', 'dark', 'system']),
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  email_enabled: z.boolean(),
  whatsapp_enabled: z.boolean(),
  ai_enabled: z.boolean(),
  ai_provider: z.string(),
  ai_api_key_is_set: z.boolean(),  // Form state tracker only
  ai_api_key: z.string().optional(),
  whatsapp_provider: z.string(),
  whatsapp_webhook_secret_is_set: z.boolean(), // Form state tracker only
  whatsapp_webhook_secret: z.string().optional(),
  email_provider: z.string(),
  email_from: z.string().optional(),
});

type FormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData: TenantSettings;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const defaultValues: FormData = {
    clinic_name: initialData.clinic_name || '',
    subdomain: initialData.subdomain || '',
    timezone: initialData.timezone || 'UTC',
    language: initialData.language || 'en',
    theme: initialData.theme || 'system',
    primary_color: initialData.primary_color || '#6366f1',
    secondary_color: initialData.secondary_color || '#8b5cf6',
    email_enabled: initialData.email_enabled || false,
    whatsapp_enabled: initialData.whatsapp_enabled || false,
    ai_enabled: initialData.ai_enabled || false,
    ai_provider: initialData.ai_provider || 'log',
    ai_api_key_is_set: initialData.ai_api_key_is_set || false,
    ai_api_key: '',
    whatsapp_provider: initialData.whatsapp_provider || 'log',
    whatsapp_webhook_secret_is_set: initialData.whatsapp_webhook_secret_is_set || false,
    whatsapp_webhook_secret: '',
    email_provider: initialData.email_provider || 'log',
    email_from: initialData.email_from || '',
  };

  const form = useForm<FormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  const mut = useUpdateSettings();

  const onSubmit = async (data: FormData) => {
    // Transform to request payload, omitting unchanged secrets
    const payload: UpdateSettingsRequest = {
      clinic_name: data.clinic_name,
      subdomain: data.subdomain,
      timezone: data.timezone,
      language: data.language,
      theme: data.theme,
      primary_color: data.primary_color,
      secondary_color: data.secondary_color,
      email_enabled: data.email_enabled,
      whatsapp_enabled: data.whatsapp_enabled,
      ai_enabled: data.ai_enabled,
      ai_provider: data.ai_provider,
      ai_api_key: data.ai_api_key || undefined,
      whatsapp_provider: data.whatsapp_provider,
      whatsapp_webhook_secret: data.whatsapp_webhook_secret || undefined,
      email_provider: data.email_provider,
      email_from: data.email_from || '',
    };

    try {
      await mut.mutateAsync(payload);
      toast.success('Settings saved successfully');
      
      // Update local state so form knows new secrets are set
      if (data.ai_api_key) form.setValue('ai_api_key_is_set', true);
      if (data.whatsapp_webhook_secret) form.setValue('whatsapp_webhook_secret_is_set', true);
      form.setValue('ai_api_key', '');
      form.setValue('whatsapp_webhook_secret', '');
    } catch {
      toast.error('Failed to save settings. Please check your inputs.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative pb-24">
        
        <div className="flex items-center justify-between sticky top-[60px] z-10 bg-background/80 backdrop-blur-md pb-4 pt-4 border-b border-border/40 shadow-sm mx-[-20px] px-[20px] rounded-b-xl">
          <div>
            <h2 className="text-xl font-bold tracking-tight">System Control Panel</h2>
            <p className="text-sm text-muted-foreground">Manage your whole platform from one place</p>
          </div>
          <div className="flex gap-4">
            {form.formState.isDirty && (
              <Button type="button" variant="ghost" onClick={() => form.reset()} disabled={mut.isPending}>
                Discard Changes
              </Button>
            )}
            <Button type="submit" disabled={!form.formState.isDirty || mut.isPending} className="font-semibold px-6 shadow-md min-w-[140px]">
              {mut.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Settings</>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <GeneralSettings />
            <ThemeSettings />
            <LocalizationSettings />
          </div>
          
          <div className="space-y-8">
            <NotificationSettings />
            <IntegrationSettings />
          </div>
        </div>

        <div className="w-full">
          <AISettings />
        </div>

      </form>
    </Form>
  );
}
