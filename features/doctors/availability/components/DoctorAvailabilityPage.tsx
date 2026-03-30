'use client';

import { useDoctorAvailability } from '../hooks/useAvailability';
import { WeeklyScheduleEditor } from './WeeklyScheduleEditor';
import { ExceptionsEditor } from './ExceptionsEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/lib/api/doctors';

export function DoctorAvailabilityPage({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { data: availability, isLoading: isAuthLoading, error } = useDoctorAvailability(doctorId);
  const { data: doctors } = useQuery({ queryKey: ['doctors'], queryFn: getDoctors });
  
  const doctor = doctors?.find(d => d.id === doctorId);

  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !availability) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push('/doctors')} className="-ml-4 h-8 px-2 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Doctors
        </Button>
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg flex items-center border border-destructive/20 gap-3">
          <Stethoscope className="h-5 w-5" />
          <p>Failed to load availability configuration. Please ensure this doctor exists and you have permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.push('/doctors')} className="-ml-3 h-8 px-2 text-muted-foreground mb-1">
            <ArrowLeft className="mr-2 h-4 w-4" /> Doctors List
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Availability Configuration</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
            <Stethoscope className="h-4 w-4" /> 
            {doctor?.full_name || 'Dr.'} {doctor?.specialty ? `— ${doctor.specialty}` : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <WeeklyScheduleEditor 
          doctorId={doctorId} 
          schedules={availability.schedules} 
        />
        
        <ExceptionsEditor 
          doctorId={doctorId} 
          exceptions={availability.exceptions} 
        />
      </div>
    </div>
  );
}
