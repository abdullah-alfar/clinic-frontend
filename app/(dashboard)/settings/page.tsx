'use client';

import { useTheme as useTenantTheme } from '@/providers/ThemeProvider';
import { useTheme as useNextTheme } from 'next-themes';
import { useAuthStore } from '@/hooks/useAuthStore';
import { SectionCard } from '@/components/layout/SectionCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Palette, User, Building2, Globe, Clock, Sun, Moon, Monitor } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { tenant, isLoading: tenantLoading } = useTenantTheme();
  const { theme, setTheme } = useNextTheme();
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

  if (tenantLoading) {
    return (
      <div className="space-y-6 max-w-4xl animate-pulse">
        <div className="h-12 bg-muted rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="Settings"
        description="Manage your account preferences, clinic branding, and system configuration."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Your Account */}
          <SectionCard title="Your Account" icon={User} description="Manage your personal profile information.">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 shrink-0 ring-4 ring-background shadow-xl">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold truncate">{user?.name ?? '—'}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize">
                    {user?.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user?.email ?? '—'}</p>
              </div>
            </div>

            <Separator className="my-6 opacity-50" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SettingField label="User ID" value={user?.id} mono />
              <SettingField label="Role" value={user?.role} className="capitalize" />
            </div>
          </SectionCard>

          {/* Clinic Branding */}
          <SectionCard title="Clinic Branding" icon={Building2} description="Custom styles and identity for your clinic.">
            <div className="grid grid-cols-1 gap-8">
              {tenant?.logo_url && (
                <div>
                  <p className="text-sm font-medium mb-3">Organization Logo</p>
                  <div className="inline-flex items-center justify-center border border-border/60 rounded-2xl p-6 bg-muted/30 backdrop-blur-md">
                    <Image
                      src={tenant.logo_url}
                      alt={tenant.name ?? 'Clinic logo'}
                      width={200}
                      height={60}
                      className="object-contain max-h-16"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SettingField label="Clinic Name" value={tenant?.name} />
                <SettingField label="Subdomain" value={tenant?.subdomain} mono className="text-primary font-semibold" />
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-4">Design Tokens</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {themeFields.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-3">
                        {label.includes('Colour') && value && (
                          <div
                            className="h-6 w-6 rounded-lg border border-white/20 shadow-lg"
                            style={{ backgroundColor: value }}
                          />
                        )}
                        <code className="text-xs font-mono font-semibold bg-background/50 px-2 py-1 rounded">
                          {value || 'Default'}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          {/* Display Theme */}
          <SectionCard title="Interface Theme" icon={Palette}>
            <div className="grid grid-cols-3 gap-2">
              <ThemeButton 
                active={theme === 'light'} 
                onClick={() => setTheme('light')} 
                icon={Sun} 
                label="Light" 
              />
              <ThemeButton 
                active={theme === 'dark'} 
                onClick={() => setTheme('dark')} 
                icon={Moon} 
                label="Dark" 
              />
              <ThemeButton 
                active={theme === 'system'} 
                onClick={() => setTheme('system')} 
                icon={Monitor} 
                label="System" 
              />
            </div>
          </SectionCard>

          {/* Localization */}
          <SectionCard title="Localization" icon={Globe}>
            <div className="space-y-4">
              <div className="flex items-top gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">{tenant?.timezone || 'Not set'}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Automatically syncs all schedules and appointments to this region.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function ThemeButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex flex-col h-20 gap-2 border-border/60 hover:bg-muted/50 transition-all",
        active && "border-primary bg-primary/5 text-primary ring-1 ring-primary/30"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

function SettingField({
  label,
  value,
  mono = false,
  className,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</dt>
      <dd className={cn(
        "text-sm",
        mono ? 'font-mono bg-muted/30 px-2 py-1 rounded w-fit' : 'font-medium'
      )}>
        {value || <span className="text-muted-foreground italic">Not specified</span>}
      </dd>
    </div>
  );
}
