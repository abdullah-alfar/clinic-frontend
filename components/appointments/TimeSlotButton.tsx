import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TimeSlotButtonProps {
  startTime: string;
  endTime: string;
  selected: boolean;
  onSelect: () => void;
}

export function TimeSlotButton({ startTime, selected, onSelect }: TimeSlotButtonProps) {
  const timeStr = format(new Date(startTime), "h:mm a");
  
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      className="w-full text-xs font-medium"
      onClick={onSelect}
    >
      {timeStr}
    </Button>
  );
}
