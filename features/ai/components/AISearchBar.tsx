'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { aiSearch } from '../api';
import { useDebounce } from '@/hooks/useDebounce';

export function AISearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await aiSearch(debouncedQuery);
        setResults(data?.groups || []);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-xl hidden md:block">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="AI Search: 'Find John Doe' or 'Appointments tomorrow'" 
          className="pl-9 pr-10 rounded-full bg-muted/30 border-muted-foreground/20 focus-visible:ring-indigo-500 transition-shadow"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          ) : (
            <Sparkles className="h-4 w-4 text-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>

      {/* Floating Results Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
              <Sparkles className="h-6 w-6 text-indigo-300 mb-2" />
              No intelligent matches found.
            </div>
          ) : (
            <div className="py-2">
              {results.map((group, idx) => (
                <div key={idx} className="mb-2 last:mb-0">
                  <div className="px-4 py-1.5 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    {group.label}
                    <span className="bg-background px-2 py-0.5 rounded-full text-[10px]">{group.count}</span>
                  </div>
                  <div className="px-2">
                    {group.results?.map((res: any, rIdx: number) => (
                      <div key={rIdx} className="p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors flex flex-col gap-1" onClick={() => window.location.href = res.url}>
                        <span className="text-sm font-medium text-foreground">{res.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{res.subtitle}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
