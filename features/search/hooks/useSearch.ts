import { useQuery } from "@tanstack/react-query";
import { searchGlobal } from "../api/search";

export function useGlobalSearch(query: string, types?: string[]) {
  return useQuery({
    queryKey: ["globalSearch", query, types],
    queryFn: () => searchGlobal(query, types),
    enabled: query.trim().length > 0,
    staleTime: 60 * 1000,
  });
}
