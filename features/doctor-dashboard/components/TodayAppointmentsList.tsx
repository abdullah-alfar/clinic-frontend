import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentSummary } from '../types';
import { format } from 'date-fns';
import { User, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AppointmentsProps {
  appointments: AppointmentSummary[];
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  confirmed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  no_show: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

export const TodayAppointmentsList: React.FC<AppointmentsProps> = ({ appointments = [] }) => {
  const safeAppointments = appointments || [];
  if (safeAppointments.length === 0) {
    return (
      <Card className="h-full border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No appointments today</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Review your upcoming schedule or take a break.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-none shadow-sm pb-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Today's Schedule
        </CardTitle>
        <Badge variant="outline" className="tabular-nums">
          {safeAppointments.length} Total
        </Badge>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeAppointments.map((appt) => (
              <TableRow key={appt.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium tabular-nums">
                  {format(new Date(appt.start_time), 'HH:mm')}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-sm">{appt.patient_name}</div>
                  <div className="text-xs text-muted-foreground md:hidden">{appt.reason}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                  {appt.reason}
                </TableCell>
                <TableCell>
                  <Badge className={`text-[10px] font-bold uppercase ${statusColors[appt.status] || ''}`}>
                    {appt.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/patients/${appt.patient_id}`}>
                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
