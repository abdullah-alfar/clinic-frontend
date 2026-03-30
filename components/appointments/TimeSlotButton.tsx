import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { format, isPast } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Slot } from "@/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface TimeSlotButtonProps {
  selected: boolean;
  status?: 'available' | 'booked' | 'unavailable' | 'past';
  timezone?: string;
  slot: Slot;
  doctorId: string;
  onSelect: (slot: Slot, doctorId: string) => void;
  isRecommended?: boolean;
}

export const TimeSlotButton = memo(({ slot, doctorId, selected, status = 'available', timezone, onSelect, isRecommended }: TimeSlotButtonProps) => {
  const date = new Date(slot.start_time);
  const isSlotPast = isPast(date) && status !== 'booked';
  const effectiveStatus = isSlotPast ? 'past' : status;

  const timeStr = timezone
    ? formatInTimeZone(date, timezone, "h:mm a")
    : format(date, "h:mm a");
    
  const isAvailable = effectiveStatus === 'available';

  const handleClick = useCallback(() => {
    if (isAvailable) onSelect(slot, doctorId);
  }, [isAvailable, onSelect, slot, doctorId]);

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "relative w-full h-10 text-xs font-semibold transition-all duration-200 rounded-xl border-border/60",
        isAvailable && "hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95",
        selected && "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary/20",
        effectiveStatus === 'booked' && "opacity-60 bg-destructive/5 text-destructive border-destructive/20 cursor-not-allowed",
        effectiveStatus === 'past' && "opacity-40 bg-muted/30 text-muted-foreground border-transparent cursor-not-allowed grayscale",
        isRecommended && isAvailable && !selected && "border-primary/40 bg-primary/5 text-primary ring-1 ring-primary/20"
      )}
      onClick={handleClick}
      disabled={!isAvailable}
    >
      <div className="flex items-center justify-center gap-1.5">
        {timeStr}
        {isRecommended && isAvailable && !selected && (
          <Sparkles className="h-3 w-3 animate-pulse text-primary" />
        )}
      </div>
      
      {effectiveStatus === 'booked' && (
        <span className="absolute -top-1.5 -right-1 bg-destructive text-[8px] px-1 rounded-full text-white font-bold uppercase tracking-tighter">
          Booked
        </span>
      )}
    </Button>
  );
});

TimeSlotButton.displayName = "TimeSlotButton";
