import { useQuery } from "@tanstack/react-query";
import { searchGlobal } from "../api/search";

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ["globalSearch", query],
    queryFn: () => searchGlobal(query),
    enabled: query.trim().length > 0, // only run if query is not empty
    staleTime: 60 * 1000, // cache for 1 minute
  });
}
