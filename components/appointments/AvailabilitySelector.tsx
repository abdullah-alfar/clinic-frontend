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
  const { data: availability, isLoading, timezone } = useAvailability({ 
    date, 
    doctor_id: doctorId === 'any' ? undefined : doctorId 
  });
  
  const { data: nextAvailable, refetch: fetchNext } = useNextAvailable(
    doctorId === 'any' ? undefined : doctorId,
    false
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 mt-4">
        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
      </div>
    );
  }

  const hasAvailability = availability && availability.length > 0 && availability.some(d => d.slots.length > 0);

  // Find the first available slot across all doctors to recommend it
  let recommendedSlotTime: string | undefined;
  if (hasAvailability) {
    for (const doc of availability!) {
      const firstAvailable = doc.slots.find(s => s.status === 'available');
      if (firstAvailable) {
        recommendedSlotTime = firstAvailable.start_time;
        break;
      }
    }
  }

  if (!hasAvailability) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-border/40 mt-4 transition-all">
        <div className="p-4 rounded-full bg-background shadow-sm mb-4">
          <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="font-bold text-lg mb-2">No slots available today</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-[240px]">We couldn't find any open times for the selected date.</p>
        
        {!nextAvailable ? (
          <Button variant="outline" className="rounded-xl px-6" onClick={() => fetchNext()}>
            Find Fastest Available
          </Button>
        ) : (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-px bg-border/40 w-full" />
            <div className="space-y-3">
              <p className="text-xs font-bold text-primary uppercase tracking-widest text-center">Fastest Available Match</p>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/20 shadow-sm">
                <div className="text-left">
                  <p className="text-sm font-bold">{format(new Date(nextAvailable.start_time), "EEEE, MMM d")}</p>
                  <p className="text-xs text-muted-foreground">Next possible opening</p>
                </div>
                <div className="w-32">
                  <TimeSlotButton 
                    slot={nextAvailable}
                    doctorId={doctorId === 'any' ? '' : doctorId || ''}
                    timezone={timezone}
                    selected={selectedSlotStartTime === nextAvailable.start_time}
                    onSelect={onSlotSelect}
                    isRecommended
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
      {availability?.map((docResult) => docResult.slots.length > 0 && (
        <div key={docResult.doctor_id} className="space-y-3">
          {availability.length > 1 && (
            <div className="flex items-center gap-2 pb-1">
               <div className="h-px flex-1 bg-border/40" />
               <h4 className="text-[10px] font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-widest px-2">
                 <CalendarCheck className="h-3 w-3 text-primary" /> 
                 {docResult.doctor_name || "Doctor"}
               </h4>
               <div className="h-px flex-1 bg-border/40" />
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {docResult.slots.map(slot => (
              <TimeSlotButton
                key={slot.start_time}
                slot={slot}
                doctorId={docResult.doctor_id}
                status={slot.status as any}
                timezone={timezone}
                selected={selectedSlotStartTime === slot.start_time}
                onSelect={onSlotSelect}
                isRecommended={slot.start_time === recommendedSlotTime}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="text-[10px] text-muted-foreground pt-4 text-center border-t border-dashed mt-6 italic opacity-60">
        Showing availability in {timezone || 'clinic local time'}
      </div>
    </div>
  );
}
