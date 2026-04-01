import { apiClient } from "@/lib/api/client";
import { SearchData } from "../types";

export async function searchGlobal(query: string): Promise<SearchData> {
  const q = encodeURIComponent(query.trim());
  const response = await apiClient.get(`/search?q=${q}`);
  return response.data.data;
}
