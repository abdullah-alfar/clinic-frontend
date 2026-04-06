'use client';

import React from 'react';
import { useDoctorDashboard } from '@/features/doctor-dashboard/hooks/useDoctorDashboard';
import { DoctorDashboardHeader } from '@/features/doctor-dashboard/components/DoctorDashboardHeader';
import { DoctorStatsCards } from '@/features/doctor-dashboard/components/DoctorStatsCards';
import { TodayAppointmentsList } from '@/features/doctor-dashboard/components/TodayAppointmentsList';
import { UpcomingAppointmentsList } from '@/features/doctor-dashboard/components/UpcomingAppointmentsList';
import { RecentPatientsList } from '@/features/doctor-dashboard/components/RecentPatientsList';
import { RecentMedicalActivity } from '@/features/doctor-dashboard/components/RecentMedicalActivity';
import { DoctorQuickActions } from '@/features/doctor-dashboard/components/DoctorQuickActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DoctorDashboardPage() {
  const { data, isLoading, isError, error } = useDoctorDashboard();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[80vh] p-8">
        <Alert variant="destructive" className="max-w-md border-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Error Loading Dashboard</AlertTitle>
          <AlertDescription className="mt-2 text-md">
            {(error as any)?.response?.data?.message || 'Could not fetch your dashboard data at this time. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Header Section */}
      <DoctorDashboardHeader doctor={data.doctor} />

      {/* Statistics Section */}
      <DoctorStatsCards stats={data.stats} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Left Column: Schedule (Large) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TodayAppointmentsList appointments={data.today_appointments} />
          
          {/* Recent Patients Section */}
          <RecentPatientsList patients={data.recent_patients} />
        </div>

        {/* Right Column: Mini Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <UpcomingAppointmentsList appointments={data.upcoming_appointments} />
          
          <DoctorQuickActions />
          
          <RecentMedicalActivity activities={data.recent_medical_activity} />
        </div>
      </div>

      {/* Bottom context/footer area */}
      <div className="text-center pb-8 pt-4">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          &copy; {new Date().getFullYear()} Clinic Management SaaS &bull; High Performance Medical Workspace
        </p>
      </div>
    </div>
  );
}
