import React from 'react';
import { useCommunications } from '../api';
import { PriorityBadge } from './PriorityBadge';
import { InboxMessage } from './InboxMessage';
import { MessageSquare, Phone, Mail, Clock, Search, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const InboxList: React.FC = () => {
  const { data: messages, isLoading } = useCommunications();
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'urgent'>('all');

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[80vh]">
      <Skeleton className="col-span-1 rounded-3xl" />
      <Skeleton className="col-span-2 rounded-3xl" />
    </div>
  );

  const filteredMessages = messages?.filter(m => {
    if (filter === 'unread') return m.status === 'unread';
    if (filter === 'urgent') return m.priority === 'urgent';
    return true;
  }) || [];

  const selectedMessage = messages?.find(m => m.id === selectedMessageId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[75vh]">
      {/* Sidebar List */}
      <Card className="col-span-1 flex flex-col border-border/50 shadow-xl shadow-black/5 rounded-3xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-xl">
        <CardHeader className="p-6 border-b border-border/40 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-xl tracking-tight">Messages</h3>
            <Badge variant="secondary" className="rounded-lg font-bold px-2 py-0.5">{filteredMessages.length}</Badge>
          </div>
          
          <div className="flex gap-2">
            {(['all', 'unread', 'urgent'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                  filter === f 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                    : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="space-y-1">
            {filteredMessages.map(message => (
              <div 
                key={message.id} 
                className={cn(
                  "p-4 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden active:scale-[0.98]",
                  selectedMessageId === message.id 
                    ? "bg-primary/5 border border-primary/20 shadow-sm" 
                    : "hover:bg-accent/50 border border-transparent"
                )}
                onClick={() => setSelectedMessageId(message.id)}
              >
                {selectedMessageId === message.id && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                )}
                
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shadow-sm bg-white dark:bg-muted border border-border/40",
                      selectedMessageId === message.id ? "text-primary" : "text-muted-foreground"
                    )}>
                      <ChannelIcon channel={message.channel} />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{message.patient_name}</span>
                  </div>
                  <PriorityBadge priority={message.priority} />
                </div>
                
                <p className={cn(
                  "text-xs line-clamp-1 mb-3 transition-colors",
                  message.status === 'unread' ? "font-bold text-foreground" : "text-muted-foreground opacity-70"
                )}>
                  {message.message}
                </p>
                
                <div className="flex justify-between items-center opacity-70">
                  <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest bg-muted/30 border-none transition-colors group-hover:bg-muted/50">
                    {message.category}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Details */}
      <div className="col-span-2 h-full">
        {selectedMessage ? (
          <InboxMessage message={selectedMessage} />
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-muted-foreground bg-white/30 dark:bg-black/20 border-border/40 border-dashed border-2 rounded-3xl">
            <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 opacity-20" />
            </div>
            <p className="font-bold text-lg tracking-tight">No conversation selected</p>
            <p className="text-xs opacity-60">Select a message from the sidebar to start replying</p>
          </Card>
        )}
      </div>
    </div>
  );
};

const ChannelIcon: React.FC<{ channel: string }> = ({ channel }) => {
  switch (channel) {
    case 'whatsapp': return <Phone className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    default: return <MessageSquare className="h-4 w-4" />;
  }
};
