'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessagesSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAI } from '../api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Clinic AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await chatWithAI(userMsg, sessionId);
      setSessionId(res.session_id);
      setMessages(prev => [...prev, { role: 'assistant', content: res.message }]);
      
      // Handle action hints if UI wants to actively navigate based on AI decision
      if (res.action === 'navigate_appointments') {
        window.location.href = '/appointments';
      }
    } catch (e: any) {
      toast.error('AI is resting.', { description: e.message || "Failed to reach AI Core." });
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I am currently experiencing connection issues." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:scale-105 transition-transform bg-indigo-600 hover:bg-indigo-700"
      >
        <MessagesSquare className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[350px] shadow-2xl rounded-2xl bg-background border flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold text-sm">Clinic AI Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px] min-h-[300px] bg-muted/10">
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "px-4 py-2 rounded-2xl max-w-[85%] text-sm",
              msg.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-sm" 
                : "bg-muted text-foreground border rounded-tl-sm prose prose-sm prose-p:leading-relaxed"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="px-4 py-3 rounded-2xl bg-muted border rounded-tl-sm">
               <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-background border-t">
        <div className="relative flex items-center">
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..." 
            className="pr-10 rounded-xl"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
