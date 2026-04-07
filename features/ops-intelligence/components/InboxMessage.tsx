import React from 'react';
import { Communication } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PriorityBadge } from './PriorityBadge';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface InboxMessageProps {
  message: Communication;
}

export const InboxMessage: React.FC<InboxMessageProps> = ({ message }) => {
  const [reply, setReply] = React.useState('');

  return (
    <Card className="flex flex-col h-full border-primary/20 shadow-lg">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{message.patient_name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{message.channel}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <PriorityBadge priority={message.priority} />
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-6 space-y-4">
        {/* Mock AI Analysis Section */}
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex gap-3 items-start">
          <Sparkles className="h-5 w-5 text-primary mt-1" />
          <div className="text-sm">
            <p className="font-semibold text-primary">AI Insight</p>
            <p>This message is classified as <span className="font-bold underline">{message.category}</span>. 
            Patient seems {message.priority === 'urgent' ? 'highly distressed' : 'to be inquiring about services'}.</p>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col gap-2">
          <div className={`max-w-[80%] p-4 rounded-2xl ${message.direction === 'inbound' ? 'bg-muted self-start rounded-tl-none' : 'bg-primary text-primary-foreground self-end rounded-tr-none'}`}>
            <p className="text-sm">{message.message}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 bg-muted/10">
        <div className="w-full space-y-3">
          <Textarea 
            placeholder="Type your reply here..." 
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="min-h-[100px] resize-none focus-visible:ring-primary"
          />
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" className="gap-2 text-primary">
              <Bot className="h-4 w-4" />
              AI Suggest Reply
            </Button>
            <Button size="sm" className="gap-2 px-6" disabled={!reply.trim()}>
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
