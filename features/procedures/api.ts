import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import { CreateProcedureReq, UpdateProcedureReq, ProcedureCatalog } from "./types";

export const getProcedures = async (): Promise<ProcedureCatalog[]> => {
  const { data } = await apiClient.get<ApiResponse<ProcedureCatalog[]>>('/procedures');
  return data.data ?? [];
};

export const getProcedure = async (id: string): Promise<ProcedureCatalog> => {
  const { data } = await apiClient.get<ApiResponse<ProcedureCatalog>>(`/procedures/${id}`);
  return data.data!;
};

export const createProcedure = async (procedure: CreateProcedureReq): Promise<ProcedureCatalog> => {
  const { data } = await apiClient.post<ApiResponse<ProcedureCatalog>>('/procedures', procedure);
  return data.data!;
};

export const updateProcedure = async ({ id, ...req }: UpdateProcedureReq & { id: string }): Promise<ProcedureCatalog> => {
  const { data } = await apiClient.patch<ApiResponse<ProcedureCatalog>>(`/procedures/${id}`, req);
  return data.data!;
};
