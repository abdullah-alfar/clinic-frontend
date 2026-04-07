import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings, testAI, testEmail, testWhatsApp } from '../api/settings';
import { UpdateSettingsRequest } from '../types';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
  });
};

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateSettingsRequest) => updateSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useTestAI = () => {
  return useMutation({
    mutationFn: (prompt: string) => testAI(prompt),
  });
};

export const useTestEmail = () => {
  return useMutation({
    mutationFn: (to: string) => testEmail(to),
  });
};

export const useTestWhatsApp = () => {
  return useMutation({
    mutationFn: (to: string) => testWhatsApp(to),
  });
};
