import { useFormContext, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { SectionCard } from '@/components/layout/SectionCard';
import { Link2, Mail, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useTestEmail, useTestWhatsApp } from '../hooks';
import { toast } from 'sonner';

export function IntegrationSettings() {
  const { control, getValues } = useFormContext();

  return (
    <div className="space-y-6">
      <SectionCard title="Email Configuration" icon={Mail} description="Provider used for all outgoing emails.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-6">
            <FormField
              control={control}
              name="email_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="log">Local Log (Dev only)</SelectItem>
                      <SelectItem value="smtp">SMTP Server</SelectItem>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="email_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Address</FormLabel>
                  <FormControl>
                    <Input placeholder="noreply@clinic.com" {...field} />
                  </FormControl>
                  <FormDescription>Displayed as sender in all outbound emails.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="md:border-l md:pl-6 h-full flex flex-col justify-center">
            <TestEmailCard />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="WhatsApp Webhook" icon={MessageSquare} description="Configure WhatsApp provider and secret keys.">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-6">
            <FormField
              control={control}
              name="whatsapp_provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="log">Local Log (Dev only)</SelectItem>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="meta">Meta Official API</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <WebhookSecretField />
          </div>
          
          <div className="md:border-l md:pl-6 h-full flex flex-col justify-center">
            <TestWhatsAppCard />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function WebhookSecretField() {
  const { control } = useFormContext();
  const isSet = useWatch({ control, name: 'whatsapp_webhook_secret_is_set' });
  const [editing, setEditing] = useState(!isSet);

  return (
    <FormField
      control={control}
      name="whatsapp_webhook_secret"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Webhook Verification Secret</FormLabel>
          {!editing ? (
            <div className="flex gap-2 items-center w-full">
              <Input value="••••••••••••••••••••••••" disabled className="bg-muted text-muted-foreground font-mono" />
              <Button type="button" variant="outline" onClick={() => setEditing(true)}>Update</Button>
            </div>
          ) : (
            <FormControl>
              <Input type="password" placeholder="Enter secret token" {...field} />
            </FormControl>
          )}
          <FormDescription>Used to verify incoming messages from the provider.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TestEmailCard() {
  const [to, setTo] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const mut = useTestEmail();

  const runTest = async () => {
    if (!to) return toast.error("Please enter a recipient email");
    setStatus('loading');
    try {
      await mut.mutateAsync(to);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="p-5 rounded-xl border bg-muted/20 space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" /> Test Connection
      </h4>
      <div className="flex gap-2">
        <Input placeholder="Recipient email" value={to} onChange={e => setTo(e.target.value)} disabled={status === 'loading'} className="text-sm" />
        <Button onClick={runTest} disabled={status === 'loading'} variant="secondary">Test</Button>
      </div>
      {status === 'success' && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Email sent successfully</p>}
      {status === 'error' && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Test failed, please check provider settings</p>}
    </div>
  );
}

function TestWhatsAppCard() {
  const [to, setTo] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const mut = useTestWhatsApp();

  const runTest = async () => {
    if (!to) return toast.error("Please enter a recipient number");
    setStatus('loading');
    try {
      await mut.mutateAsync(to);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="p-5 rounded-xl border bg-muted/20 space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" /> Test Connection
      </h4>
      <div className="flex gap-2">
        <Input placeholder="+1234567890" value={to} onChange={e => setTo(e.target.value)} disabled={status === 'loading'} className="text-sm" />
        <Button onClick={runTest} disabled={status === 'loading'} variant="secondary">Test</Button>
      </div>
      <p className="text-xs text-muted-foreground">Ensure the test number is opted-in if using a real provider.</p>
      {status === 'success' && <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Message sent successfully</p>}
      {status === 'error' && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Provider rejected request</p>}
    </div>
  );
}
