import React from 'react';
import { Sparkles, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SlotSuggestion } from '@/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  suggestions: SlotSuggestion[];
  onSelect: (suggestion: SlotSuggestion) => void;
  isLoading?: boolean;
}

export function SmartSuggestions({ suggestions, onSelect, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4" />
        {[1, 2].map(i => (
          <div key={i} className="h-16 bg-muted rounded-lg w-full" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary/80 tracking-wider">
        <Sparkles className="h-3.5 w-3.5 fill-primary/20" />
        Smart Recommendations
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((s, idx) => {
          const start = typeof s.start_time === 'string' ? parseISO(s.start_time) : s.start_time;
          return (
            <button
              key={idx}
              onClick={() => onSelect(s)}
              className={cn(
                "group flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all text-left",
                idx === 0 && "ring-1 ring-primary/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-primary/10 group-hover:scale-110 transition-transform">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {format(start, 'EEEE, MMM do')}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold uppercase">
                        Best Fit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(start, 'h:mm a')}
                    </span>
                    <span className="text-primary/70 italic">• {s.reason}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
