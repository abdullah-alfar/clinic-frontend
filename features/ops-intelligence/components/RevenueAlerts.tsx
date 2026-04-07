import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMissingRevenue } from '../api';
import { AlertCircle, Plus, DollarSign, Receipt, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface RevenueAlertsProps {
  appointmentId: string;
}

export const RevenueAlerts: React.FC<RevenueAlertsProps> = ({ appointmentId }) => {
  const { data, isLoading } = useMissingRevenue(appointmentId);

  if (isLoading) return <Skeleton className="h-32 w-full rounded-2xl" />;
  
  if (!data || data.missing_services.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-900/50 shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight text-amber-900 dark:text-amber-100 uppercase tracking-widest text-[10px]">Revenue Protection</h4>
              <p className="text-sm font-extrabold text-amber-700 dark:text-amber-400">Missing Billing Detected</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/50 dark:bg-black/20 border-amber-200 text-amber-700 dark:text-amber-300 font-bold">
            {data.missing_services.length} Items
          </Badge>
        </div>

        <p className="text-xs text-amber-800/70 dark:text-amber-200/50 mb-4 font-medium leading-relaxed">
          The following services were mentioned in clinical notes but haven't been invoiced yet:
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {data.missing_services.map((service, idx) => (
            <Badge key={idx} variant="secondary" className="px-3 py-1 rounded-lg bg-white dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-none shadow-sm font-semibold text-[11px]">
              {service}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 shadow-lg shadow-amber-500/10">
            <Receipt className="h-4 w-4" />
            Create Invoice
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 transition-all">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
