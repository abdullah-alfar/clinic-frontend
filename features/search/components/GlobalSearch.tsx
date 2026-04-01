import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGlobalSearch } from "../hooks/useSearch";
import { PatientSearchResult } from "../types";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useGlobalSearch(debouncedQuery);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // cmd+k or ctrl+k
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      
      // escape to close
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePatientSelect = (patient: PatientSearchResult) => {
    setOpen(false);
    setQuery("");
    router.push(`/patients/${patient.id}`);
  };

  const showResults = open && query.length > 0;
  const hasPatients = data?.patients && data.patients.length > 0;

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search patients... (Cmd+K)"
          className="pl-9 pr-12 h-9 bg-background/50 border-input w-full focus-visible:ring-1 focus-visible:ring-primary/50"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
        />
        <div className="absolute right-2.5 flex items-center">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!isLoading && query.length === 0 && (
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-md shadow-lg overflow-hidden flex flex-col max-h-[400px]">
          <div className="overflow-y-auto p-2">
            {isLoading && !data && (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}
            
            {!isLoading && !isError && debouncedQuery.length > 0 && !hasPatients && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for &quot;{debouncedQuery}&quot;
              </div>
            )}

            {isError && (
              <div className="p-4 text-center text-sm text-destructive">
                Failed to execute search.
              </div>
            )}

            {!isLoading && hasPatients && (
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground truncate">
                  Patients
                </div>
                {data.patients.map((p) => (
                  <button
                    key={p.id}
                    className="w-full text-left flex flex-col gap-0.5 items-start px-2 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm cursor-pointer transition-colors"
                    onClick={() => handlePatientSelect(p)}
                  >
                    <span className="font-medium">{p.first_name} {p.last_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.phone || p.email || "No contact info"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
