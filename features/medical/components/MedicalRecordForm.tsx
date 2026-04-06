import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { CreateMedicalRecordRequest, CreateMedicalVitalRequest, CreateMedicalMedicationRequest } from '../types';

export function MedicalRecordForm({ 
  onSubmit, 
  loading 
}: { 
  onSubmit: (data: CreateMedicalRecordRequest) => void;
  loading?: boolean;
}) {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  const [vitals, setVitals] = useState<CreateMedicalVitalRequest[]>([]);
  const [meds, setMeds] = useState<CreateMedicalMedicationRequest[]>([]);

  const handleAddVital = () => {
    setVitals([...vitals, { type: '', value: '', unit: '' }]);
  };

  const handleAddMed = () => {
    setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis) return;
    onSubmit({
      diagnosis,
      notes,
      vitals: vitals.filter(v => v.type && v.value),
      medications: meds.filter(m => m.name && m.dosage && m.frequency)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Diagnosis <span className="text-destructive">*</span></Label>
          <Input 
            required 
            value={diagnosis} 
            onChange={(e) => setDiagnosis(e.target.value)} 
            placeholder="e.g. Hypertension" 
            className="mt-1"
          />
        </div>
        <div>
          <Label>Clinical Notes</Label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Observations, patient complaints, etc." 
            className="mt-1 min-h-[100px]"
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Vitals (Optional)</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddVital} className="gap-2">
            <Plus className="h-3 w-3" /> Add Vital
          </Button>
        </div>
        {vitals.map((v, i) => (
          <div key={i} className="flex items-end gap-3 bg-muted/20 p-3 rounded-lg border">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Type</Label>
              <Input placeholder="e.g. BP" value={v.type} onChange={(e) => { const n = [...vitals]; n[i].type = e.target.value; setVitals(n); }} />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Value</Label>
              <Input placeholder="120/80" value={v.value} onChange={(e) => { const n = [...vitals]; n[i].value = e.target.value; setVitals(n); }} />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Unit</Label>
              <Input placeholder="mmHg" value={v.unit || ''} onChange={(e) => { const n = [...vitals]; n[i].unit = e.target.value; setVitals(n); }} />
            </div>
            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => setVitals(vitals.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Medications (Optional)</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddMed} className="gap-2">
            <Plus className="h-3 w-3" /> Add Medication
          </Button>
        </div>
        {meds.map((m, i) => (
          <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
            <div className="col-span-2 sm:col-span-2 space-y-1">
              <Label className="text-xs">Name</Label>
              <Input placeholder="Med name" value={m.name} onChange={(e) => { const n = [...meds]; n[i].name = e.target.value; setMeds(n); }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Dosage</Label>
              <Input placeholder="50mg" value={m.dosage} onChange={(e) => { const n = [...meds]; n[i].dosage = e.target.value; setMeds(n); }} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Freq</Label>
              <Input placeholder="1x daily" value={m.frequency} onChange={(e) => { const n = [...meds]; n[i].frequency = e.target.value; setMeds(n); }} />
            </div>
             <div className="space-y-1">
              <Label className="text-xs">Duration</Label>
              <Input placeholder="7 days" value={m.duration || ''} onChange={(e) => { const n = [...meds]; n[i].duration = e.target.value; setMeds(n); }} />
            </div>
            <div className="col-span-2 sm:col-span-4 space-y-1">
              <Label className="text-xs">Notes (Optional)</Label>
              <Input placeholder="After meals" value={m.notes || ''} onChange={(e) => { const n = [...meds]; n[i].notes = e.target.value; setMeds(n); }} />
            </div>
            <div className="flex items-end justify-end">
               <Button type="button" variant="ghost" size="sm" className="text-destructive w-full" onClick={() => setMeds(meds.filter((_, idx) => idx !== i))}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
               </Button>
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={loading || !diagnosis}>
        {loading ? 'Saving...' : 'Save Medical Record'}
      </Button>
    </form>
  );
}
