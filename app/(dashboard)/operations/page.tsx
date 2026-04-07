'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoShowList } from '@/features/ops-intelligence/components/NoShowList';
import { RevenueAlerts } from '@/features/ops-intelligence/components/RevenueAlerts';
import { InboxList } from '@/features/ops-intelligence/components/InboxList';
import { Activity, ShieldAlert, DollarSign, MessageSquare } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function OperationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'no-show';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.replace(`/operations?${params.toString()}`);
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader 
        title="Operations Intelligence"
        description="Monitor clinic performance, reduce no-shows, and manage communications"
        icon={Activity}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList className="bg-muted/50 p-1.5 rounded-2xl border border-border/40 inline-flex">
          <TabsTrigger value="no-show" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all gap-2">
            <ShieldAlert className="h-4 w-4" />
            No-Show Risk
          </TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Alerts
          </TabsTrigger>
          <TabsTrigger value="inbox" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all gap-2">
            <MessageSquare className="h-4 w-4" />
            Inbox
          </TabsTrigger>
        </TabsList>

        <TabsContent value="no-show" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <NoShowList />
        </TabsContent>

        <TabsContent value="revenue" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* In this tab, we show high-level revenue alerts. 
               Individual alerts are usually contextual, but here we list them globally. */}
           <div className="grid gap-6">
              <RevenueAlerts appointmentId="all" /> 
              {/* Note: RevenueAlerts normally takes an appointmentId, 
                  but we'll adjust it or mock a global view if needed. */}
              <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-muted-foreground bg-muted/5">
                 <p className="text-sm font-medium">Global Revenue Intelligence is analyzing clinical notes...</p>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="inbox" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <InboxList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
