import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentPatient } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Users, User, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

interface PatientsProps {
  patients: RecentPatient[];
}

export const RecentPatientsList: React.FC<PatientsProps> = ({ patients = [] }) => {
  const safePatients = patients || [];
  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Recent Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        {safePatients.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent patients found.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {safePatients.map((patient) => (
              <Link 
                key={patient.id} 
                href={`/patients/${patient.id}`}
                className="group flex flex-col items-center p-4 rounded-xl border border-transparent bg-muted/20 hover:bg-white dark:hover:bg-slate-900 hover:border-primary/10 hover:shadow-md transition-all text-center"
              >
                <Avatar className="w-12 h-12 mb-3 border-2 border-transparent group-hover:border-primary/20 transition-all">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {patient.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-sm font-semibold truncate w-full group-hover:text-primary transition-colors">
                  {patient.full_name}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                  Last: {formatDistanceToNow(new Date(patient.last_visit), { addSuffix: true })}
                </p>
                <ArrowRight className="w-4 h-4 mt-3 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
