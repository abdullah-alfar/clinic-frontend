'use client';

import { use } from 'react';
import { usePatientProfile } from '@/features/patient-profile/hooks/usePatientProfile';
import { PatientHeader } from '@/features/patient-profile/components/PatientHeader';
import { PatientProfileTabs } from '@/features/patient-profile/components/PatientProfileTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PatientDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { data, isLoading, isError, error } = usePatientProfile(params.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="border-b">
          <Skeleton className="h-10 w-full rounded-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             <Skeleton className="h-64 w-full rounded-md" />
             <Skeleton className="h-48 w-full rounded-md" />
          </div>
          <div className="space-y-6">
             <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <UserCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Patient Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          {error?.message || "The patient record you're looking for was not found."}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
             <ArrowLeft className="h-4 w-4" />
             Back
          </Button>
          <Button size="sm" onClick={() => router.push('/patients')}>
            Patient Registry
          </Button>
        </div>
      </div>
    );
  }

  const { patient, flags } = data.data;

  return (
    <div className="min-h-screen bg-muted/20 -m-4 md:-m-6 lg:-m-8">
      {/* 
        Container-Presenter Pattern: 
        This Page serves as the Data Fetcher (Smart Component) 
        and delegates all UI rendering to standardized Presenters.
      */}
      <div className="bg-background shadow-sm border-b mb-8">
        <PatientHeader patient={patient} flags={flags} />
      </div>

      <div className="max-w-7xl mx-auto">
        <PatientProfileTabs patient={patient} />
      </div>
    </div>
  );
}

