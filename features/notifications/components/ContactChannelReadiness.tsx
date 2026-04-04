import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Patient } from '@/types';

interface ContactChannelReadinessProps {
  patient: Patient;
}

export function ContactChannelReadiness({ patient }: ContactChannelReadinessProps) {
  const hasEmail = Boolean(patient.email && patient.email.trim() !== '');
  const hasPhone = Boolean(patient.phone && patient.phone.trim() !== '');

  // Add E.164 naive check
  const isE164 = hasPhone && patient.phone!.startsWith('+') && patient.phone!.length > 10;

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">Email Readiness</h3>
          <div className="flex items-center space-x-2 text-sm">
            {hasEmail ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">{patient.email}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground text-yellow-700">Missing email address</span>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-2">WhatsApp Readiness</h3>
          <div className="flex items-center space-x-2 text-sm">
            {isE164 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">{patient.phone}</span>
              </>
            ) : hasPhone ? (
              <>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground text-yellow-700">
                  Phone requires country code (e.g. +1... ) for WhatsApp
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground text-yellow-700">Missing phone number</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
