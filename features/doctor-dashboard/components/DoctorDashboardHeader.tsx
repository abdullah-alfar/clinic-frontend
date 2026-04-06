import React from 'react';
import { DoctorSummary } from '../types';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  doctor: DoctorSummary;
}

export const DoctorDashboardHeader: React.FC<HeaderProps> = ({ doctor }) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting()}, Dr. {doctor.full_name}</h1>
        <p className="text-muted-foreground">
          Welcome back to your workspace. Here is what is happening today.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5 border-primary/20 text-primary">
          {doctor.specialty}
        </Badge>
        <span className="text-sm text-muted-foreground tabular-nums">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
    </div>
  );
};
