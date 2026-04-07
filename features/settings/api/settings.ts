import { apiClient } from '@/lib/api/client';
import { TenantSettings, UpdateSettingsRequest, TestAIResponse } from '../types';

export const getSettings = async (): Promise<TenantSettings> => {
  const res = await apiClient.get('/settings');
  return res.data.data;
};

export const updateSettings = async (data: UpdateSettingsRequest): Promise<void> => {
  await apiClient.put('/settings', data);
};

export const testAI = async (prompt: string): Promise<TestAIResponse> => {
  const res = await apiClient.post('/settings/test-ai', { prompt });
  return res.data.data;
};

export const testEmail = async (to: string): Promise<void> => {
  await apiClient.post('/settings/test-email', { to });
};

export const testWhatsApp = async (to: string): Promise<void> => {
  await apiClient.post('/settings/test-whatsapp', { to });
};
