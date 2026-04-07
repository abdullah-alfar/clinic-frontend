import { apiClient } from '@/lib/api/client';
import { AIRequest, AIResponse } from './types';

export const aiSearch = async (query: string): Promise<any> => {
  const res = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data?.data;
};

export const chatWithAI = async (input: string, sessionId?: string, patientId?: string, source: string = 'web_chat'): Promise<AIResponse> => {
  const payload: AIRequest = {
    input,
    session_id: sessionId,
    patient_id: patientId,
    source,
    context: {
      currentUrl: typeof window !== 'undefined' ? window.location.pathname : '',
    }
  };
  const res = await apiClient.post('/ai/chat', payload);
  return res.data?.data; // { session_id, message, action, data }
};
