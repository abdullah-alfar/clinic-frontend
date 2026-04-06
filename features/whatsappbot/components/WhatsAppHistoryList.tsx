'use client';

import { usePatientWhatsAppHistory } from '../hooks/useWhatsApp';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import { formatClinicDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface WhatsAppHistoryListProps {
  patientId: string;
}

export function WhatsAppHistoryList({ patientId }: WhatsAppHistoryListProps) {
  const { data: messages, isLoading, error } = usePatientWhatsAppHistory(patientId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-destructive/5 text-destructive border-destructive/20 text-sm">
        Failed to load WhatsApp history. Please try again.
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border/40 rounded-2xl bg-muted/10">
        <MessageSquare className="h-10 w-10 text-muted-foreground opacity-30 mb-3" />
        <p className="text-sm text-muted-foreground">No WhatsApp interactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div 
          key={msg.id} 
          className={cn(
            "p-4 rounded-2xl border transition-all flex flex-col gap-2",
            msg.direction === 'inbound' 
              ? "bg-card border-border/60 ml-0 mr-8" 
              : "bg-primary/5 border-primary/20 ml-8 mr-0"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                msg.direction === 'inbound' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
              )}>
                {msg.direction === 'inbound' ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                {msg.direction === 'inbound' ? 'Patient' : 'Bot'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatClinicDateTime(msg.created_at)}
            </div>
          </div>
          
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {msg.content}
          </div>
          
          {msg.provider_message_id && (
            <div className="mt-1 text-[9px] text-muted-foreground/40 font-mono text-right">
               Ref: {msg.provider_message_id}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
