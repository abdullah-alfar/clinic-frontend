import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MedicalRecordResponse } from '../types';
import { Stethoscope, Pill, Activity, CalendarIcon } from 'lucide-react';
import { formatClinicDate } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';

export function MedicalRecordCard({ record }: { record: MedicalRecordResponse }) {
  const { tenant } = useTheme();

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl text-primary font-bold flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {record.record.diagnosis || 'No Diagnosis'}
            </CardTitle>
            <div className="flex items-center text-xs text-muted-foreground gap-4">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatClinicDate(record.record.created_at, tenant?.timezone)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6">
        {record.record.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Notes</h4>
            <div className="text-sm rounded-lg bg-muted/40 p-3 leading-relaxed border border-border/40 whitespace-pre-wrap">
              {record.record.notes}
            </div>
          </div>
        )}

        {record.vitals && record.vitals.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
              <Activity className="h-4 w-4" /> Vitals
            </h4>
            <div className="flex flex-wrap gap-2">
              {record.vitals.map((vital) => (
                <Badge key={vital.id} variant="outline" className="bg-background/80 py-1.5 px-3">
                  <span className="font-semibold text-muted-foreground mr-1.5 capitalize">{vital.type}:</span>
                  <span className="font-bold">
                    {vital.value} {vital.unit}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {record.medications && record.medications.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2 text-indigo-500">
              <Pill className="h-4 w-4" /> Medications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {record.medications.map((med) => (
                <div key={med.id} className="p-3 rounded-lg border border-border/60 bg-background text-sm flex flex-col gap-1">
                  <span className="font-bold text-foreground">{med.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {med.dosage} • {med.frequency}
                    {med.duration && ` • ${med.duration}`}
                  </span>
                  {med.notes && <span className="text-xs italic mt-1 opacity-80">{med.notes}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
