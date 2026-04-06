import { Badge } from '@/components/ui/badge';
import { TimelineItemType } from '../types';
import { 
  Calendar, 
  Stethoscope, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Paperclip,
  CheckCircle2
} from 'lucide-react';

interface TimelineTypeBadgeProps {
  type: TimelineItemType;
}

const typeConfig: Record<TimelineItemType, { label: string; icon: any; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  appointment: { label: 'Appointment', icon: Calendar, variant: 'secondary' },
  medical_record: { label: 'Medical', icon: Stethoscope, variant: 'default' },
  invoice: { label: 'Invoice', icon: CreditCard, variant: 'outline' },
  payment: { label: 'Payment', icon: CheckCircle2, variant: 'outline' },
  note: { label: 'Note', icon: FileText, variant: 'secondary' },
  notification: { label: 'Notice', icon: MessageSquare, variant: 'outline' },
  attachment: { label: 'File', icon: Paperclip, variant: 'secondary' },
};

export function TimelineTypeBadge({ type }: TimelineTypeBadgeProps) {
  const config = typeConfig[type] || { label: type, icon: FileText, variant: 'outline' };
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1 px-1.5 py-0 font-medium text-[10px] uppercase tracking-wider">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
