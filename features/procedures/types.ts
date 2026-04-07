export interface ProcedureCatalog {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  base_price: number;
  items: ProcedureItem[];
  created_at: string;
  updated_at: string;
}

export interface ProcedureItem {
  id: string;
  procedure_catalog_id: string;
  inventory_item_id: string;
  quantity: number;
  inventory_item_name?: string; // We'll map this from the inventory item
}

export interface CreateProcedureReq {
  name: string;
  description?: string;
  duration_minutes: number;
  base_price: number;
  items: ProcedureItemReq[];
}

export interface UpdateProcedureReq {
  name?: string;
  description?: string;
  duration_minutes?: number;
  base_price?: number;
  items?: ProcedureItemReq[];
}

export interface ProcedureItemReq {
  inventory_item_id: string;
  quantity: number;
}
