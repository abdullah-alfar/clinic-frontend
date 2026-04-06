'use client';

import { PatientDTO, PatientFlag } from '../types';
import { Badge } from '@/components/ui/badge';
import { PatientQuickActions } from './PatientQuickActions';
import { Phone, Mail, Calendar } from 'lucide-react';

interface PatientProfileHeaderProps {
  patient: PatientDTO;
  flags: PatientFlag[];
}

export function PatientProfileHeader({ patient, flags }: PatientProfileHeaderProps) {
  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {patient.first_name} {patient.last_name}
          </h1>
          {flags.length > 0 && (
            <div className="flex gap-1">
              {flags.map((flag, i) => (
                <Badge key={i} variant={flag.type === 'alert' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0">
                  {flag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone || 'No phone'}</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {patient.email || 'No email'}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {calculateAge(patient.date_of_birth)} years</span>
        </div>
      </div>
      <PatientQuickActions patientId={patient.id} />
    </div>
  );
}
