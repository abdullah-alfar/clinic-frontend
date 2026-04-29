"use client";

import React, { useState } from "react";
import { Send, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIMessageList, AIMessage } from "./AIMessageList";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";

interface ClinicAIAssistantProps {
  onClose?: () => void;
  defaultContext?: Record<string, any>;
}

export function ClinicAIAssistant({ onClose, defaultContext }: ClinicAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await apiClient.post("/ai-agent/chat", {
        message: userMsg.content,
        session_id: sessionId,
        context: defaultContext,
      });

      // Update session ID if returned
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id);
      }

      const aiMsg: AIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.data.message,
        action: data.data.requires_confirmation ? data.data.action : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || "Failed to communicate with AI Agent");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAction = async (token: string) => {
    try {
      const { data } = await apiClient.post("/ai-agent/confirm", {
        token,
      });
      
      // Update the message containing the action to show the result
      setMessages((prev) => 
        prev.map(msg => 
          msg.action?.token === token 
            ? { ...msg, result: { message: data.data.message, data: data.data.result } }
            : msg
        )
      );
      toast.success("Action confirmed and executed successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || "Failed to execute action");
      // Optionally remove the action so they can't try again if it expired
      setMessages((prev) => 
        prev.map(msg => 
          msg.action?.token === token 
            ? { ...msg, action: undefined, content: msg.content + "\n\n(Action failed or expired)" }
            : msg
        )
      );
    }
  };

  const handleCancelAction = (messageId: string) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, action: undefined, content: msg.content + "\n\n(Action canceled)" }
          : msg
      )
    );
  };

  const handleDismissResult = (messageId: string) => {
    setMessages((prev) => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, result: undefined }
          : msg
      )
    );
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border shadow-2xl rounded-xl overflow-hidden w-[400px] max-h-[600px] absolute bottom-4 right-4 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Clinic AI Agent</h3>
            <p className="text-xs text-muted-foreground">Ready to assist and execute</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Message List */}
      <AIMessageList 
        messages={messages} 
        isLoading={isLoading} 
        onConfirmAction={handleConfirmAction}
        onCancelAction={handleCancelAction}
        onDismissResult={handleDismissResult}
      />

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. Book an appointment for Ahmad tomorrow..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
