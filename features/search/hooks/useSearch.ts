import { useQuery } from "@tanstack/react-query";
import { searchGlobal, SearchFilters } from "../api/search";

/** Minimum query length that triggers a backend call (mirrors backend MinQueryLength = 2). */
const MIN_QUERY_LENGTH = 2;

/**
 * useGlobalSearch is the primary data hook for the global search feature.
 *
 * - Does NOT call the backend when query length < MIN_QUERY_LENGTH.
 * - Uses stale-while-revalidate caching (60 s staleTime).
 * - Surfaces partial provider failures via data.warnings.
 * - Returns previous data while a new query is loading (placeholderData).
 */
export function useGlobalSearch(query: string, filters?: SearchFilters) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["globalSearch", trimmed, filters],
    queryFn: () => searchGlobal(trimmed, filters),
    enabled: trimmed.length >= MIN_QUERY_LENGTH,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
