import { TimelineItemType } from '../types';
import { 
  Calendar, 
  Stethoscope, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Paperclip,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface MedicalTimelineFiltersProps {
  currentType?: TimelineItemType;
  onTypeChange: (type?: TimelineItemType) => void;
}

const typeConfig: Array<{ value?: TimelineItemType; label: string; icon: any }> = [
  { value: undefined, label: 'All Activity', icon: Filter },
  { value: 'appointment', label: 'Appointments', icon: Calendar },
  { value: 'medical_record', label: 'Medical Records', icon: Stethoscope },
  { value: 'invoice', label: 'Invoices', icon: CreditCard },
  { value: 'payment', label: 'Payments', icon: CheckCircle2 },
  { value: 'note', label: 'Notes', icon: FileText },
  { value: 'notification', label: 'Notifications', icon: MessageSquare },
  { value: 'attachment', label: 'Attachments', icon: Paperclip },
];

export function MedicalTimelineFilters({ currentType, onTypeChange }: MedicalTimelineFiltersProps) {
  const activeLabel = typeConfig.find(t => t.value === currentType)?.label || 'Filter';

  return (
    <div className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold hover:bg-muted">
            <Filter className="h-3 w-3" />
            {activeLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {typeConfig.map((config, i) => (
            <DropdownMenuItem 
              key={i} 
              onClick={() => onTypeChange(config.value)}
              className="gap-2 text-xs font-medium cursor-pointer"
            >
              <config.icon className="h-3 w-3 text-muted-foreground" />
              {config.label}
              {currentType === config.value && (
                <CheckCircle2 className="h-3 w-3 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {currentType && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onTypeChange(undefined)}
          className="text-[10px] uppercase font-bold text-primary tracking-wider hover:bg-muted p-0 h-auto"
        >
          Clear
        </Button>
      )}
    </div>
  );
}
