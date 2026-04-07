import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionCard } from '@/components/layout/SectionCard';
import { Building2 } from 'lucide-react';

export function GeneralSettings() {
  const { control } = useFormContext();

  return (
    <SectionCard title="Clinic Branding" icon={Building2} description="Core identity settings for your organization.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="clinic_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Acme Health Clinic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="subdomain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subdomain / Identifier</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input placeholder="acme-health" className="rounded-r-none font-mono" {...field} />
                  <span className="bg-muted px-4 py-2 border border-l-0 border-input rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
                    .clinic.com
                  </span>
                </div>
              </FormControl>
              <FormDescription>Used for URL access (requires backend restart if changed).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  );
}
