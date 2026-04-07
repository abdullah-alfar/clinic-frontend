import React from 'react';
import { useFollowUps } from '../hooks/useFollowUps';
import { FollowUpList } from './FollowUpList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, AlertCircle, CalendarRange } from 'lucide-react';

export function FollowUpDashboard() {
  const todayQuery = useFollowUps({ due_today: true, status: 'pending' });
  const overdueQuery = useFollowUps({ overdue: true, status: 'pending' });
  const allPendingQuery = useFollowUps({ status: 'pending' });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Due Today" 
          count={todayQuery.data?.length || 0} 
          icon={<CalendarRange className="h-4 w-4 text-primary" />}
          loading={todayQuery.isLoading}
        />
        <StatsCard 
          title="Overdue" 
          count={overdueQuery.data?.length || 0} 
          icon={<AlertCircle className="h-4 w-4 text-destructive" />}
          loading={overdueQuery.isLoading}
          variant="destructive"
        />
        <StatsCard 
          title="All Pending" 
          count={allPendingQuery.data?.length || 0} 
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
          loading={allPendingQuery.isLoading}
        />
      </div>

      <Card className="border-none shadow-sm shadow-primary/5">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Active Follow-ups
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="all">All Pending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today">
              <FollowUpList 
                followups={todayQuery.data} 
                isLoading={todayQuery.isLoading} 
                emptyMessage="No follow-ups due today." 
              />
            </TabsContent>
            
            <TabsContent value="overdue">
              <FollowUpList 
                followups={overdueQuery.data} 
                isLoading={overdueQuery.isLoading} 
                emptyMessage="Great! No overdue follow-ups." 
              />
            </TabsContent>
            
            <TabsContent value="all">
              <FollowUpList 
                followups={allPendingQuery.data} 
                isLoading={allPendingQuery.isLoading} 
                emptyMessage="No pending follow-ups." 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, count, icon, loading, variant = 'default' }: { title: string; count: number; icon: React.ReactNode; loading: boolean; variant?: 'default' | 'destructive' }) {
  return (
    <Card className={`border-none shadow-sm ${variant === 'destructive' ? 'bg-destructive/5' : 'bg-primary/5'}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          {loading ? (
             <div className="h-6 w-8 bg-muted animate-pulse rounded mt-1" />
          ) : (
            <p className={`text-2xl font-bold mt-1 ${variant === 'destructive' ? 'text-destructive' : 'text-foreground'}`}>{count}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${variant === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
