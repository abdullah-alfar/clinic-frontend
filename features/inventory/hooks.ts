import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  adjustStock,
  getInventoryMovements,
} from "./api";
import { CreateItemReq, UpdateItemReq, AdjustStockReq } from "./types";
import { toast } from "sonner";

export const useInventoryItems = () => {
  return useQuery({
    queryKey: ["inventory-items"],
    queryFn: getInventoryItems,
  });
};

export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ["inventory-items", id],
    queryFn: () => getInventoryItem(id),
    enabled: !!id,
  });
};

export const useInventoryMovements = (id: string) => {
  return useQuery({
    queryKey: ["inventory-movements", id],
    queryFn: () => getInventoryMovements(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: CreateItemReq) => createInventoryItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success("Inventory item created!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create inventory item");
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateItemReq & { id: string }) => updateInventoryItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items", variables.id] });
      toast.success("Inventory item updated!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update inventory item");
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; req: AdjustStockReq }) => adjustStock(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["inventory-movements", variables.id] });
      toast.success("Stock level adjusted!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to adjust stock");
    },
  });
};
