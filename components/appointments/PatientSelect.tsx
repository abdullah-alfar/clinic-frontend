import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '@/lib/api/patients';
import { Skeleton } from "@/components/ui/skeleton";

export function PatientSelect({ value, onChange, error }: { value?: string; onChange: (val: string) => void; error?: boolean }) {
  const { data: patients, isLoading } = useQuery({ queryKey: ['patients'], queryFn: () => getPatients() });
  
  if (isLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={error ? "border-destructive" : ""}>
        <SelectValue placeholder="Search or select patient" />
      </SelectTrigger>
      <SelectContent>
        {patients?.map(p => (
          <SelectItem key={p.id} value={p.id}>{p.first_name} {p.last_name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
