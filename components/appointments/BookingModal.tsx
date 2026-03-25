import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DoctorSelect } from "./DoctorSelect";
import { AvailabilitySelector } from "./AvailabilitySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slot } from "@/types";
import { useCreateAppointment } from "@/hooks/useCreateAppointment";
import { format } from "date-fns";

interface Props {
  patientId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function BookingModal({ patientId, open, onOpenChange }: Props) {
  const [doctorId, setDoctorId] = useState<string>("any");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedSlot, setSelectedSlot] = useState<{ slot: Slot; doctor_id: string } | null>(null);
  const [reason, setReason] = useState("");
  
  const { mutateAsync: createAppointment, isPending } = useCreateAppointment();

  const handleBook = async () => {
    if (!selectedSlot) return;
    try {
      await createAppointment({
        patient_id: patientId,
        doctor_id: selectedSlot.doctor_id,
        start_time: selectedSlot.slot.start_time,
        end_time: selectedSlot.slot.end_time,
        reason,
      });
      onOpenChange(false);
      setSelectedSlot(null);
      setReason("");
    } catch (e: any) {
      alert("Booking failed: " + (e.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>Find available times and schedule a new visit instantly.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Doctor Filter</Label>
              <DoctorSelect value={doctorId} onChange={(v) => { setDoctorId(v); setSelectedSlot(null); }} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input 
                type="date" 
                value={date} 
                className="h-9"
                min={format(new Date(), "yyyy-MM-dd")} 
                onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} 
              />
            </div>
          </div>

          <div className="space-y-1.5 bg-muted/30 p-1 rounded-lg">
            <Label className="px-1 text-xs font-semibold text-muted-foreground uppercase">Available Slots</Label>
            <AvailabilitySelector 
              date={date} 
              doctorId={doctorId} 
              selectedSlotStartTime={selectedSlot?.slot.start_time}
              onSlotSelect={(slot, docId) => setSelectedSlot({ slot, doctor_id: docId })} 
            />
          </div>

          <div className="space-y-2 pt-1 border-t">
            <Label className="text-xs">Reason for Visit (Optional)</Label>
            <Input 
              placeholder="e.g. Follow-up consultation" 
              className="text-sm"
              value={reason} 
              onChange={e => setReason(e.target.value)} 
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!selectedSlot || isPending} onClick={handleBook}>
            {isPending ? "Booking..." : "Confirm Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
