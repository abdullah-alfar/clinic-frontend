import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatientInvoices, markInvoicePaid, createInvoice } from '@/lib/api/invoices';

export function usePatientInvoices(patientId: string) {
  return useQuery({
    queryKey: ['invoices', patientId],
    queryFn: () => getPatientInvoices(patientId),
    enabled: !!patientId,
  });
}

export function useMarkInvoicePaid(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markInvoicePaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', patientId] });
    },
  });
}

export function useCreateInvoice(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { patient_id: string; appointment_id?: string; amount: number }) => 
      createInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', patientId] });
    },
  });
}
