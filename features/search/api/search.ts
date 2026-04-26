import { apiClient } from "@/lib/api/client";
import { SearchData } from "../types";

export interface SearchFilters {
  types?: string[];
  limit?: number;
  dateFrom?: string; // RFC3339
  dateTo?: string;   // RFC3339
  status?: string;
}

/**
 * searchGlobal calls GET /api/v1/search with a query and optional filters.
 * The query must be at least 2 characters — the backend enforces this with a 400.
 */
export async function searchGlobal(
  query: string,
  filters?: SearchFilters
): Promise<SearchData> {
  const params = new URLSearchParams();
  params.append("q", query.trim());

  if (filters?.types && filters.types.length > 0) {
    params.append("types", filters.types.join(","));
  }
  if (filters?.limit) {
    params.append("limit", String(filters.limit));
  }
  if (filters?.dateFrom) {
    params.append("date_from", filters.dateFrom);
  }
  if (filters?.dateTo) {
    params.append("date_to", filters.dateTo);
  }
  if (filters?.status) {
    params.append("status", filters.status);
  }

  const response = await apiClient.get(`/search?${params.toString()}`);
  return response.data?.data;
}
