import React from 'react';
import { FollowUp } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import { FollowUpStatusBadge } from './FollowUpStatusBadge';
import { useUpdateFollowUpStatus } from '../hooks/useFollowUps';
import { format } from 'date-fns';

interface FollowUpCardProps {
  followup: FollowUp;
}

export function FollowUpCard({ followup }: FollowUpCardProps) {
  const updateStatus = useUpdateFollowUpStatus();

  const isOverdue = new Date(followup.due_date) < new Date() && followup.status === 'pending';
  const isPending = followup.status === 'pending';

  return (
    <Card className={`overflow-hidden border-l-4 ${isOverdue ? 'border-l-red-500 bg-red-50/30' : followup.priority === 'high' ? 'border-l-orange-500' : 'border-l-primary/20'}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <FollowUpStatusBadge status={followup.status} />
              {followup.priority === 'high' && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded leading-none">
                  High Priority
                </span>
              )}
              {followup.auto_generated && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded leading-none">
                  Auto
                </span>
              )}
            </div>
            
            <h4 className="font-semibold text-sm leading-snug">{followup.reason}</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Due: {format(new Date(followup.due_date), 'PPP')}</span>
              </div>
              {followup.patient_name && (
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5" />
                  <span>Patient: {followup.patient_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Provider: {followup.doctor_name || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          {isPending && (
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs gap-1.5 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                onClick={() => updateStatus.mutate({ id: followup.id, req: { status: 'completed' } })}
                disabled={updateStatus.isPending}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Done
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => updateStatus.mutate({ id: followup.id, req: { status: 'canceled' } })}
                disabled={updateStatus.isPending}
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
