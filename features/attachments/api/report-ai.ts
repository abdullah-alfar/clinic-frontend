import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import type { ReportAIAnalysis, AnalyzeReportRequest } from '../types';

export async function analyzeReport(attachmentId: string, payload: AnalyzeReportRequest) {
  const { data } = await apiClient.post<ApiResponse<ReportAIAnalysis>>(`/attachments/${attachmentId}/analyze`, payload);
  return data.data;
}

export async function getAnalyses(attachmentId: string) {
  const { data } = await apiClient.get<ApiResponse<ReportAIAnalysis[]>>(`/attachments/${attachmentId}/analyses`);
  return data.data ?? [];
}
