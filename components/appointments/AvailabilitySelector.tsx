import { TimeSlotButton } from "./TimeSlotButton";
import { useAvailability, useNextAvailable } from "@/hooks/useAvailability";
import { Slot } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Clock, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

interface Props {
  doctorId?: string;
  date: string;
  onSlotSelect: (slot: Slot, doctorId: string) => void;
  selectedSlotStartTime?: string;
}

export function AvailabilitySelector({ doctorId, date, onSlotSelect, selectedSlotStartTime }: Props) {
  const { data: availability, isLoading } = useAvailability({ 
    date, 
    doctor_id: doctorId === 'any' ? undefined : doctorId 
  });
  
  const { data: nextAvailable, refetch: fetchNext } = useNextAvailable(
    doctorId === 'any' ? undefined : doctorId,
    false
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 mt-2">
        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
      </div>
    );
  }

  const hasAvailability = availability && availability.length > 0 && availability.some(d => d.slots.length > 0);

  if (!hasAvailability) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center bg-muted/40 rounded-lg border mt-2">
        <Clock className="h-8 w-8 text-muted-foreground mb-3 opacity-80" />
        <h3 className="font-semibold text-base mb-1">No slots available</h3>
        <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">There are no open times on this date.</p>
        <Button variant="secondary" size="sm" onClick={() => fetchNext()}>
          Find Next Available
        </Button>
        {nextAvailable && (
          <div className="mt-5 p-3 bg-primary/10 rounded-md border border-primary/20 w-full">
            <p className="text-xs font-semibold text-primary/80 uppercase mb-2">Next available match:</p>
            <div className="text-sm font-medium mb-3">{format(new Date(nextAvailable.start_time), "MMM d, yyyy")}</div>
            <TimeSlotButton 
              startTime={nextAvailable.start_time} 
              endTime={nextAvailable.end_time} 
              selected={selectedSlotStartTime === nextAvailable.start_time}
              onSelect={() => {
                // If backend next available doesn't provide the exact doctor yet, we will just pass doctorId or fallback
                onSlotSelect(nextAvailable, doctorId === 'any' ? '' : doctorId || '');
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 mt-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
      {availability?.map((docResult) => docResult.slots.length > 0 && (
        <div key={docResult.doctor_id} className="space-y-2">
          {availability.length > 1 && (
            <h4 className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wide">
              <CalendarCheck className="h-3.5 w-3.5" /> 
              {docResult.doctor_name || "Doctor"}
            </h4>
          )}
          <div className="grid grid-cols-3 gap-2">
            {docResult.slots.map(slot => (
              <TimeSlotButton
                key={slot.start_time}
                startTime={slot.start_time}
                endTime={slot.end_time}
                isAvailable={slot.is_available}
                selected={selectedSlotStartTime === slot.start_time}
                onSelect={() => onSlotSelect(slot, docResult.doctor_id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
