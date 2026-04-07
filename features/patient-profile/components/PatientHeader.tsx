'use client';

import React from 'react';
import { PatientDTO, PatientFlag } from '../types';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, MoreVertical, CalendarPlus, Plus, CreditCard, Printer, FileDown, Paperclip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PatientHeaderProps {
  patient: PatientDTO;
  flags: PatientFlag[];
}

/**
 * PatientHeader Component
 * Implements a standardized enterprise header with a clean layout and segmented actions.
 * Follows the Compound Component pattern for the action group.
 */
export function PatientHeader({ patient, flags }: PatientHeaderProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const calculateAge = (dob: string | null) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-background border-b px-6 py-8 md:px-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        {/* Left Side: Identity & Meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-紧 text-foreground">
              {patient.first_name} {patient.last_name}
            </h1>
            {flags.map((flag, i) => (
              <Badge 
                key={i} 
                variant={flag.type === 'alert' ? 'destructive' : 'secondary'}
                className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider rounded-full"
              >
                {flag.label}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 opacity-60" />
              {patient.phone || 'No phone'}
            </div>
            <div className="h-3 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 opacity-60" />
              {patient.email || 'No email'}
            </div>
            <div className="h-3 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 opacity-60" />
              {calculateAge(patient.date_of_birth)} Years
            </div>
          </div>
        </div>

        {/* Right Side: Segmented Actions */}
        <div className="flex items-center gap-2">
          {/* Primary Action Group */}
          <div className="flex items-center gap-2">
            <Button onClick={() => setBookingOpen(true)} size="sm" className="hidden sm:flex font-semibold shadow-sm">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            <Button variant="outline" onClick={() => setNoteOpen(true)} size="sm" className="font-semibold border-border/60">
              <Plus className="mr-2 h-4 w-4" />
              New Clinical Note
            </Button>
            <Button variant="outline" size="sm" className="hidden lg:flex font-semibold border-border/60">
              <CreditCard className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>

          {/* Secondary Actions Overflow */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/50 transition-all">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-xl border-border/60 shadow-xl">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">Patient Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="mx-1 my-1 opacity-50" />
              
              <DropdownMenuItem className="rounded-lg gap-3 focus:bg-muted py-2">
                <Printer className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Print Patient Summary</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-3 focus:bg-muted py-2">
                <FileDown className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Export Medical History (PDF)</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-3 focus:bg-muted py-2">
                <Paperclip className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Upload Attachment</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="mx-1 my-1 opacity-50" />
              <DropdownMenuItem className="rounded-lg gap-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-medium">Archive Patient</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modals */}
      <BookingModal patientId={patient.id} open={bookingOpen} onOpenChange={setBookingOpen} />
      <AddNoteModal patientId={patient.id} open={noteOpen} onOpenChange={setNoteOpen} />
    </div>
  );
}
