export interface InventoryItem {
  id: string;
  tenant_id: string;
  name: string;
  category: string;
  sku: string;
  stock_level: number;
  min_stock_level: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryItemMovement {
  id: string;
  inventory_item_id: string;
  adjusted_by?: string;
  change_amount: number;
  reason: string;
  created_at: string;
}

export interface CreateItemReq {
  name: string;
  category: string;
  sku: string;
  stock_level: number;
  min_stock_level: number;
  unit_price: number;
}

export interface UpdateItemReq {
  name?: string;
  category?: string;
  sku?: string;
  stock_level?: number;
  min_stock_level?: number;
  unit_price?: number;
}

export interface AdjustStockReq {
  change_amount: number;
  reason: string;
}
