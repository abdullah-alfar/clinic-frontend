'use client';

import { useSettings } from '@/features/settings/hooks';
import { SettingsForm } from '@/features/settings/components';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: settings, isLoading, isError } = useSettings();

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        <p className="text-muted-foreground animate-pulse font-medium tracking-wide">
          Loading System Configuration...
        </p>
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <p className="text-destructive font-bold text-lg">Failed to load settings</p>
        <p className="text-muted-foreground max-w-sm text-center">
          There was a problem communicating with the settings api. Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-2">
      <SettingsForm initialData={settings} />
    </div>
  );
}
