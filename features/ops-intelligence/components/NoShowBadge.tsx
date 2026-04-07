import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useNoShowRisk } from '../api';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoShowBadgeProps {
  appointmentId: string;
  patientId: string;
}

export const NoShowBadge: React.FC<NoShowBadgeProps> = ({ appointmentId, patientId }) => {
  const { data, isLoading } = useNoShowRisk(appointmentId, patientId);

  if (isLoading || !data) {
    return (
      <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
    );
  }

  const riskConfigs = {
    high: {
      variant: 'destructive' as const,
      label: 'High Risk',
      icon: ShieldAlert,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      shadow: 'shadow-destructive/10'
    },
    medium: {
      variant: 'secondary' as const,
      label: 'Medium Risk',
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      shadow: 'shadow-amber-500/10'
    },
    low: {
      variant: 'outline' as const,
      label: 'Low Risk',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      shadow: 'shadow-emerald-500/10'
    }
  };

  const config = riskConfigs[data.risk_level] || riskConfigs.low;
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all duration-300 shadow-sm",
      config.bg,
      config.border,
      config.shadow
    )} title={data.factors.join(', ')}>
      <div className={cn("p-1.5 rounded-lg bg-background shadow-sm")}>
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="flex flex-col">
        <span className={cn("text-[10px] font-bold uppercase tracking-widest opacity-60")}>No-Show Risk</span>
        <span className={cn("text-xs font-extrabold tracking-tight", config.color)}>
          {config.label}
        </span>
      </div>
    </div>
  );
};
