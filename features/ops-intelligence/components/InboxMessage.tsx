import React from 'react';
import { Communication } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PriorityBadge } from './PriorityBadge';
import { Send, User, Bot, Sparkles, Phone, MessageCircle, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InboxMessageProps {
  message: Communication;
}

export const InboxMessage: React.FC<InboxMessageProps> = ({ message }) => {
  const [reply, setReply] = React.useState('');

  return (
    <Card className="flex flex-col h-full border-border/50 shadow-2xl shadow-black/5 rounded-3xl overflow-hidden bg-white/80 dark:bg-black/40 backdrop-blur-xl">
      <CardHeader className="p-6 border-b border-border/40 bg-muted/20 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-2xl shadow-sm border-2 border-background">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {message.patient_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-extrabold tracking-tight">{message.patient_name}</CardTitle>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                <span className="flex items-center gap-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Online
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{message.channel}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Last seen {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/60 hover:text-primary transition-all">
                <Phone className="h-4 w-4" />
             </Button>
             <PriorityBadge priority={message.priority} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {/* Mock AI Analysis Section */}
        <div className="group bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-500">
          <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-2 mb-1">
               <span className="font-extrabold text-primary uppercase tracking-widest text-[10px]">AI Strategic Insight</span>
               <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-[9px] font-bold px-1.5 py-0">NEW</Badge>
            </div>
            <p className="text-foreground/80 font-medium leading-relaxed">
               This request is related to <span className="font-bold text-foreground">{message.category}</span>. 
               The patient's sentiment is {message.priority === 'urgent' ? 'highly urgent' : 'informative'}. 
               <span className="block mt-1 text-primary/70 italic text-[11px]">Recommended action: Propose an appointment for tomorrow afternoon.</span>
            </p>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col gap-2">
          <div className={cn(
            "max-w-[85%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed",
            message.direction === 'inbound' 
              ? 'bg-muted/50 self-start rounded-tl-none border border-border/40' 
              : 'bg-primary text-primary-foreground self-end rounded-tr-none shadow-lg shadow-primary/20 font-medium'
          )}>
            {message.message}
          </div>
          <span className={cn(
             "text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mx-1",
             message.direction === 'inbound' ? 'self-start' : 'self-end'
          )}>
             Sent {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 bg-muted/10 border-t border-border/40">
        <div className="w-full space-y-4">
          <div className="relative group">
            <Textarea 
              placeholder="Type your strategic response..." 
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="min-h-[120px] rounded-2xl resize-none bg-background border-border/60 focus-visible:ring-primary focus-visible:border-primary/50 transition-all shadow-inner p-4 text-sm"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <Paperclip className="h-4 w-4" />
               </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-primary font-extrabold uppercase tracking-widest text-[10px] hover:bg-primary/10 transition-all">
              <Bot className="h-4 w-4" />
              AI Draft Assist
            </Button>
            <Button size="sm" className="rounded-xl gap-2 px-8 font-bold shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50" disabled={!reply.trim()}>
              <Send className="h-4 w-4" />
              Send Securely
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
