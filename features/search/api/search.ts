import { apiClient } from "@/lib/api/client";
import { SearchData } from "../types";

export async function searchGlobal(query: string, types?: string[]): Promise<SearchData> {
  const params = new URLSearchParams();
  params.append('q', query.trim());
  if (types && types.length > 0) {
    params.append('types', types.join(','));
  }

  const response = await apiClient.get(`/search?${params.toString()}`);
  return response.data?.data;
}
