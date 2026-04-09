import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Command, FileText, User, Users, Calendar, CreditCard, Bell, Activity, Brain, Clock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGlobalSearch } from "../hooks/useSearch";
import { SearchResultItem, SearchResultGroup } from "../types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const IconMap: Record<string, any> = {
  patients: Users,
  doctors: User,
  appointments: Calendar,
  invoices: CreditCard,
  reports: FileText,
  notes: Command,
  notifications: Bell,
  memory: Brain,
  audit_logs: Activity,
  doctor_schedules: Clock,
};

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
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResultItem) => {
    setOpen(false);
    setQuery("");
    router.push(item.url);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isDebouncing = query !== debouncedQuery;
  const showResults = open && query.length > 0;
  const groups = data?.groups || [];
  const hasResults = groups.some(g => g.results && g.results.length > 0);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <form onSubmit={handleFullSearch} className="relative group">
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
          open ? "text-primary" : "text-muted-foreground"
        )} />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search everything... (⌘K)"
          className="pl-11 pr-12 h-10 bg-background/50 border-input w-full focus-visible:ring-1 focus-visible:ring-primary/50 transition-all rounded-xl"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!isLoading && query.length === 0 && (
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </form>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-in fade-in zoom-in-95 duration-200">
          <div className="overflow-y-auto p-2 space-y-4">
            {(isLoading || isDebouncing) && !data && (
              <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching across modules...
              </div>
            )}

            {isDebouncing && data && (
              <div className="px-4 py-2 bg-primary/5 text-[10px] font-bold uppercase tracking-tighter text-primary/60 border-b border-primary/10 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating results...
              </div>
            )}
            
            {!isLoading && !isDebouncing && !isError && debouncedQuery.length > 0 && !hasResults && (
              <div className="p-8 text-center text-sm text-muted-foreground italic">
                No results found for &quot;{debouncedQuery}&quot;
              </div>
            )}

            {isError && (
              <div className="p-8 text-center text-sm text-destructive">
                An error occurred while searching.
              </div>
            )}

            {!isLoading && groups.map((group: SearchResultGroup) => (
              <div key={group.type} className="space-y-1">
                <div className="px-3 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {group.label}
                  </span>
                  <Badge variant="outline" className="text-[10px] h-4 px-1 opacity-50">
                    {group.count}
                  </Badge>
                </div>
                <div className="grid gap-1">
                  {group.results.map((item) => {
                    const Icon = IconMap[group.type] || Command;
                    return (
                      <button
                        key={item.id}
                        className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-accent hover:text-accent-foreground group/item transition-all"
                        onClick={() => handleSelect(item)}
                      >
                        <div className="mt-1 h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover/item:bg-background transition-colors shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground truncate opacity-70">{item.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!isLoading && hasResults && (
            <div className="p-2 border-t border-border/50 bg-muted/20">
              <button 
                className="w-full py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={handleFullSearch}
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
