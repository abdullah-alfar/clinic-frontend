import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserX, 
  FileText, 
  Bell 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '../types';

interface StatsProps {
  stats: DashboardStats;
}

export const DoctorStatsCards: React.FC<StatsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Today's Appointments",
      value: stats.appointments_today,
      description: "Total scheduled for today",
      icon: <Calendar className="w-4 h-4 text-primary" />,
      color: "bg-primary/5",
    },
    {
      title: "Completed Today",
      value: stats.completed_today,
      description: "Patients already seen",
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      color: "bg-green-500/5",
    },
    {
      title: "Upcoming",
      value: stats.upcoming_total,
      description: "Beyond today's schedule",
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      color: "bg-blue-500/5",
    },
    {
      title: "No-Shows",
      value: stats.no_show_today,
      description: "Missed appointments today",
      icon: <UserX className="w-4 h-4 text-destructive" />,
      color: "bg-destructive/5",
    },
    {
      title: "Pending Notes",
      value: stats.pending_notes,
      description: "Need documentation",
      icon: <FileText className="w-4 h-4 text-orange-500" />,
      color: "bg-orange-500/5",
    },
    {
      title: "Notifications",
      value: stats.unread_notifications,
      description: "Unread messages/alerts",
      icon: <Bell className="w-4 h-4 text-purple-500" />,
      color: "bg-purple-500/5",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => (
        <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.color} group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {card.value}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
