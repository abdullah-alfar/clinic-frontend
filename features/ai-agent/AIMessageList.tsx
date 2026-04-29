"use client";

import React, { useRef, useEffect } from "react";
import { User, Bot } from "lucide-react";
import { AIActionConfirmation } from "./AIActionConfirmation";
import { AIActionResultCard } from "./AIActionResultCard";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: any; // Pending action requiring confirmation
  result?: { message: string; data?: any }; // Result of a confirmed action
}

interface AIMessageListProps {
  messages: AIMessage[];
  onConfirmAction: (token: string) => Promise<void>;
  onCancelAction: (messageId: string) => void;
  onDismissResult: (messageId: string) => void;
  isLoading: boolean;
}

export function AIMessageList({ messages, onConfirmAction, onCancelAction, onDismissResult, isLoading }: AIMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
          Start typing to interact with the AI Agent...
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
          <div className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className="flex flex-col gap-2 w-full">
              <div className={`px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm whitespace-pre-wrap"}`}>
                {msg.content}
              </div>
              
              {msg.role === "assistant" && msg.action && !msg.result && (
                <AIActionConfirmation 
                  action={msg.action} 
                  onConfirm={onConfirmAction}
                  onCancel={() => onCancelAction(msg.id)}
                />
              )}
              
              {msg.role === "assistant" && msg.result && (
                <AIActionResultCard 
                  message={msg.result.message}
                  resultData={msg.result.data}
                  onDismiss={() => onDismissResult(msg.id)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-start gap-2 max-w-[85%]">
          <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
            <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}
