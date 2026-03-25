import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/lib/api/doctors';

export function DoctorSelect({ value, onChange }: { value?: string; onChange: (val: string) => void }) {
  const { data: doctors } = useQuery({ queryKey: ['doctors'], queryFn: () => getDoctors() });
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Any Doctor" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="any">Any available doctor</SelectItem>
        {doctors?.map(doc => (
          <SelectItem key={doc.id} value={doc.id}>Dr. {doc.full_name} ({doc.specialty})</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
