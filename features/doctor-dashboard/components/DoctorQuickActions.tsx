import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  FilePlus, 
  UserPlus, 
  BellRing, 
  Settings, 
  PlusCircle, 
  Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const DoctorQuickActions: React.FC = () => {
  const actions = [
    { label: 'Today’s Schedule', icon: <Calendar className="w-4 h-4" />, href: '/appointments', color: 'bg-blue-500' },
    { label: 'New Appointment', icon: <PlusCircle className="w-4 h-4" />, href: '/appointments?new=true', color: 'bg-green-500' },
    { label: 'My Patients', icon: <Search className="w-4 h-4" />, href: '/patients', color: 'bg-indigo-500' },
    { label: 'Add Medical Note', icon: <FilePlus className="w-4 h-4" />, href: '/visit-notes/new', color: 'bg-orange-500' },
    { label: 'Notifications', icon: <BellRing className="w-4 h-4" />, href: '/notifications', color: 'bg-purple-500' },
    { label: 'Preferences', icon: <Settings className="w-4 h-4" />, href: '/settings', color: 'bg-slate-500' },
  ];

  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((action, i) => (
          <Link key={i} href={action.href} className="w-full">
            <Button 
              variant="outline" 
              className="w-full h-auto py-4 flex flex-col gap-2 border-dashed hover:border-solid hover:bg-primary/5 hover:border-primary/30 transition-all group"
            >
              <div className={`p-2 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
