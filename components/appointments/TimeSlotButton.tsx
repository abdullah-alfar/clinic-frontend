import React, { memo, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { Slot } from "@/types";

interface TimeSlotButtonProps {
  selected: boolean;
  status?: 'available' | 'booked' | 'unavailable';
  timezone?: string;
  slot: Slot;
  doctorId: string;
  onSelect: (slot: Slot, doctorId: string) => void;
}

export const TimeSlotButton = memo(({ slot, doctorId, selected, status = 'available', timezone, onSelect }: TimeSlotButtonProps) => {

  const date = new Date(slot.start_time);

  const timeStr = timezone
    ? formatInTimeZone(date, timezone, "h:mm a")
    : format(date, "h:mm a");
  const isAvailable = status === 'available';
  console.log("Rendering slot:", slot.start_time, "status=", status);

  const handleClick = useCallback(() => {
    if (isAvailable) onSelect(slot, doctorId);
  }, [isAvailable, onSelect, slot, doctorId]);




  return (
    <Button
      type="button"
      variant={selected ? "default" : (isAvailable ? "outline" : "secondary")}
      className={`w-full text-xs font-medium ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through bg-muted/50' : ''}`}
      onClick={handleClick}
      disabled={!isAvailable}
    >
      {timeStr}
    </Button>
  );
});

TimeSlotButton.displayName = "TimeSlotButton";
