'use client';

import { use } from 'react';
import { useAppointment } from '@/features/appointments/hooks/useAppointment';
import { AppointmentDetailView } from '@/features/appointments/components/AppointmentDetailView';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AppointmentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { data, isLoading, isError, error } = useAppointment(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <CalendarX className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Appointment Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {error?.message || "The appointment record you're looking for was not found or has been removed."}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
             <ArrowLeft className="h-4 w-4" />
             Back
          </Button>
          <Button size="sm" onClick={() => router.push('/appointments')}>
            Appointments List
          </Button>
        </div>
      </div>
    );
  }

  return <AppointmentDetailView appointment={data as any} />;
}
