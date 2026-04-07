import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import { CreateItemReq, UpdateItemReq, AdjustStockReq, InventoryItem, InventoryItemMovement } from "./types";

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data } = await apiClient.get<ApiResponse<InventoryItem[]>>('/inventory/items');
  return data.data ?? [];
};

export const getInventoryItem = async (id: string): Promise<InventoryItem> => {
  const { data } = await apiClient.get<ApiResponse<InventoryItem>>(`/inventory/items/${id}`);
  return data.data!;
};

export const createInventoryItem = async (item: CreateItemReq): Promise<InventoryItem> => {
  const { data } = await apiClient.post<ApiResponse<InventoryItem>>('/inventory/items', item);
  return data.data!;
};

export const updateInventoryItem = async ({ id, ...req }: UpdateItemReq & { id: string }): Promise<InventoryItem> => {
  const { data } = await apiClient.patch<ApiResponse<InventoryItem>>(`/inventory/items/${id}`, req);
  return data.data!;
};

export const adjustStock = async ({ id, req }: { id: string; req: AdjustStockReq }): Promise<void> => {
  await apiClient.post(`/inventory/items/${id}/adjust`, req);
};

export const getInventoryMovements = async (id: string): Promise<InventoryItemMovement[]> => {
  const { data } = await apiClient.get<ApiResponse<InventoryItemMovement[]>>(`/inventory/items/${id}/movements`);
  return data.data ?? [];
};
