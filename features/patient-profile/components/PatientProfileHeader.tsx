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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {patient.first_name} {patient.last_name}
          </h1>
          {flags.length > 0 && (
            <div className="flex gap-1">
              {flags.map((flag, i) => (
                <Badge key={i} variant={flag.type === 'alert' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0 font-bold uppercase tracking-wider">
                  {flag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-muted-foreground/60" /> {patient.phone || 'No phone'}</div>
          <div className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-muted-foreground/60" /> {patient.email || 'No email'}</div>
          <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-muted-foreground/60" /> {calculateAge(patient.date_of_birth)} Years</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <PatientQuickActions patientId={patient.id} />
      </div>
    </div>
  );
}
