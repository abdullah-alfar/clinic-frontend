'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CalendarPlus, 
  Plus,
  MoreVertical,
  FileText,
  CreditCard,
  Paperclip
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookingModal } from '@/components/appointments/BookingModal';
import { AddNoteModal } from '@/components/patients/AddNoteModal';

interface PatientQuickActionsProps {
  patientId: string;
}

export function PatientQuickActions({ patientId }: PatientQuickActionsProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button onClick={() => setBookingOpen(true)} size="sm">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
        <Button variant="outline" size="sm" onClick={() => setNoteOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Create Invoice</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Paperclip className="h-4 w-4" />
              <span>Upload Report</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Edit Details</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <BookingModal patientId={patientId} open={bookingOpen} onOpenChange={setBookingOpen} />
      <AddNoteModal patientId={patientId} open={noteOpen} onOpenChange={setNoteOpen} />
    </>
  );
}
