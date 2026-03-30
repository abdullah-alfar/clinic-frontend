import { DoctorAvailabilityPage } from '@/features/doctors/availability/components/DoctorAvailabilityPage';

export default async function AvailabilityRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <DoctorAvailabilityPage doctorId={resolvedParams.id} />;
}
