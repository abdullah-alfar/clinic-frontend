'use client';

import { useWhatsAppBotStatus } from '../hooks/useWhatsApp';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, AlertCircle, MessageCircle, Clock, Smartphone } from 'lucide-react';
import { formatClinicDateTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface WhatsAppReadinessCardProps {
  patientId: string;
}

export function WhatsAppReadinessCard({ patientId }: WhatsAppReadinessCardProps) {
  const { data: status, isLoading } = useWhatsAppBotStatus(patientId);

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-2xl" />;
  }

  if (!status) return null;

  const isE164 = status.phone_number?.startsWith('+') && status.phone_number?.length > 10;
  const isReady = status.is_ready && isE164 && status.opt_in_status;

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl border",
            isReady ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          )}>
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">WhatsApp Service</h3>
            <p className="text-[11px] text-muted-foreground">Self-service & Notifications</p>
          </div>
        </div>
        <Badge variant={isReady ? "default" : "outline"} className={cn(
          isReady ? "bg-emerald-500 text-white hover:bg-emerald-600" : "text-amber-600 border-amber-200 bg-amber-50"
        )}>
          {isReady ? "Active" : "Issues Detected"}
        </Badge>
      </div>

      <div className="space-y-3 pt-2">
        <StatusItem 
          label="Phone Number" 
          status={status.phone_number ? (isE164 ? 'success' : 'warn') : 'error'} 
          text={status.phone_number || 'Missing phone'} 
          subtext={!isE164 && status.phone_number ? "Requires country code (e.g. +1...)" : undefined}
          icon={Smartphone}
        />
        <StatusItem 
          label="Bot Opt-In" 
          status={status.opt_in_status ? 'success' : 'warn'} 
          text={status.opt_in_status ? 'Subscribed' : 'Not Subscribed'} 
          subtext={!status.opt_in_status ? "Patient hasn't enabled WhatsApp notifications" : undefined}
          icon={CheckCircle2}
        />
        {status.last_interaction && (
          <StatusItem 
            label="Last Bot Activity" 
            status="info" 
            text={formatClinicDateTime(status.last_interaction)} 
            icon={Clock}
          />
        )}
      </div>
    </div>
  );
}

function StatusItem({ label, status, text, subtext, icon: Icon }: { 
  label: string; 
  status: 'success' | 'warn' | 'error' | 'info'; 
  text: string; 
  subtext?: string;
  icon: any;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">
        {status === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
        {status === 'warn' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
        {status === 'error' && <XCircle className="h-3.5 w-3.5 text-destructive" />}
        {status === 'info' && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{label}</p>
        <p className="text-xs font-medium">{text}</p>
        {subtext && <p className="text-[10px] text-amber-600/80 leading-tight">{subtext}</p>}
      </div>
    </div>
  );
}
