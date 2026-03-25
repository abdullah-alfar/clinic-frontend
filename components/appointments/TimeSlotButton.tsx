import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TimeSlotButtonProps {
  startTime: string;
  endTime: string;
  selected: boolean;
  isAvailable?: boolean;
  onSelect: () => void;
}

export function TimeSlotButton({ startTime, selected, isAvailable = true, onSelect }: TimeSlotButtonProps) {
  const timeStr = format(new Date(startTime), "h:mm a");
  
  return (
    <Button
      type="button"
      variant={selected ? "default" : (isAvailable ? "outline" : "secondary")}
      className={`w-full text-xs font-medium ${!isAvailable ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
      onClick={isAvailable ? onSelect : undefined}
      disabled={!isAvailable}
    >
      {timeStr}
    </Button>
  );
}
