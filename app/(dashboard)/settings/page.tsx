'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SectionCard } from '@/components/layout/SectionCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Palette, User, Building2, Globe, Clock } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { tenant, isLoading } = useTheme();
  const user = useAuthStore((s) => s.user);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'U';

  const themeFields = [
    { label: 'Primary Colour', value: tenant?.primary_color },
    { label: 'Secondary Colour', value: tenant?.secondary_color },
    { label: 'Border Radius', value: tenant?.border_radius },
    { label: 'Font Family', value: tenant?.font_family },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-40 bg-muted rounded" />
        <div className="h-40 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Clinic branding, account, and configuration"
      />

      {/* Your Account */}
      <SectionCard title="Your Account" icon={User}>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{user?.name ?? '—'}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email ?? '—'}</p>
          </div>
          <Badge variant="secondary" className="capitalize shrink-0">{user?.role}</Badge>
        </div>

        <Separator className="my-4" />

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <SettingField label="User ID" value={user?.id} mono />
          <SettingField label="Tenant ID" value={user?.tenant_id} mono />
        </dl>
      </SectionCard>

      {/* Clinic Branding */}
      <SectionCard title="Clinic Branding" icon={Building2}>
        <div className="space-y-4">
          {tenant?.logo_url && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Logo</p>
              <div className="inline-flex items-center justify-center border border-border rounded-lg p-3 bg-muted/20">
                <Image
                  src={tenant.logo_url}
                  alt={tenant.name ?? 'Clinic logo'}
                  width={160}
                  height={48}
                  className="object-contain max-h-12"
                />
              </div>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <SettingField label="Clinic Name" value={tenant?.name} />
            <SettingField label="Subdomain" value={tenant?.subdomain} mono />
          </dl>
        </div>
      </SectionCard>

      {/* Timezone */}
      {tenant?.timezone && (
        <SectionCard title="Timezone" icon={Globe}>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">{tenant.timezone}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All appointment times across the app are displayed in this timezone.
              </p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Theme Configuration */}
      <SectionCard title="Theme Configuration" icon={Palette}>
        <div className="divide-y divide-border">
          {themeFields.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="flex items-center gap-2.5">
                {label.includes('Colour') && value && (
                  <div
                    className="h-5 w-5 rounded-full border border-border shadow-sm"
                    style={{ backgroundColor: value }}
                    title={value}
                  />
                )}
                <code className="text-sm font-mono text-foreground">
                  {value || <span className="text-muted-foreground">—</span>}
                </code>
              </div>
            </div>
          ))}
        </div>

        {!tenant && (
          <p className="text-sm text-muted-foreground py-2">
            No theme configuration found for this tenant.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

function SettingField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
      <dd className={`text-sm break-all ${mono ? 'font-mono text-xs' : 'font-medium'}`}>
        {value || '—'}
      </dd>
    </div>
  );
}
