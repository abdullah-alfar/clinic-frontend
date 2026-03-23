'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Palette, User, Building2 } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { tenant } = useTheme();
  const user = useAuthStore((s) => s.user);

  const themeValues = [
    { label: 'Primary Color', value: tenant?.primary_color },
    { label: 'Secondary Color', value: tenant?.secondary_color },
    { label: 'Border Radius', value: tenant?.border_radius },
    { label: 'Font Family', value: tenant?.font_family },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Clinic branding and account information</p>
      </div>

      {/* Current User */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" />Your Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Badge variant="secondary" className="ml-auto capitalize">{user?.role}</Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">User ID</span><p className="font-mono text-xs mt-0.5 break-all">{user?.id}</p></div>
            <div><span className="text-muted-foreground">Tenant ID</span><p className="font-mono text-xs mt-0.5 break-all">{user?.tenant_id}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Tenant Branding */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" />Clinic Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {tenant?.logo_url && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Logo</p>
              <Image src={tenant.logo_url} alt={tenant.name} width={160} height={48} className="object-contain max-h-12 border border-border rounded-md p-2 bg-muted/30" />
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Clinic Name</p>
            <p className="font-semibold mt-0.5">{tenant?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subdomain</p>
            <p className="font-mono text-sm mt-0.5">{tenant?.subdomain ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Theme Values */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" />Theme Configuration</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {themeValues.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  {label.includes('Color') && value && (
                    <div className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: value }} />
                  )}
                  <code className="text-sm font-mono">{value || '—'}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
