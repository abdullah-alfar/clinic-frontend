'use client';

import { useSearchParams } from 'next/navigation';
import { useGlobalSearch } from '@/features/search/hooks/useSearch';
import { 
  Command, 
  FileText, 
  User, 
  Users, 
  Calendar, 
  CreditCard, 
  Bell, 
  Activity, 
  Brain, 
  Clock,
  Search,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
  doctor_availability: Clock,
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { data, isLoading, isError } = useGlobalSearch(query);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-muted/10 rounded-3xl border border-dashed border-border/60">
        <div className="h-20 w-20 bg-muted/40 rounded-full flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-muted-foreground opacity-30" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Search the Clinic</h1>
        <p className="text-muted-foreground max-w-sm">Type a query in the top search bar to find patients, doctors, medical records, or AI insights.</p>
      </div>
    );
  }

  const groups = data?.groups || [];
  const totalResults = groups.reduce((acc, g) => acc + g.count, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-10 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-border/40">
        <div className="space-y-2">
          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-primary/5 border-primary/20 text-primary">
            Search Results
          </Badge>
          <h1 className="text-4xl font-black tracking-tighter">
            Showing results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-muted-foreground">Found {totalResults} matches across the system.</p>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="h-6 w-32 rounded-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-32 rounded-3xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="p-20 text-center bg-destructive/5 border border-destructive/20 rounded-3xl">
           <Search className="h-12 w-12 text-destructive opacity-30 mx-auto mb-4" />
           <p className="text-lg font-bold text-destructive">Search failed</p>
           <p className="text-sm text-muted-foreground">Please try again later.</p>
        </div>
      )}

      {!isLoading && !isError && totalResults === 0 && (
         <div className="p-20 text-center bg-muted/10 border border-dashed border-border/60 rounded-3xl">
           <Search className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-4" />
           <h2 className="text-xl font-bold tracking-tight">No matches found</h2>
           <p className="text-sm text-muted-foreground">Try adjusting your keywords or using different query terms.</p>
         </div>
      )}

      {!isLoading && groups.map((group) => (
        <section key={group.type} className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-widest opacity-40">{group.label}</h2>
            <div className="flex-1 h-px bg-border/40" />
            <Badge variant="secondary" className="bg-muted/40 text-[10px] font-bold px-2.5 h-6">
              {group.count} matches
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.results.map((item) => {
              const Icon = IconMap[group.type] || Command;
              return (
                <Link key={item.id} href={item.url}>
                  <Card className="h-full hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-500 rounded-3xl border border-border/60 bg-background/40 backdrop-blur-sm group/card cursor-pointer">
                    <CardHeader className="flex flex-row items-start gap-4 pb-4">
                      <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover/card:bg-primary/10 transition-colors">
                        <Icon className="h-6 w-6 text-muted-foreground group-hover/card:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <CardTitle className="text-lg font-bold tracking-tight truncate group-hover/card:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground truncate opacity-70 mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 border-t border-border/30 pt-4">
                        <span>{item.description}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
